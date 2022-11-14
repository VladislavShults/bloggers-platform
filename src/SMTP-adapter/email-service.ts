import { Injectable } from '@nestjs/common';
import { EmailManager } from './email-manager';

@Injectable()
export class EmailService {
  constructor(private readonly emailManager: EmailManager) {}
  async sendEmailRecoveryCode(email: string, confirmationCode: string) {
    await this.emailManager.sendEmailRecoveryCode(email, confirmationCode);
  }
}
