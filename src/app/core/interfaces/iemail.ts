export interface IEmail {
    id: number
    fullName: string
    emailAddress: string
    message: string
    createdAt: string
    bookingDate: string
    fK_TourId: number
    fullTourName: string
    childernNumber:number
    adultNumber:number
    hotelName:string
    roomNumber:number
  }

export interface IEmailHomeBooking {
    FullName: string;
    EmailAddress: string;
    Message: string;
    CheckInTime: string;
    CheckOutTime: string;
    FK_VacationHomes: number;
    FullVacationHomes: string;
}

export interface IEmailHome {
    id: number;
    fullName: string;
    emailAddress: string;
    message: string;
    createdAt: string;
    checkInTime: string | null;
    checkOutTime: string | null;
    fK_VacationHomes: number | null;
    fullVacationHomes?: string | null;
}

export interface IPagedResult<T> {
    data: T[];
    count: number;
}
  