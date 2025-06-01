import { prisma } from "@/infrastructure/models";
import type { CronJob } from "../cron";

export class VersionQuotationCron implements CronJob {
  private async deleteOldArchivedVersions() {
    return await prisma.$transaction(async (tx) => {
      // Obtener versiones a eliminar
      const versionsToDelete = await tx.version_quotation.findMany({
        where: {
          is_deleted: true,
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
    try {
      const count = await this.deleteOldArchivedVersions(); //* Delete versions older than one month
      console.log(`✅ Eliminados ${count} registros archivados`);
    } catch (error) {
      console.error("❌ Error al eliminar registros antiguos:", error);
    }
  }
}
