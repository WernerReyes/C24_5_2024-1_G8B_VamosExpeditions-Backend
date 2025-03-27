import { SendMailOptions } from "../nodemailer/email.service";

export interface Strategy {
  sendMailWithPDF(data: SendMailOptions): Promise<boolean>;
}

export class ContextStrategy {
  private strategy: Strategy;

  constructor(strategy: Strategy) {
    this.strategy = strategy;
  }

  public setStrategy(strategy: Strategy) {
    this.strategy = strategy;
  }

  public async executeStrategy(data: SendMailOptions) {
    await this.strategy.sendMailWithPDF(data);
    return true;
  }
}
