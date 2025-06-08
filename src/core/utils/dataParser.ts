export class DataParserUtil {
  static maskEmail(email: string) {
    const [localPart, domain] = email.split("@");

    if (!localPart || !domain) return email;

    const visibleChars = localPart.slice(0, 3); // Primeros 3 caracteres
    return `${visibleChars}***@${domain}`;
  }
}
