import type { CronJob } from "@/presentation/cron";
import { schedule } from "node-cron";

export class CronAdapter {
  public static addAndRunJob(cronExpression: string, job: CronJob): void {
    schedule(cronExpression, async () => {
      await job.execute();
    });
  }
}
