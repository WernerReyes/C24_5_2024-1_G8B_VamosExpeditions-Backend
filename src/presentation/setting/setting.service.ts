import { UpdateSettingDto } from "@/domain/dtos";
import { SettingEntity } from "@/domain/entities/settting.entity";
import { SettingKeyEnum, SettingModel } from "@/infrastructure/models";
import { ApiResponse } from "../response";
import type { UserEntity } from "@/domain/entities";

export class SettingService {
  constructor() {}

  async getAll(userId: UserEntity["id"]) {
    const settings = SettingModel.findMany({
      where: {
        AND: [
          {
            OR: [
              {
                user_id: userId,
              },
              {
                user_id: null,
              },
            ],
          },
        ],
      },
      select: {
        id: true,
        key: true,
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

  async getByKey(key: SettingKeyEnum) {
    const setting = await SettingModel.findFirst({
      where: {
        key: key,
      },
      select: {
        id: true,
        key: true,
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

    return new ApiResponse<SettingEntity>(
      200,
      "Setting found",
      await SettingEntity.fromObject(setting!)
    );
  }

  async updateTwoFactorAuth(updateSettingDto: UpdateSettingDto) {
    const updatedSetting = await SettingModel.update({
      where: {
        id: updateSettingDto.id,
        key: SettingKeyEnum.TWO_FACTOR_AUTH,
      },
      data: {
        value: updateSettingDto.value,
        updated_at: new Date(),
      },
    });

    return new ApiResponse<SettingEntity>(
      200,
      "Setting updated",
      await SettingEntity.fromObject(updatedSetting)
    );
  }
  async updateDynamicCleanup(updateSettingDto: UpdateSettingDto) {
    const updatedSetting = await SettingModel.update({
      where: {
        id: updateSettingDto.id,
        key: SettingKeyEnum.DATA_CLEANUP_PERIOD,
      },
      data: {
        value: updateSettingDto.value,
        updated_at: new Date(),
        updated_by_id: updateSettingDto.userId,
      },
    });

    return new ApiResponse<SettingEntity>(
      200,
      "Setting updated",
      await SettingEntity.fromObject(updatedSetting)
    );
  }

  async updateMaxActiveSessions(updateSettingDto: UpdateSettingDto) {
    const updatedSetting = await SettingModel.update({
      where: {
        id: updateSettingDto.id,
        key: SettingKeyEnum.MAX_ACTIVE_SESSIONS,
        user_id: updateSettingDto.userId,
      },
      data: {
        value:
          updateSettingDto.value === "Infinite" ? null : updateSettingDto.value,
        updated_at: new Date(),
        user_id: updateSettingDto.userId,
      },
    });

    return new ApiResponse<SettingEntity>(
      200,
      "Setting updated",
      await SettingEntity.fromObject(updatedSetting)
    );
  }
}
