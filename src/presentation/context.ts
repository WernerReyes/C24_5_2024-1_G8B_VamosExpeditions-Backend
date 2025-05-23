import { CacheAdapter } from "@/core/adapters";
import { UserContext } from "./user/user.context";
import { ExternalCountryContext } from "./external/country/country.context";
import { AuthContext } from "./auth/auth.context";

export class AppCacheContext {
  static async initialize() {
    await CacheAdapter.initialize().then(async() => {
      await this.initializeContexts(CacheAdapter.getInstance());
    })
  }

  private static async initializeContexts(cache: CacheAdapter) {
    await UserContext.initialize(cache);
    await AuthContext.initialize(cache);
    await ExternalCountryContext.initialize(cache);
  }
}
