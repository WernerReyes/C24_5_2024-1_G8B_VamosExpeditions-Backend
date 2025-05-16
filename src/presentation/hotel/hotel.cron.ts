import { CronJob } from "../cron";




export class HotelCron implements CronJob {

  private isLastDayOfMonth(date: Date): boolean {
    const tomorrow = new Date(date);
    tomorrow.setDate(date.getDate() + 1);
    return tomorrow.getDate() === 1;
  }

  private getOneMonthAgo(): Date {
    const now = new Date();
    console.log("now",now.toISOString());
    const oneMonthAgo = new Date(now);

    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    console.log("oneMonthAgo",oneMonthAgo.toISOString());
    const lastDay = new Date(
      oneMonthAgo.getFullYear(),
      oneMonthAgo.getMonth() + 1,
      0
    ).getDate();
    console.log("lastDay",lastDay);

    oneMonthAgo.setDate(Math.min(now.getDate(), lastDay));
    console.log("oneMonthAgo",oneMonthAgo.toISOString());
    return oneMonthAgo;
  }




   public async execute(): Promise<void> {
        //console.log(`Ejecutando cron de hotel ${new Date().toISOString()}`);
        console.log(`Ejecutando cron de hotel ${this.isLastDayOfMonth(new Date())}`);
        console.log(`Ejecutando cron de hotel ${this.getOneMonthAgo().toISOString()}`);
    }

}