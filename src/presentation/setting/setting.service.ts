import { SettingModel } from "@/infrastructure/models";
import { ApiResponse } from "../response";
import { SettingEntity } from "@/domain/entities/settting.entity";

export class SettingService {
  async getAll() {
    const settings = SettingModel.findMany({
      select: {
        id: true,
        key: true,
        description: true,
        value: true,
        updated_at: true,
        user: {
          select: {
            id_user: true,
            fullname: true,
            email: true,
          },
        },
      },
    });
    return new ApiResponse<SettingEntity[]>(
      200,
      "Settings found",
      await Promise.all(
        (
          await settings
        ).map(async (setting) => {
          return await SettingEntity.fromObject(setting);
        })
      )
    );
  }
}
