import { Validations } from "@/core/utils";

export class ArchiveReservationDto {
  constructor(
    public readonly id: number,
    public readonly archiveReason?: string
  ) {}

  public static create(props: {
    [key: string]: any;
  }): [string?, ArchiveReservationDto?] {
    const { archiveReason, id } = props;

    const numberError = Validations.validateNumberFields({
      id,
    });
    if (numberError) return [numberError];
    if (archiveReason) {
      const error = Validations.validateStringFields({
        archiveReason,
      });
      if (error) return [error];
    }

    return [undefined, new ArchiveReservationDto(+id, archiveReason)];
  }
}
