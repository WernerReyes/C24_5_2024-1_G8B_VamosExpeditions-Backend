import { CacheAdapter } from "./core/adapters";
import { CacheConst, EnvsConst } from "./core/constants";
import { ExternalCountryEntity } from "./presentation/external/country/country.entity";
import type { ExternalCountryModel } from "./presentation/external/country/country.model";
import { AppRoutes } from "./presentation/routes";
import { Server } from "./presentation/server";

const { EXTERNAL_API_COUNTRY_URL } = EnvsConst;

(async () => {
  await main();
})();

async function main() {
  try {
  await externalCountries();
} catch(error) {
  
}

  const server = new Server({
    port: EnvsConst.PORT,
    routes: AppRoutes.routes,
    client_url: EnvsConst.CLIENT_URL,
  });

  server.start();
}

async function externalCountries() {
  const cache = CacheAdapter.getInstance();
  const cachedCountryList = cache.get<ExternalCountryEntity[]>(CacheConst.COUNTRIES);
  if (!cachedCountryList) {
    const response = await fetch(EXTERNAL_API_COUNTRY_URL + "/countries");
    const data = await response.json();
    cache.set(
      CacheConst.COUNTRIES,
      data.map((c: ExternalCountryModel) => ExternalCountryEntity.fromObject(c))
    );
  }
}
