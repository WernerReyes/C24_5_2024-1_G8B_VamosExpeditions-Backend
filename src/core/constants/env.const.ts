import "dotenv/config";
import { get } from "env-var";

export class EnvsConst {
  public static readonly NODE_ENV = get("NODE_ENV").required().asString();
  public static readonly PORT = get("PORT").required().asPortNumber();
  public static readonly COOKIE_EXPIRATION = get("COOKIE_EXPIRATION")
    .required()
    .asIntPositive();
  public static readonly CLIENT_URL = get("CLIENT_URL").required().asString();
  public static readonly JWT_SEED = get("JWT_SEED").required().asString();
  public static readonly JWT_DURATION = get("JWT_DURATION")
    .required()
    .asString();
  public static readonly EXTERNAL_API_COUNTRY_URL = get(
    "EXTERNAL_API_COUNTRY_URL"
  )
    .required()
    .asString();
}
