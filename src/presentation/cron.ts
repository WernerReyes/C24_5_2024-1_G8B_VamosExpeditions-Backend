import { CronAdapter } from "@/core/adapters";
import { VersionQuotationCron } from "./versionQuotation/versionQuotation.cron";
export interface CronJob {
    execute(): Promise<void>;
  }
export class AppCron {
  static runJobs() {
    const versionQuotationCron = new VersionQuotationCron();
    CronAdapter.addAndRunJob("0 0 1 * *", versionQuotationCron);
  }
}
