import type { IPartnerModel } from "@/infrastructure/models";
export class PartnerEntity {
  private constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly isDeleted?: boolean,
    public readonly deletedAt?: Date,
    public readonly deleteReason?: string,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date
    
  ) {}

  public static fromObject(partner: { [key: string]: any }): PartnerEntity {
    const { id, name , created_at,is_deleted,delete_reason,updated_at} = partner as IPartnerModel;
    return new PartnerEntity(
      id, 
      name,
      is_deleted ?? undefined,
      partner.deleted_at ? new Date(partner.deleted_at) : undefined,
      delete_reason ?? undefined,
      created_at ? new Date(created_at) : undefined,
      updated_at ? new Date(updated_at) : undefined
      
    );
  }
}
