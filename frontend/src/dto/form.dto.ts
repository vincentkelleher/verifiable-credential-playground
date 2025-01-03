export enum Validity {
  DEFAULT = 'default',
  OVERRIDE = 'override',
  NEVER_EXPIRES = 'neverExpires'
}

export interface FormDto {
  neverExpires?: boolean
  validity: Validity
  validityOffset?: string
  validityUnit?: string
  documents: string[]
}
