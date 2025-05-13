import { DateAdapter } from "@/core/adapters/date.adapter";
import type { CronJob } from "../cron";
import { prisma } from "@/infrastructure/models";

export class VersionQuotationCron implements CronJob {
  private async deleteOldArchivedVersions(date: Date) {
    return await prisma.$transaction(async (tx) => {
      // Obtener versiones a eliminar
      const versionsToDelete = await tx.version_quotation.findMany({
        where: {
          is_deleted: true,
          deleted_at: {
            lte: date,
          },
        },
        select: {
          version_number: true,
          quotation_id: true,
        },
      });

      if (versionsToDelete.length === 0) return 0;

      const affectedQuotationIds = Array.from(
        new Set(versionsToDelete.map((v) => v.quotation_id))
      );

      // Eliminar versiones
      const deleteResult = await tx.version_quotation.deleteMany({
        where: {
          is_deleted: true,
          deleted_at: {
            lte: date,
          },
        },
      });

      // Verificar qué cotizaciones aún tienen versiones
      const remainingVersions = await tx.version_quotation.findMany({
        where: {
          quotation_id: {
            in: affectedQuotationIds,
          },
        },
        select: {
          quotation_id: true,
        },
      });

      const quotationsWithRemainingVersions = new Set(
        remainingVersions.map((v) => v.quotation_id)
      );

      const quotationIdsToDelete = affectedQuotationIds.filter(
        (id) => !quotationsWithRemainingVersions.has(id)
      );

      if (quotationIdsToDelete.length > 0) {
        await tx.quotation.deleteMany({
          where: {
            id_quotation: {
              in: quotationIdsToDelete,
            },
          },
        });
      }

      return deleteResult.count;
    });
  }

  public async execute(): Promise<void> {
    if (!DateAdapter.isLastDayOfMonth()) return; //* Exit if not the last day of the month

    const lastDate = DateAdapter.getLastDayOfMonth(); //* Get the date one month ago
    console.log(
      `🧹 Último día del mes. Eliminando versiones antes de: ${lastDate.toISOString()}`
    );

    try {
      const count = await this.deleteOldArchivedVersions(lastDate); //* Delete versions older than one month
      console.log(`✅ Eliminados ${count} registros archivados`);
    } catch (error) {
      console.error("❌ Error al eliminar registros antiguos:", error);
    }
  }
}
