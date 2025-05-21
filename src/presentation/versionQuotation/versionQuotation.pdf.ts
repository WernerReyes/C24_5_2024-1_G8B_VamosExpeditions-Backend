import {
  PdfService,
  type Content,
  type StyleDictionary,
} from "@/infrastructure";
import type {
  IHotelRoomTripDetailsModel,
  ITripDetailsModel,
  IVersionQuotationModel,
} from "@/infrastructure/models";

import { DateAdapter } from "@/core/adapters/date.adapter";

export class VersionQuotationPdf extends PdfService {
  constructor() {
    super();
  }

  public generate(versionQuotation: IVersionQuotationModel) {
    return this.createPdf({
      title: "",
      subTitle: "",
      content: this.getContent(versionQuotation),
      styles: this.styles,
      user: versionQuotation.user!,
    });
  }

  public generateForEmail(versionQuotation: IVersionQuotationModel) {
    return this.createPdfForEmail({
      title: "",
      subTitle: "",
      content: this.getContent(versionQuotation),
      styles: this.styles,
      user: versionQuotation.user!,
    });
  }

  private getContent({
    trip_details,
    name,
    user,
    profit_margin,
    indirect_cost_margin,
  }: IVersionQuotationModel): Content {
    const client = trip_details?.client!;

    const [direct, indirect] = trip_details?.hotel_room_trip_details?.reduce(
      ([total1, total2], room) => [
        total1 + Number(room.cost_person),
        total2 +
          (Number(room.cost_person) * Number(indirect_cost_margin)) / 100,
      ],
      [0, 0]
    ) ?? [0, 0];

    const totalCost = direct + indirect;

    const salesPrice = totalCost * (Number(profit_margin) / 100);
    const profitMargin = salesPrice - totalCost;

    return [
      {
        table: {
          widths: ["*"],
          body: [
            [
              {
                text: name,
                style: "quoteNumber",
                alignment: "center",
                fontSize: 24,
                color: this.primaryColor,
                margin: [0, 10, 0, 5],
              },
            ],
            [
              {
                text: `${DateAdapter.format(
                  trip_details!.start_date,
                  "EEEE, d 'de' MMMM 'de' yyyy"
                )} - ${DateAdapter.format(
                  trip_details!.end_date,
                  "EEEE, d 'de' MMMM 'de' yyyy"
                )}`,
                style: "quoteDate",
                alignment: "center",
                margin: [0, 0, 0, 10],
              },
            ],
          ],
        },
        layout: {
          hLineWidth: () => 0,
          vLineWidth: () => 0,
        },
        margin: [0, 0, 0, 20],
      },
      {
        text: "Información del cliente",
        style: "sectionTitle",
        margin: [0, 0, 0, 10],
      },
      {
        table: {
          widths: ["50%", "50%"],
          body: [
            [
              { text: "Nombre:", style: "clientLabel" },
              { text: "Teléfono:", style: "clientLabel" },
            ],
            [
              { text: client.fullName, style: "clientInfo" },
              {
                text: client.phone || "No ha sido asignado",
                style: "clientInfo",
              },
            ],
            [
              { text: "Email:", style: "clientLabel" },
              { text: "País:", style: "clientLabel" },
            ],
            [
              {
                text: client.email ?? "No ha sido asignado",
                style: "clientInfo",
              },
              {
                text: client.country,
                style: "clientInfo",
              },
            ],
          ],
        },
        layout: {
          fillColor: "#F5F5F5",
          hLineWidth: () => 0,
          vLineWidth: () => 0,
          paddingLeft: () => 10,
          paddingRight: () => 10,
          paddingTop: () => 5,
          paddingBottom: () => 5,
        },
        margin: [0, 0, 0, 20],
      },
      {
        text: "Detalles",
        style: "sectionTitle",
        margin: [0, 0, 0, 20],
      },
      ...(this.dinamicTable(trip_details!) as any),
      {
        text: "Desglose de Costos",
        style: "sectionTitle",
        margin: [0, 0, 0, 20],
      },
      {
        table: {
          widths: ["50%", "50%"], // Dos columnas de igual tamaño
          body: [
            [
              {
                // Columna izquierda: Desglose de Costos
                stack: [
                  {
                    table: {
                      widths: ["*", "auto"],
                      body: [
                        ["Alojamientos:", `$${direct.toFixed(2)}`],
                        ["Servicios:", "$00.00"],
                        ["Costos Directos:", `$${direct.toFixed(2)}`],
                        [
                          `Costos Indirectos (${indirect_cost_margin}%):`,
                          `$${indirect.toFixed(2)}`,
                        ],
                        ["Total de Costos:", `$${totalCost.toFixed(2)}`],
                        [
                          `Margen de Ganancia (${profit_margin}%):`,
                          `$${profitMargin.toFixed(2)}`,
                        ],
                        [
                          {
                            text: "Precio de Venta:",
                            bold: true,
                            fillColor: "#E0F7FA",
                          },
                          {
                            text: `$${salesPrice.toFixed(2)}`,
                            fillColor: "#E0F7FA",
                            color: this.primaryColor,
                            bold: true,
                          },
                        ],
                      ],
                    },

                    layout: {
                      hLineWidth: (i: number) => (i > 0 ? 1 : 0),
                      vLineWidth: () => 0,
                      hLineColor: () => "#eaeaea",
                      paddingTop: () => 10,
                      paddingBottom: () => 10,
                    },
                  },
                ],
              },
              {
                // Columna derecha: Precio por Persona
                stack: [
                  { text: "Precio por Persona", style: "header" },
                  {
                    table: {
                      widths: ["*", "auto"],
                      body: [
                        ["Precio por adulto:", `$${salesPrice.toFixed(2)}`],
                        ["Precio por niño:", `$${salesPrice.toFixed(2)}`],
                        [
                          `Total para ${trip_details?.number_of_people} personas:`,
                          `$${(
                            salesPrice * (trip_details?.number_of_people ?? 0)
                          ).toFixed(2)}`,
                        ],
                      ],
                    },
                    layout: {
                      hLineWidth: (i: number) => (i > 0 ? 1 : 0),
                      vLineWidth: () => 0,
                      hLineColor: () => "#eaeaea",
                      paddingTop: () => 10,
                      paddingBottom: () => 10,
                    },
                  },
                  {
                    margin: [0, 5, 0, 0],
                    stack: [
                      {
                        text: "$ Todos los precios están en USD",
                        style: "note",
                      },
                      {
                        text: "% Los porcentajes son calculados sobre los costos directos",
                        style: "note",
                      },
                    ],
                  },
                ],
              },
            ],
          ],
        },
        layout: "noBorders",
      },
    ];
  }

  private dinamicTable(tripDetails: ITripDetailsModel) {
    const days: Date[] = DateAdapter.eachDayOfInterval(
      tripDetails.start_date,
      tripDetails.end_date
    );

    const groupedData: { [key: string]: any[] } = {};

    days.forEach((day) => {
      const dayLabel = DateAdapter.format(day, "EEEE, d 'de' MMMM 'de' yyyy");
      groupedData[dayLabel] = [];
    });

    tripDetails.hotel_room_trip_details?.forEach((hotelRoom) => {
      const dayLabel = DateAdapter.format(
        hotelRoom.date,
        "EEEE, d 'de' MMMM 'de' yyyy"
      );
      groupedData[dayLabel].push(hotelRoom);
    });

    const dinamicTable = Object.keys(groupedData).flatMap((dayLabel) => {
      const dayData = groupedData[dayLabel] as IHotelRoomTripDetailsModel[];
      const dayTotal = dayData.reduce(
        (total, room) => total + Number(room.cost_person),
        0
      );

      const groupedByHotel = dayData.reduce(
        (unique: any, room) => {
          const hotelName = room.hotel_room?.hotel?.name!;
          const key = hotelName; // Puedes incluir también el tipo de habitación si lo deseas

          if (!unique[key]) {
            unique[key] = {
              ...room,
              total_cost: +room.cost_person,
              total_hotel_room: 1,
            };
          } else {
            unique[key].total_cost += +room.cost_person;
            unique[key].total_hotel_room += 1;
          }

          return unique;
        },
        {} as Record<
          string,
          IHotelRoomTripDetailsModel & {
            total_cost: number;
            total_hotel_room: number;
          }
        >
      );

      // Convertimos a array
      const uniqueRooms = Object.values(
        groupedByHotel
      ) as (IHotelRoomTripDetailsModel & {
        total_cost: number;
        total_hotel_room: number;
      })[];

      // Generar filas de alojamiento
      let accommodationsRows = uniqueRooms.map((room) => [
        {
          text: `${room.hotel_room?.hotel?.name} - ${room.hotel_room?.room_type} X ${room.total_hotel_room}`,
          style: "serviceDescription",
        },
        { text: `$${room.total_cost.toFixed(2)}`, style: "servicePrice" },
      ]);

      if (accommodationsRows.length === 0) {
        accommodationsRows = [
          [
            {
              text: "No hay alojamientos para este día",
              style: "serviceEmpty",
            },
            { text: "$0.00", style: "servicePrice" },
          ],
        ];
      }

      return [
        {
          table: {
            widths: ["*"],
            body: [
              [
                {
                  text: dayLabel,
                  style: "dayHeader",
                  margin: [0, 5, 0, 5],
                },
              ],
            ],
          },
          layout: {
            fillColor: "#E0F7FA",
            hLineWidth: () => 0,
            vLineWidth: () => 0,
            paddingLeft: () => 5,
            paddingRight: () => 5,
          },
          margin: [0, 0, 0, 5],
        },
        {
          text: "Alojamientos",
          fontSize: 10,
          style: "sectionTitle",
          margin: [5, 5, 0, 5],
        },
        {
          table: {
            widths: ["*", "auto"],
            body: accommodationsRows,
          },
          layout: {
            hLineWidth: (i: number) => (i > 0 ? 1 : 0),
            vLineWidth: () => 0,
            hLineColor: () => "#eaeaea",
            paddingTop: () => 10,
            paddingBottom: () => 10,
          },
          margin: [15, 0, 0, 10],
        },
        {
          text: "Servicios",
          fontSize: 10,
          style: "sectionTitle",
          margin: [5, 5, 0, 5],
        },
        {
          table: {
            widths: ["*", "auto"],
            body: [
              [
                {
                  text: "No hay servicios para este día",
                  style: "serviceEmpty",
                },
                { text: "$0.00", style: "servicePrice" },
              ],
            ],
          },
          layout: {
            hLineWidth: (i: number) => (i > 0 ? 1 : 0),
            vLineWidth: () => 0,
            hLineColor: () => "#eaeaea",
            paddingTop: () => 10,
            paddingBottom: () => 10,
          },
          margin: [15, 0, 0, 10],
        },
        {
          text: `Subtotal: $${dayTotal.toFixed(2)}`,
          alignment: "right",
          bold: true,
          margin: [0, 0, 0, 20],
        },
      ];
    });

    return dinamicTable;
  }

  private get styles(): StyleDictionary {
    return {
      clientLabel: {
        fontSize: 10,
        bold: true,
        color: "#757575",
        margin: [0, 0, 0, 0],
      },
      clientInfo: {
        fontSize: 10,
        bold: true,
        color: "black",
        margin: [0, 0, 0, 0],
      },
      quoteNumber: {
        fontSize: 16,
        bold: true,
        color: "black",
      },
      quoteDate: {
        fontSize: 10,
        color: "#757575",
      },
      sectionTitle: {
        fontSize: 13,
        bold: true,
        color: this.primaryColor,
        margin: [0, 10, 0, 5],
      },
      serviceDescription: {
        fontSize: 10,
        color: "black",
      },
      servicePrice: {
        alignment: "right",
        color: this.primaryColor,
      },
      serviceEmpty: {
        fontSize: 10,
        color: "#757575",
        margin: [0, 0, 0, 0],
      },

      dayHeader: {
        fontSize: 12,
        bold: true,
        color: "black",
        background: "#e5f7f9",
        margin: [0, 10, 0, 5],
      },

      costLabel: {
        fontSize: 10,
        color: "#757575",
      },
      costValue: {
        alignment: "right",
        color: this.primaryColor,
      },

      note: {
        fontSize: 8,
        color: "#757575",
      },
    };
  }
}
