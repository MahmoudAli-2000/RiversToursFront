import { ITour } from "./itour"

export interface ICatTour {
  id: number
  slug: string
  imageCover: string
  isActive: boolean
  titles: string
  descriptions: string
  referneceName: string
}

export interface IdetailedCattour {
    id: number
    slug: string
    imageCover: string
    isActive: boolean
    titles: string
    descriptions: string
    metaKeyWords:string
    metaDescription:string
    tours: ITour[]
  }
  
