export interface Itransfer {
  id: number
  imageCover: string
  isActive: boolean
  fK_DestinationID: number
  destinationName: string
  names: string
  descriptions: string
  slug: string
  metaKeyWords:string
  metaDescription:string
}

export interface ItransferWithPrices {
  id: number
  imageCover: string
  isActive: boolean
  fK_DestinationID: number
  destinationName: string
  names: string
  descriptions: string
  metaKeyWords:string
  metaDescription:string
  referneceName: string
  slug: string
  pricesList: PricesList[]
  includeds: Included[]
  notIncludeds: NotIncluded[]
  highlights: Highlight[]
}

export interface PricesList {
  id: number

  title: string
  privtePrice: number
  sharedPrice: number
  language: string
}

export interface Included {
  id: number

  language: string
  text: string
}

export interface NotIncluded {
  id: number

  language: string
  text: string
}

export interface Highlight {
  id: number
  language: string
  text: string
}