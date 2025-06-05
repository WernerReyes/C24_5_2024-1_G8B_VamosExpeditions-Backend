import { AuthUser } from "@/presentation/auth/auth.context";
import { type IBrowser, type IOS, type IResult, UAParser } from "ua-parser-js";
import { v4 as uuidv4 } from "uuid";

export class UAParserAdapter {
  static getBrowser(userAgent: string): IBrowser {
    const parser = new UAParser(userAgent);
    const browser = parser.getBrowser();
    return browser;
  }

  static getOSName(userAgent: string): IOS {
    const parser = new UAParser(userAgent);
    const os = parser.getOS();
    return os;
  }

  static getInfo(userAgent: string): IResult {
    const parser = new UAParser(userAgent);
    const result = parser.getResult();
    return result;
  }

  static generateDevice(
    userAgent: string,
    browserName: string
  ): AuthUser["device"] {
    const info = this.getInfo(userAgent);
    return {
      id: uuidv4(),
      name: browserName,
      version: info.browser.version?? "0",
      model: info.os.name ?? "Unknown",
      createdAt: new Date(),
    };
  }
}