export default interface VerifiableCredential {
  '@context': string | string[] | any
  id?: string
  '@id'?: string
  type?: string | string[]
  '@type'?: string | string[]
  credentialSubject: any
  [key: string]: any
}
