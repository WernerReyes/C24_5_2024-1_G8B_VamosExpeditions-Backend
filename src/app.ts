import { CacheAdapter } from "./core/adapters";
import { CacheConst, EnvsConst } from "./core/constants";
import { ExternalCountryEntity } from "./presentation/external/country/country.entity";
import type { ExternalCountryModel } from "./presentation/external/country/country.model";
import { AppRoutes } from "./presentation/routes";
import { Server } from "./presentation/server";
import "module-alias/register";

const { EXTERNAL_API_COUNTRY_URL } = EnvsConst;

(async () => {
  await main();
})();

async function main() {
  try {
    // await externalCountries();
  } catch (error) {}

  const server = new Server({
    port: EnvsConst.PORT,
    routes: AppRoutes.routes,
    client_url: EnvsConst.CLIENT_URL,
  });

  server.start();

  console.log(EnvsConst.NODE_ENV === "production");

}

async function externalCountries() {
  const cache = CacheAdapter.getInstance();
  const cachedCountryList = cache.get<ExternalCountryEntity[]>(
    CacheConst.COUNTRIES
  );
  if (!cachedCountryList) {
    const response = await fetch(EXTERNAL_API_COUNTRY_URL + "/countries");
    const data = await response.json();
    cache.set(
      CacheConst.COUNTRIES,
      data.map((c: ExternalCountryModel) => ExternalCountryEntity.fromObject(c))
    );
  }

  /* 
  const data = await TripDetailsModel.findMany({
    where: { id: 10 },
    omit: {
      client_id: true,
    },
    include: {
      client: {
        omit: {
          createdAt: true,
          updatedAt: true,
        },
      },
      hotel_room_trip_details: {
        orderBy: {
          date: "asc",
        },
        include: {
          hotel_room: {
            include: {
              hotel: {},
            },
          },
        },
      },
      version_quotation: {
        omit: {
          created_at: true,
          updated_at: true,
        },
        include: {
          quotation: {
            omit: {
              created_at: true,
              updated_at: true,
            },
          },
          user: {
            omit: {
              id_role: true,
              password: true,
              online: true,
            },
          },
        },
      },
    },
  });
  
  

  console.log(util.inspect(data, { showHidden: false, depth: null , colors:true}));
 */
}
