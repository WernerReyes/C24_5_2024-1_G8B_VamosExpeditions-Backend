import { CronAdapter } from "@/core/adapters";
import { SettingKeyEnum, SettingModel } from "@/infrastructure/models";
import { VersionQuotationCron } from "./versionQuotation/versionQuotation.cron";

export interface CronJob {
  execute(): Promise<void>;
}

export class AppCron {
  static async runJobs() {
    const cronExpression = await this.scheduleDynamicCleanup();

    const versionQuotationCron = new VersionQuotationCron();

    CronAdapter.addAndRunJob(
      cronExpression,
      versionQuotationCron,
      "data-cleanup"
    );

    console.log("Cron jobs working");
  }

  private static async scheduleDynamicCleanup() {
    // Leer días desde BD
    const setting = await SettingModel.findUnique({
      where: { key: SettingKeyEnum.DATA_CLEANUP_PERIOD },
    });

    const days = parseInt(setting?.value || "30");
    const cronExpression = `0 0 */${days} * *`; //* every {days} days

    return cronExpression;
  }
}
