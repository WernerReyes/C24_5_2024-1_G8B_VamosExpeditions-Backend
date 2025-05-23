import { CityModel } from "./city.model";
import { ClientModel } from "./client.model";
import { CountryModel } from "./country.model";
import { DistrictModel } from "./district.model";
import { HotelModel } from "./hotel.model";
import { HotelRoomModel } from "./hotelRoom.model";
import { HotelRoomTripDetailsModel } from "./hotelRoomTripDetails.model";
import { NotificationModel } from "./notification.model";
import { PartnerModel } from "./partner.model";
import { QuotationModel } from "./quotation.model";
import { ReservationModel } from "./reservation.model";
import { RoleModel } from "./role.model";
import { TripDetailsModel } from "./tripDetails.model";
import { TripDetailsHasCityModel } from "./tripDetailsHasCity.model";
import { UserModel } from "./user.model";
import { VersionQuotationModel } from "./versionQuotation.model";
import { ReservationVersionSummaryView } from "./views/reservationVersionSummary.view";

export class ModelInitializer {
  public static initializeModels() {
    ReservationVersionSummaryView.initialize();
    ReservationModel.initialize();
    HotelRoomTripDetailsModel.initialize();
    TripDetailsModel.initialize();
    VersionQuotationModel.initialize();
    QuotationModel.initialize();
    NotificationModel.initialize();
    PartnerModel.initialize();
    UserModel.initialize();
    RoleModel.initialize();
    HotelRoomModel.initialize();
    HotelModel.initialize();
    TripDetailsHasCityModel.initialize();
    ClientModel.initialize();
    DistrictModel.initialize();
    CityModel.initialize();
    CountryModel.initialize();

    //* Set the relations
    this.setUserRelationship();
    this.setReservationRelationship();
    this.setVersionQuotationRelationship();
    this.setCityRelationship();
    this.setCountryRelationship();

    console.log("Models initialized");
  }

  private static setUserRelationship() {
    UserModel.setRelationship = {
      role: RoleModel.partialInstance,
    };
  }

  

  private static setReservationRelationship() {
    ReservationModel.setRelationship = {
      quotation: {
        ...QuotationModel.partialInstance,
        version_quotation: [
          {
            ...VersionQuotationModel.partialInstance,
            trip_details: {
              ...TripDetailsModel.partialInstance,
              client: ClientModel.partialInstance,
              trip_details_has_city: [
                {
                  ...TripDetailsHasCityModel.partialInstance,
                  city: {
                    ...CityModel.partialInstance,
                  },
                },
              ],
            },
            user: {
              ...UserModel.partialInstance,
            },
          },
        ],
      },
    };
  }

  private static setVersionQuotationRelationship() {
    VersionQuotationModel.setRelationship = {
      trip_details: {
        ...TripDetailsModel.partialInstance,
        client: ClientModel.partialInstance,
      },
      user: {
        ...UserModel.partialInstance,
        role: RoleModel.partialInstance,
      },
      quotation: {
        ...QuotationModel.partialInstance,
        reservation: ReservationModel.partialInstance,
        version_quotation: [VersionQuotationModel.partialInstance],
      },
    };
  }

  private static setCityRelationship() {
    CityModel.setCountry = CountryModel.partialInstance;
  }

  private static setCountryRelationship() {
    CountryModel.setCities = new Array<CityModel>(CityModel.partialInstance);
  }
}
