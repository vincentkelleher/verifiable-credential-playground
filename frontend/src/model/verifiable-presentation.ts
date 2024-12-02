import EnvelopedVerifiableCredential from './enveloped-verifiable-credential'
import VerifiableCredential from './verifiable-credential'

export default interface VerifiablePresentation {
  '@context': string | string[] | any
  id?: string
  '@id'?: string
  type?: string | string[]
  '@type'?: string | string[]
  verifiableCredential: VerifiableCredential[] | EnvelopedVerifiableCredential[]
  [key: string]: any
}
