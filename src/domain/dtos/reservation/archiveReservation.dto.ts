import { Validations } from "@/core/utils";

export class ArchiveReservationDto {
  constructor(
    public readonly id: number,
    public readonly deleteReason?: string
  ) {}

  public static create(props: {
    [key: string]: any;
  }): [string?, ArchiveReservationDto?] {
    const { deleteReason, id } = props;

    const numberError = Validations.validateNumberFields({
      id,
    });
    if (numberError) return [numberError];
    if (deleteReason) {
      const error = Validations.validateStringFields({
        deleteReason,
      });
      if (error) return [error];
    }

    return [undefined, new ArchiveReservationDto(+id, deleteReason)];
  }
}
