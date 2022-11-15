import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../application/auth.service';
import { EmailService } from '../../../SMTP-adapter/email-service';
import { UsersService } from '../../users/application/users.servive';
import { CreateUserDto } from '../../users/api/models/create-user.dto';
import { UsersQueryRepository } from '../../users/api/users.query.repository';
import { CheckDuplicateEmailGuard } from '../guards/check-duplicate-email.guard';
import { RegistrationConfirmationAuthDto } from './models/registration-confirmation.auth.dto';
import { createErrorMessage } from '../helpers/create-error-message';
import { RegistrationEmailResendingAuthDto } from './models/registration-email-resending.auth.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly emailService: EmailService,
    private readonly usersService: UsersService,
    private readonly usersQueryRepository: UsersQueryRepository,
  ) {}

  @Post('registration')
  @HttpCode(204)
  @UseGuards(CheckDuplicateEmailGuard)
  async registration(@Body() inputModel: CreateUserDto): Promise<HttpStatus> {
    const newUserObjectId = await this.usersService.createUser(inputModel);
    const user = await this.usersQueryRepository.getUserByIdDBType(
      newUserObjectId.toString(),
    );
    await this.emailService.sendEmailRecoveryCode(
      inputModel.email,
      user!.emailConfirmation.confirmationCode,
    );
    return;
  }

  @Post('registration-confirmation')
  @HttpCode(204)
  async registrationConfirmation(
    @Body()
    inputModel: RegistrationConfirmationAuthDto,
  ): Promise<HttpStatus> {
    const userByConfirmationCode =
      await this.authService.findAccountByConfirmationCode(inputModel.code);
    if (!userByConfirmationCode)
      throw new BadRequestException(createErrorMessage('Code'));
    if (userByConfirmationCode.emailConfirmation.isConfirmed)
      throw new BadRequestException(createErrorMessage('Code'));
    const verifiedAccount = await this.authService.confirmAccount(
      userByConfirmationCode._id.toString(),
    );
    if (!verifiedAccount) {
      throw new BadRequestException(createErrorMessage('Code'));
    }
    return;
  }

  @Post('registration-email-resending')
  @HttpCode(204)
  async registrationEmailResending(
    @Body() inputModel: RegistrationEmailResendingAuthDto,
  ): Promise<HttpStatus> {
    const confirmationCode = await this.authService.refreshConfirmationCode(
      inputModel.email,
    );
    const accountIsConfirmed = await this.authService.accountIsConfirmed(
      inputModel.email,
    );
    if (confirmationCode && !accountIsConfirmed) {
      await this.emailService.sendEmailRecoveryCode(
        inputModel.email,
        confirmationCode,
      );
      return;
    } else throw new BadRequestException(createErrorMessage('Email'));
  }

  // create(@Body() createAuthDto: CreateAuthDto) {
  //   return this.authService.create(createAuthDto);
  // }
  //
  // @Get()
  // findAll() {
  //   return this.authService.findAll();
  // }
  //
  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.authService.findOne(+id);
  // }
  //
  // @Put(':id')
  // update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
  //   return this.authService.update(+id, updateAuthDto);
  // }
  //
  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.authService.remove(+id);
  // }
}
