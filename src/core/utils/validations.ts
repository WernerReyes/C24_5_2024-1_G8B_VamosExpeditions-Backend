import { RegexConst } from "../constants/regex.const";

export class Validations {
  static validateEmptyFields(fields: any): string | null {
    for (const field in fields) {
      if (!fields[field]) {
        return `El campo ${field} es requerido`;
      }
    }
    return null;
  }

  static validateEnumValue(value: string, enumValues: string[]): string | null {
    if (!enumValues.includes(value)) {
      return `El valor ${value} no es permitido`;
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

}
