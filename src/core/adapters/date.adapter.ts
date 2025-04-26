import {
  parseISO,
  format,
  parse,
  isSameDay,
  isWithinInterval,
  getHours,
  eachDayOfInterval,
  addDays,
  subMonths,
  addMonths,
  startOfMonth,
  endOfMonth,
  startOfDay,
  isFirstDayOfMonth,
  isLastDayOfMonth,
  lastDayOfMonth,
  setDate,
  min,
  getDate,
} from "date-fns";
import { toZonedTime, fromZonedTime } from "date-fns-tz";
import { es } from "date-fns/locale/es";

type FormatDateType =
  | "dd/MM/yyyy"
  | "dd/MM/yyyy HH:mm"
  | "yyyy-MM-dd"
  | "EEEE, d 'de' MMMM 'de' yyyy"
  | "EEE, MMM dd, yyyy";

export class DateAdapter {
  static parse(
    dateString: string,
    pattern: FormatDateType = "dd/MM/yyyy"
  ): Date {
    const date = parse(dateString, pattern, new Date(), {
      locale: es,
    });
    return toZonedTime(date, "UTC");
  }

  static parseISO(dateString: string | Date): Date {
    const date = dateString instanceof Date ? dateString : parseISO(dateString);
    return startOfDay(toZonedTime(date, "UTC"));
  }

  static toISO(date: Date): string {
    // Convert a date to the specified timezone, then format as ISO 8601
    return fromZonedTime(date, "UTC").toISOString();
  }

  static format(value: Date, pattern: FormatDateType = "dd/MM/yyyy"): string {
    let date;
    if (typeof value === "string") {
      date = DateAdapter.parseISO(value);
    } else {
      date = value;
    }
    return format(date, pattern);
  }

  static isSameDay(date1: Date | string, date2: Date | string): boolean {
    const dateFormat =
      typeof date1 === "string" ? DateAdapter.parseISO(date1) : date1;
    const dateFormat2 =
      typeof date2 === "string" ? DateAdapter.parseISO(date2) : date2;
    return isSameDay(dateFormat, dateFormat2);
  }

  static getHours(date: Date = new Date()): number {
    return getHours(date);
  }

  static isWithinInterval(date: Date, startDate: Date, endDate: Date): boolean {
    return isWithinInterval(date, { start: startDate, end: endDate });
  }

  static eachDayOfInterval(startDate: Date, endDate: Date): Date[] {
    return eachDayOfInterval({
      start: DateAdapter.parseISO(startDate),
      end: DateAdapter.parseISO(endDate),
    });
  }
  static rangeFromStartDate(startDate: Date, days: number): Date[] {
    return eachDayOfInterval({
      start: DateAdapter.parseISO(startDate),
      end: addDays(DateAdapter.parseISO(startDate), days - 1),
    });
  }

  //* @param offset: number - The number of months to offset from the current date. Positive values move forward, negative values move backward.
  static getMonthRange(offset: number = 0): { start: Date; end: Date } {
    const targetDate =
      offset < 0
        ? subMonths(toZonedTime(new Date(), "UTC"), Math.abs(offset))
        : addMonths(toZonedTime(new Date(), "UTC"), offset);

    return {
      start: startOfMonth(targetDate),
      end: endOfMonth(targetDate),
    };
  }

  static isLastDayOfMonth(date: Date = new Date()): boolean {
    return isLastDayOfMonth(toZonedTime(date, "UTC"));
  }

  static getLastDayOfMonth(date: Date = new Date()): Date {
    const zonedDate = toZonedTime(date, "UTC");
    return endOfMonth(zonedDate);
  }

  static getOneMonthAgo(): Date {
    const now = toZonedTime(new Date(), "UTC")
    const oneMonthAgo = subMonths(now, 1);
    const endOfMonth = lastDayOfMonth(oneMonthAgo);

    return min([setDate(oneMonthAgo, getDate(now)), endOfMonth]);
  }
}
