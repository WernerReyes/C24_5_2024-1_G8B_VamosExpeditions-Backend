import { IBrowser, IDevice, IOS, UAParser } from "ua-parser-js";

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

  static generateDeviceId(userAgent: string, browserName: string): string {
    const browserVersion = this.getBrowser(userAgent).version ?? "0";


    const os = this.getOSName(userAgent);

    return `${browserName}_${parseInt(browserVersion)}_${os.name}`;
  }
}
