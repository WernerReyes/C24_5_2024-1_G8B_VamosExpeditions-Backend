import { compareSync, genSaltSync, hashSync } from "bcryptjs";
import { RegexConst } from "../constants";

const { PASSWORD } = RegexConst;
export class BcryptAdapter {

  static hash(password: string): string {
    const salt = genSaltSync();
    return hashSync(password, salt);
  }

  static compare(password: string, hash: string): boolean {
    return compareSync(password, hash);
  }

  static generateRandomPassword(): string {
    const length = 8;
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const special = '!@#$%^&*';
    
    let password = '';
    
    // Ensure at least one of each required character type
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += special[Math.floor(Math.random() * special.length)];
    
    // Fill the rest with random characters
    const allChars = uppercase + lowercase + numbers + special;
    for (let i = password.length; i < length; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }
    
    // Shuffle the password
    return password.split('').sort(() => Math.random() - 0.5).join('');
  }
}
