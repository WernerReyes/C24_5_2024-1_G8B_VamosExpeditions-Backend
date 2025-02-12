import { EnvsConst } from "./core/constants";
import {
  ClientModel,
  CountryModel,
  CityModel,
  DistritModel,
  ReservationModel,
  UserModel,
  HotelRoomQuotationModel,
} from "./data/postgres";
import { CloudinaryService, EmailService, PdfService } from "./lib";

import { ContextStrategy } from "./lib/strategies/context.strategy";
import { EmailStrategy } from "./lib/strategies/email.strategy";
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
  });
console.dir(data1,{depth:null}); */

  /* const data1 = await CountryModel.findMany({}); */

  /*   const data1 = await CytyModel.findMany({
    select: {
      id_city: true,
      name: true,
      country:true
    },
  });

  console.dir(data1, { depth: null }); */

  // Itera sobre el array data1

  /*  const data2 = await ReservationModel.findMany({
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


   
  /* const HotelsByCity = await CountryModel.findMany({
    where: {
      id_country: 1,
      city: {
        some: {
          id_city: 1,
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
                  accommodation_room: {
                    
                  },
                },
              },
            },
          }
        },
      },
    },
  });
  console.log(JSON.stringify(HotelsByCity, null, 2)) */

  /*   const emailService = new EmailService();

  const pdfService = new PdfService();
  const cloudinaryService = new CloudinaryService();

  const generalStrategy = new EmailStrategy(
    emailService,
    pdfService,
    cloudinaryService
  );

  const context = new ContextStrategy(generalStrategy);

  context
    .executeStrategy({
      to: "rcasapaico2001@gmail.com",
      subject: "Confirmación de Reserva",
      type: "Transporte",
    })
    .then(() => {
      console.log("Correo enviado con éxito");
    })
    .catch((error) => {
      console.error("Error al enviar el correo:", error);
    }); */

  server.start();
}
