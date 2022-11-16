import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../application/auth.service';
import { EmailService } from '../../../../SMTP-adapter/email-service';
import { UsersService } from '../../../users/application/users.servive';
import { CreateUserDto } from '../../../users/api/models/create-user.dto';
import { UsersQueryRepository } from '../../../users/api/users.query.repository';
import { CheckDuplicateEmailGuard } from '../guards/check-duplicate-email.guard';
import { RegistrationConfirmationAuthDto } from './models/registration-confirmation.auth.dto';
import { createErrorMessage } from '../helpers/create-error-message';
import { RegistrationEmailResendingAuthDto } from './models/registration-email-resending.auth.dto';
import { LoginAuthDto } from './models/login.auth.dto';
import { AccessTokenViewModel } from './models/accessTokenViewModel';
import { response } from 'express';
import { AccesssTokenAuthDto } from './models/accesss-token.auth.dto';
import { JwtUtility } from '../../../../JWT-utility/jwt-utility';
import { extractDeviceIdFromRefreshToken } from '../helpers/extractDeviceIdFromRefreshToken';
import { EmailAuthDto } from './models/email-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly emailService: EmailService,
    private readonly usersService: UsersService,
    private readonly usersQueryRepository: UsersQueryRepository,
    private readonly jwtUtility: JwtUtility,
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

  @Post('login')
  // @UseGuards(GetUserFromTokenGuard)
  async login(
    @Body() inputModel: LoginAuthDto,
    @Request() req,
  ): Promise<AccessTokenViewModel> {
    // if (req.cookies?.refreshToken) {
    //   await this.authService.addRefreshTokenToBlackList(
    //     req.cookies?.refreshToken,
    //   );
    // }
    const newAccessToken = await this.authService.createAccessToken(
      inputModel.login,
      '600000',
    );
    const newRefreshToken = await this.authService.createRefreshToken(
      inputModel.login,
      '200000',
    );
    await this.authService.saveDeviceInputInDB(
      newRefreshToken,
      req.ip,
      req.headers['user-agent'],
    );
    response.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 200 * 1000,
    });
    return { accessToken: newAccessToken };
  }

  @Post('refresh-token')
  async updateRefreshToken(
    @Body() inputModel: AccesssTokenAuthDto,
    @Request() req,
  ): Promise<AccessTokenViewModel> {
    const oldRefreshToken = req.cookies?.refreshToken;
    const userId = await this.jwtUtility.extractUserIdFromToken(
      oldRefreshToken,
    );
    const deviceId = extractDeviceIdFromRefreshToken(oldRefreshToken);
    const newAccessToken = await this.authService.createAccessToken(
      userId!.toString(),
      '600000',
    );
    const newRefreshToken = await this.jwtUtility.createRefreshJWT(
      userId!.toString(),
      deviceId!,
      '200000',
    );
    await this.authService.updateRefreshToken(
      oldRefreshToken,
      newRefreshToken,
      req.ip,
    );
    response.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 200 * 1000,
    });

    return { accessToken: newAccessToken };
  }

  @Post('passwordRecovery')
  @HttpCode(204)
  async passwordRecovery(@Body() inputModel: EmailAuthDto) {
    const email = inputModel.email;
    const user = await this.usersService.findUserByEmail(email);
    if (!user) return;
    await this.emailService.sendEmailRecoveryCode(
      inputModel.email,
      user.emailConfirmation.confirmationCode,
    );
    return;
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
