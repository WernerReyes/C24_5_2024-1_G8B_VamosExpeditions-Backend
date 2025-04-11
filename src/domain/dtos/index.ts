// import "module-alias/register";
//* AUTH
export * from './auth/login.dto';

//* USER
export * from './user/user.dto';

//* CLIENT
export * from './client/client.dto';

//* RESERVATION
export * from './reservation/reservation.dto';
export * from './reservation/getReservations.dto';
export * from './reservation/getStadistics.dto';

//* HOTEL
export * from './hotel/getHotels.dto';


//* VERSION QUOTATION
export * from './versionQuotation/versionQuotation.dto';
export * from './versionQuotation/duplicateVersionQuotation.dto';
export * from './versionQuotation/duplicateMultipleVersionQuotation.dto';
export * from './versionQuotation/getVersionQuotations.dto';
export * from './versionQuotation/sendEmailAndGenerateReport.dto';

//* HOTEL ROOM TRIP DETAILS
export * from './hotelRoomTripDetails/updateManyHotelRoomTripDetailsByDate.dto';
export * from './hotelRoomTripDetails/insertManyRoomTripDetails.dto';


//* TRIP DETAILS
export * from './tripDetails/tripDetails.dto';


//* COMMON
export * from './common/versionQuotationID.dto';
export * from './common/pagination.dto';
