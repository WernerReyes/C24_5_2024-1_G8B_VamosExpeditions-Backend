//* AUTH
export * from './auth/login.dto';

//* CLIENT
export * from './client/client.dto';

//* RESERVATION
export * from './reservation/reservation.dto';
export * from './reservation/getReservations.dto';

//* HOTEL
export * from './hotel/getHotels.dto';

//* VERSION QUOTATION
export * from './versionQuotation/versionQuotation.dto';
export * from './versionQuotation/duplicateVersionQuotation.dto';
export * from './versionQuotation/duplicateMultipleVersionQuotation.dto';

//* HOTEL ROOM TRIP DETAILS
export * from './hotelRoomTripDetails/hotelRoomTripDetails.dto';
export * from './hotelRoomTripDetails/getManyHotelRoomTripDetails.dto';
export * from './hotelRoomTripDetails/updateManyHotelRoomTripDetailsByDate.dto';
export * from './hotelRoomTripDetails/insertManyRoomTripDetails.dto';


//* TRIP DETAILS
export * from './tripDetails/tripDetails.dto';

export * from './report/report.dto';


//* COMMON
export * from './common/versionQuotationID.dto';
