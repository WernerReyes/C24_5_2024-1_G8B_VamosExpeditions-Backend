import { IBrowser, IOS, UAParser } from "ua-parser-js";

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

 

  static generateDeviceId(userAgent: string, secChUa: string): string {
    const browserName =
      secChUa?.toString().split('"')[1].toLowerCase().split(" ").join("-");
    const browserVersion = this.getBrowser(userAgent).version ?? "0";

    const os = this.getOSName(userAgent);

    return `${browserName}_${parseInt(browserVersion)}_${os.name}`;
  }
}
