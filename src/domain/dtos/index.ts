//* AUTHENTICATION
export * from "./auth/login.dto";
export * from "./auth/resetPassword.dto";
export * from "./auth/disconnectDevice.dto";

//* CLIENT
export * from "./client/client.dto";
export * from './client/getClient'


//* COMMON
export * from "./common/pagination.dto";
export * from "./common/versionQuotationID.dto";
export * from "./common/trash.dto";
export * from "./common/selectModelFields.dto";
export * from "./common/insertManyDetailsTripDetails.dto";
export * from "./common/updateManyDetailsTripDetailsByDate.dto";

//* HOTEL
export * from "./hotel/getHotels.dto";
export * from "./hotel/insertManyHotelExcel.dto";


//* RESERVATION
export * from "./reservation/getReservations.dto";
export * from "./reservation/getStadistics.dto";

//* HOTEL
export * from "./hotel/getHotels.dto";
export * from "./hotel/registerHotel.dto";
export * from "./hotel/getHotelsPage.dto";

//*  ROOM
export * from "./room/registerRoom.dto";

//* SERVICES
export * from "./service/getServices.dto";

//* SERVICE TYPE
export * from "./serviceType/getServiceTypes.dto";


//* VERSION QUOTATION
export * from "./versionQuotation/versionQuotation.dto";
export * from "./versionQuotation/duplicateMultipleVersionQuotation.dto";
export * from "./versionQuotation/getVersionQuotations.dto";
export * from "./versionQuotation/duplicateMultipleVersionQuotation.dto";
export * from "./versionQuotation/sendEmailAndGenerateReport.dto";


//* TRIP DETAILS
export * from "./tripDetails/tripDetails.dto";

//* RESERVATION
export * from "./reservation/reservation.dto";

//* USER
export * from "./user/changePassword.dto";
export * from "./user/user.dto";
export * from "./user/getUsers.dto";

//* ROLES
export * from "./role/getRoles.dto";

//* SETTINGS
export * from "./setting/updateSetting.dto";
export * from './role/getRoles.dto';


//! pantner
export * from './partner/getPartner.dto';
export * from './partner/partner.dto';
