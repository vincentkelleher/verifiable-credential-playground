export default interface EnvelopedVerifiableCredential {
  '@context': string | string[] | any
  id?: string
  '@id'?: string
  type?: string | string[]
  '@type'?: string | string[]
}
