import { Validations } from "@/core/utils";
import { VersionQuotationIDDto } from "./versionQuotationID.dto";

export class TrashDto<T = number> {
  constructor(
    public readonly id: T,
    public readonly deleteReason?: string
  ) {}

  public static create<T = number>(props: { [key: string]: any }): [string?, TrashDto<T>?] {
    const { deleteReason, id } = props;

    const emptyError = Validations.validateEmptyFields({
      id,
    });
    if (emptyError) return [emptyError];

    let idValidated: number | { versionNumber: number; quotationId: number } =
      id;

    if (typeof id === "object") {
      const [error, idDto] = VersionQuotationIDDto.create(id);
      if (error) return [error];
      idValidated = idDto!.versionQuotationId!;
    } else if (typeof id !== "number") {
      const numberError = Validations.validateNumberFields({
        id,
      });
      if (numberError) return [numberError];
      idValidated = +id;
    }

    if (deleteReason) {
      const error = Validations.validateStringFields({
        deleteReason,
      });
      if (error) return [error];
    }

    return [undefined, new TrashDto<T>(idValidated as T, deleteReason)];
  }
}
