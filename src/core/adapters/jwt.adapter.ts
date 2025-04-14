import jsw, { SignOptions } from "jsonwebtoken";
import { EnvsConst } from "../constants";

export class JwtAdapter {
  
  static async generateToken(
    payload: any,
    duration: number | string = EnvsConst.JWT_DURATION as string
  ) {
    return new Promise((resolve) => {
    
      jsw.sign(
        payload,
        EnvsConst.JWT_SEED,
        { expiresIn: duration as SignOptions["expiresIn"] /* parseInt(duration,10) */ },
        (err, token) => {
          if (err) resolve(null);

          resolve(token);
        }
      );
    });
  }

  static verifyToken<T>(token: string): Promise<T | null> {
    return new Promise((resolve) => {
      jsw.verify(token, EnvsConst.JWT_SEED, (err, decoded) => {
        if (err) resolve(null);

        resolve(decoded as T);
      });
    });
  }

 

}
