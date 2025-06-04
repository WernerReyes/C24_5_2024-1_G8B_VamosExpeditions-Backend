import { CronAdapter } from "@/core/adapters";
import { SettingKeyEnum, SettingModel } from "@/infrastructure/models";
import { VersionQuotationCron } from "./versionQuotation/versionQuotation.cron";

export interface CronJob {
  execute(): Promise<void>;
}

export class AppCron {
  private static instance: AppCron;

  public static getInstance(): AppCron {
    if (!AppCron.instance) {
      AppCron.instance = new AppCron();
    }

    return AppCron.instance;
  }

  static async runJobs() {
    const cron = AppCron.getInstance();
    // await cron.scheduleDynamicCleanup();

    CronAdapter.addAndRunJob("* 0 * * *", {
      execute: async () => {
        await cron.scheduleDynamicCleanup();
      },
    }); //* Execute every day at 00:00

    console.log("Cron jobs working");
  }

  public async scheduleDynamicCleanup() {
    // Leer días desde BD
    const setting = await SettingModel.findFirst({
      where: { key: SettingKeyEnum.DATA_CLEANUP_PERIOD },
      select: { value: true, updated_at: true },
    });

    const lastCleanup = await SettingModel.findFirst({
      where: { key: SettingKeyEnum.LAST_CLEANUP_RUN },
      select: { value: true, id: true },
    });

    const days = parseInt(setting?.value ?? "0");
    if (!days) return;

    const now = new Date();
    const lastRunDate = lastCleanup
      ? new Date(lastCleanup.value as string)
      : new Date(0);

    const diffDays = Math.floor(
      (now.getTime() - lastRunDate.getTime()) / (1000 * 3600 * 24)
    );
    if (diffDays >= days) {
      console.log(`🧹 Running data cleanup after ${diffDays} days`);

      const versionQuotationCron = new VersionQuotationCron();
      await versionQuotationCron.execute();
     
      await SettingModel.upsert({
        where: {
          id: lastCleanup?.id ?? 0,
        },
        update: { value: now.toISOString() },
        create: {
          key: SettingKeyEnum.LAST_CLEANUP_RUN,
          value: now.toISOString(),
        },
      })
    } else {
      console.log(`⏳ Only ${diffDays}/${days} days passed since last cleanup`);
    }
  }
}
