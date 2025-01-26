import type { quotation } from "@prisma/client";
import {
  type VersionQuotation,
  VersionQuotationEntity,
} from "./versionQuotation.entity";
import { Validations } from "@/core/utils";
import { CustomError } from "../error";

export type Quotation = quotation & {
  version_quotation?: VersionQuotation[];
};

export class QuotationEntity {
  private constructor(
    public readonly id: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly versions?: VersionQuotationEntity[]
  ) {}

  public static fromObject(quotation: Quotation): QuotationEntity {
    const { id_quotation, created_at, updated_at, version_quotation } =
      quotation;

    const error = Validations.validateEmptyFields(
      {
        id_quotation,
        created_at,
        updated_at,
      },
      "QuotationEntity"
    );

    if (error) throw CustomError.badRequest(error);

    return new QuotationEntity(
      id_quotation,
      created_at,
      updated_at,
      version_quotation
        ? version_quotation.map(VersionQuotationEntity.fromObject)
        : undefined
    );
  }
}
