import { CustomError } from "@/domain/error";
import { RegexConst } from "../constants/regex.const";

export class Validations {
  static validateEmptyFields(fields: any, from?: string): string | null {
    for (const field in fields) {
      if (!fields[field] || JSON.stringify(fields[field]) === "{}") {
        if (from) {
          return `El campo ${field} es requerido en '${from}'`;
        }
        return `El campo ${field} es requerido`;
      }
    }
    return null;
  }

  static validateStringFields(fields: any): string | null {
    for (const field in fields) {
      if (typeof fields[field] !== "string") {
        return `El campo ${field} debe ser un string`;
      }
    }
    return null;
  }

  static validateBooleanFields(fields: any): string | null {
    for (const field in fields) {
      if (typeof fields[field] !== "boolean") {
        return `El campo ${field} debe ser un booleano`;
      }
    }
    return null;
  }

  static validateNumberFields(fields: any): string | null {
    for (const field in fields) {
      if (isNaN(fields[field])) {
        return `El campo ${field} debe ser un número`;
      }
    }
    return null;
  }

  static validateGreaterThanValueFields(
    field: any,
    value: number
  ): string | null {
    for (const key in field) {
      if (field[key] <= value) {
        return `El campo ${key} debe ser mayor a ${value}`;
      }
    }

    return null;
  }

  static validateTypeFields<T>(fields: Partial<T>): fields is T {
    for (const key in fields) {
      if (fields[key] !== null && fields[key] !== undefined) {
        const expectedType = typeof ({} as T)[key];
        if (typeof fields[key] !== expectedType) {
          return false;
        }
      }
    }
    return true;
  }
  

  static validateEnumValue(value: string, enumValues: string[]): string | null {
    if (!enumValues.includes(value)) {
      return `El valor ${value} no es permitido. Los valores permitidos son: ${enumValues.join(
        ", "
      )}`;
    }
    return null;
  }

  static validateEmail(email: string): string | null {
    if (!RegexConst.EMAIL.test(email)) {
      return "El email no es válido";
    }
    return null;
  }

  static validatePassword(password: string): string | null {
    if (!RegexConst.PASSWORD.test(password)) {
      return "La contraseña debe tener al menos 6 caracteres, una letra mayúscula, una letra minúscula y un número.";
    }
    return null;
  }

  static validateDateArray(dates: string[]): string | null {
    if (!Array.isArray(dates) || dates.length !== 2) {
      return "El campo de fechas debe ser un array con dos elementos (fecha de inicio y fecha de fin)";
    }

    const [startDate, endDate] = dates;
    if (
      isNaN(new Date(startDate).getTime()) ||
      isNaN(new Date(endDate).getTime())
    ) {
      return "Una o ambas fechas no son válidas";
    }

    if (new Date(startDate) >= new Date(endDate)) {
      return "La fecha de inicio debe ser anterior a la fecha de fin";
    }

    return null;
  }

  static validateModelInstance(models: any[] | any, from?: string) {
    const arrayModels = Array.isArray(models) ? models : [models];

    arrayModels.forEach((model) => {
      if (!model || Object.keys(model).length === 0) {
        throw CustomError.badRequest(`Modelo no instanciado en '${from}'`);
      }
    });
    return;
  }
}
