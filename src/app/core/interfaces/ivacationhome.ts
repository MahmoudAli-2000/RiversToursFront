export interface IVacationHome {
  id: number;
  referneceName: string;
  imageCover: string;
  slug: string | null;
  propertyType: number | string;
  createdAt: string;
  city: string;
  area: string;
  address: string;
  googleMapsUrl: string | null;
  latitude: number | null;
  longitude: number | null;
  isActive: boolean;
  priceDollar: number;
  priceEuro: number;
  fK_DestinationID: number | null;
  destinationName: string;
  name: string;
  description: string;
  translations?: IVacationHomeTranslation[];
}

export interface IVacationHomeImage {
  id: number;
  imageCarouselUrl: string;
  isActive?: boolean;
}

export interface IVacationHomeTranslation {
  language: string;
  name: string;
  description: string;
}

export interface IVacationHomeDetail extends IVacationHome {
  vacationHomesImgs: IVacationHomeImage[];
  translations: IVacationHomeTranslation[];
}

export interface IVacationHomeUpdate {
  id: number;
  referneceName: string;
  imageCover: string;
  slug: string | null;
  propertyType: number | string;
  city: string;
  area: string;
  address: string;
  createdAt: string;
  googleMapsUrl: string | null;
  latitude: number | null;
  longitude: number | null;
  isActive: boolean;
  priceDollar: number;
  priceEuro: number;
  fK_DestinationID: number | null;
  destinationName: string;
  translations: IVacationHomeTranslation[];
  vacationHomesImgs: IVacationHomeImage[];
}
