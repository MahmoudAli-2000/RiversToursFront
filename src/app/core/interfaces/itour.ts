export interface ITour {
  id: number
  slug: string
  imageCover: string
  isActive: boolean
  duration: number
  durationType: string
  priceDollar: number
  priceEuro: number
  startLocation: string
  endLocation: string
  languageOptions: string
  createdAt: string
  fK_CategoryID: number
  fK_UserID: string
  fK_DestinationID: any
  categoryName: string
  destinationName: any
  titles: string
  descriptions: string
  linkVideo: any
  referneceName: string
}

export interface IDetailedTour {
  id: number
  slug: string
  imageCover: string
  isActive: boolean
  duration: number
  priceDollar: number
  priceEuro: number
  startLocation: string
  endLocation: string
  languageOptions: string
  createdAt: string
  fK_CategoryID: number
  fK_UserID: string
  fK_DestinationID: any
  categoryName: string
  destinationName: any
  titles: string
  descriptions: string
  durationType: string
  linkVideo: string
  referneceName: string
  metaDescription: string
  metaKeyWords: string
  tourImgs: TourImg[]
  highlights: Highlight[]
  includedItems: IncludedItem[]
  notIncludedItems: NotIncludedItem[]
  whyThisItems: WhyThisItem[]
}

export interface TourImg {
  id: number
  imageCarouselUrl: string
  isActive: boolean
  fK_TourId: any
  tourName: string
  titles: string
}

export interface Highlight {
  id: number
  language: string
  text: string
}

export interface IncludedItem {
  id: number
  language: string
  text: string
}

export interface NotIncludedItem {
  id: number
  language: string
  text: string
}

export interface WhyThisItem {
  id: number
  language: string
  text: string
}
