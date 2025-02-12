export class DateUtils {
  static formatter = new Intl.DateTimeFormat("es-ES", {
    year: "numeric",
    month: "long",
    day: "2-digit",
  });
  static resetTimeToMidnight(date: Date): Date {
    return new Date(
      Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
    );
  }

  static getDDMMMMYYYY(date: Date): string {
    return this.formatter.format(date);
  }
}
