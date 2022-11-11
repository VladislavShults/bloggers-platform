import { Controller, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { TestingService } from './testing.service';

@Controller('testing')
export class TestingController {
  constructor(private readonly testingService: TestingService) {}
  @Delete('all-data')
  @HttpCode(204)
  async deleteAllData(): Promise<HttpStatus> {
    await this.testingService.clearAllData();
    return;
  }
}
