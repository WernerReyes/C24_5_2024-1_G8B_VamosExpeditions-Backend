import { VersionQuotationModel } from "@/data/postgres";
import type { CronJob } from "../cron";

export class VersionQuotationCron implements CronJob {
  private isLastDayOfMonth(date: Date): boolean {
    const tomorrow = new Date(date);
    tomorrow.setDate(date.getDate() + 1);
    return tomorrow.getDate() === 1;
  }

  private getOneMonthAgo(): Date {
    const now = new Date();
    const oneMonthAgo = new Date(now);
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const lastDay = new Date(
      oneMonthAgo.getFullYear(),
      oneMonthAgo.getMonth() + 1,
      0
    ).getDate();

    oneMonthAgo.setDate(Math.min(now.getDate(), lastDay));

    return oneMonthAgo;
  }

  private async deleteOldArchivedVersions(date: Date) {
    const result = await VersionQuotationModel.deleteMany({
      where: {
        is_archived: true,
        archived_at: {
          lte: date,
        },
      },
    });

    return result.count;
  }

  public async execute(): Promise<void> {
    const today = new Date();

    if (!this.isLastDayOfMonth(today)) return; //* Exit if not the last day of the month

    const limitDate = this.getOneMonthAgo();
    console.log(
      `🧹 Último día del mes. Eliminando versiones antes de: ${limitDate.toISOString()}`
    );

    try {
      const count = await this.deleteOldArchivedVersions(limitDate); //* Delete versions older than one month
      console.log(`✅ Eliminados ${count} registros archivados`);
    } catch (error) {
      console.error("❌ Error al eliminar registros antiguos:", error);
    }
  }
}
