import { ITour } from "./itour"

export interface IDestnation {
  id: number
  imageCover: string
  isActive: boolean
  names: string
  descriptions: string
  referneceName: string
}

export interface IdetailedDestnaion {
  id: number
  imageCover: string
  isActive: boolean
  names: string
  descriptions: string
  referneceName: string
  tours: ITour[]
}

