import {
  addDays,
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfYear,
  format,
  getDate,
  getHours,
  isLastDayOfMonth,
  isSameDay,
  isWithinInterval,
  lastDayOfMonth,
  min,
  parse,
  parseISO,
  setDate,
  startOfDay,
  startOfMonth,
  startOfYear,
  subMonths
} from "date-fns";
import { fromZonedTime, toZonedTime } from "date-fns-tz";
import { es } from "date-fns/locale/es";
import { TimeZoneContext } from "../context";

type FormatDateType =
  | "dd/MM/yyyy"
  | "dd/MM/yyyy HH:mm"
  | "yyyy-MM-dd"
  | "EEEE, d 'de' MMMM 'de' yyyy"
  | "EEE, MMM dd, yyyy";

export class DateAdapter {
  private static get timeZone() {
    return TimeZoneContext.getInstance().getTimeZone;
  }

  static parse(
    dateString: string,
    pattern: FormatDateType = "dd/MM/yyyy"
  ): Date {
    const date = parse(dateString, pattern, new Date(), {
      locale: es,
    });
    return toZonedTime(date, this.timeZone);
  }

  static parseISO(dateString: string | Date): Date {
    const date = dateString instanceof Date ? dateString : parseISO(dateString);
    return fromZonedTime(date, "UTC");
  }

  static startOfDay(date: Date): Date {
    return fromZonedTime(startOfDay(date), "UTC");
  }

  static toISO(date: Date): string {
    // Convert a date to the specified timezone, then format as ISO 8601
    return fromZonedTime(date, this.timeZone).toISOString();
  }

  static format(value: Date, pattern: FormatDateType = "dd/MM/yyyy"): string {
    let date;
    if (typeof value === "string") {
      date = DateAdapter.parseISO(value);
    } else {
      date = value;
    }
    return format(date, pattern, {
      locale: es,
    });
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
      start: new Date(startDate),
      end: new Date(endDate),
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
    const now = toZonedTime(new Date(), this.timeZone);
    const targetDate =
      offset < 0 ? subMonths(now, Math.abs(offset)) : addMonths(now, offset);

    return {
      start: fromZonedTime(startOfMonth(targetDate), this.timeZone),
      end: fromZonedTime(endOfMonth(targetDate), this.timeZone),
    };
  }

  static isLastDayOfMonth(date: Date = new Date()): boolean {
    return isLastDayOfMonth(toZonedTime(date, this.timeZone));
  }

  static getLastDayOfMonth(date: Date = new Date()): Date {
    const zonedDate = toZonedTime(date, this.timeZone);
    return fromZonedTime(endOfMonth(zonedDate), this.timeZone);
  }

  static getOneMonthAgo(): Date {
    const now = toZonedTime(new Date(), this.timeZone);
    const oneMonthAgo = subMonths(now, 1);
    const endOfMonth = lastDayOfMonth(oneMonthAgo);

    return min([setDate(oneMonthAgo, getDate(now)), endOfMonth]);
  }

  static startOfYear(date: Date = new Date()): Date {
    const zonedDate = toZonedTime(date, this.timeZone);
    return fromZonedTime(startOfYear(zonedDate), this.timeZone);
  }

  static endOfYear(date: Date = new Date()): Date {
    const zonedDate = toZonedTime(date, this.timeZone);
    return fromZonedTime(endOfYear(zonedDate), this.timeZone);
  }
}
