import jsw from "jsonwebtoken";
import { EnvsConst } from "../constants";

//* JWT_SEED is a string that is used to generate the token
const JWT_SEED = EnvsConst.JWT_SEED;

export class JwtAdapter {
  static async generateToken(
    payload: any,
    duration: string = EnvsConst.JWT_DURATION
  ) {
    return new Promise((resolve) => {
      jsw.sign(
        payload,
        EnvsConst.JWT_SEED,
        { expiresIn: duration },
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