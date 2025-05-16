import { CronAdapter } from "@/core/adapters";
import { VersionQuotationCron } from "./versionQuotation/versionQuotation.cron";

export interface CronJob {
  execute(): Promise<void>;
}


export class AppCron {


  static runJobs() {
    const versionQuotationCron = new VersionQuotationCron();
    CronAdapter.addAndRunJob("0 0 * * *", versionQuotationCron); // Run every day at midnight

    console.log("Cron jobs working");
  }


}
