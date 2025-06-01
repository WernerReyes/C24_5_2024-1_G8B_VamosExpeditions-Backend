import type { CronJob } from "@/presentation/cron";
import cron from "node-cron";

export class CronAdapter {
  static jobs: Record<string, cron.ScheduledTask> = {};

  static addAndRunJob(
    cronExpression: string,
    job: CronJob | CronJob[],
    key = ""
  ) {
    
    if (key && this.jobs[key]) {
      this.jobs[key].stop();
    }

    const task = cron.schedule(cronExpression, async () => {
      if (Array.isArray(job)) {
        for (const j of job) {
          await j.execute();
        }
        return;
      }

      await job.execute();
    });

    if (key) {
      this.jobs[key] = task;
    }

    task.start();
  }
}
