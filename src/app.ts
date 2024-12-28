import { EnvsConst } from "./core/constants";
import {
  AccommodationModel,
  AccommodationRoomModel,
  ClienModel,
  CountryModel,
  CityModel,
  DistritModel,
  ReservationDetailModel,
  ReservationModel,
  UserModel,
} from "./data/postgres";
import { AppRoutes } from "./presentation/routes";
import { Server } from "./presentation/server";

(async () => {
  main();
})();

async function main() {
  const server = new Server({
    port: EnvsConst.PORT,
    routes: AppRoutes.routes,
    client_url: EnvsConst.CLIENT_URL,
  });

  const reservation = await ReservationModel.findFirst({
    where: {
      id: 1,
    },
    include: {
      reservation_has_city: {
        include: {
          city: {
            include: {
              country: true,
            },
          },
        },
      },
      client: true,
    },
  });

  // console.dir({ reservation }, { depth: null });




  const reservationCity = reservation?.reservation_has_city[0];

  const HotelsByCity = await CountryModel.findMany({
    where: {
      id_country: reservationCity?.city_id,
      city: {
        some: {
          id_city: reservationCity?.city.country_id
        },
      },
    },
    include: {
      city: {
        include: {
          distrit: {
            include: {
              accommodation: {
                include: {
                  accommodation_room: {},
                },
              },
            },
          },
        },
      },
    },
  });
  console.log(JSON.stringify(HotelsByCity, null, 2));
  /*   const data1 = await CountryModel.findMany({
    select: {
      id_country: true,
      name: true,
      code: true,
      city: {
        select: {
          id_city: true,
          name: true,
          
        },
      },
    },
  }); */

  /* const data1 = await CountryModel.findMany({}); */

  /* const data1 = await CytyModel.findMany({
    select: {
      id_city: true,
      name: true,
      country:true
    },
  });

  console.dir(data1, { depth: null }); */

  // Itera sobre el array data1

  const data2 = await ReservationModel.findMany({
    include: {
      reservation_has_city: {
        include: {
          city: {
            include: {
              country: true,
            },
          },
        },
      },
      client: true,
    },
  });
  // console.dir({ data2 }, { depth: null });

  server.start();
}
