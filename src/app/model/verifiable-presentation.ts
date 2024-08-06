import VerifiableCredential from '@/app/model/verifiable-credential'
import EnvelopedVerifiableCredential from '@/app/model/enveloped-verifiable-credential'

export default interface VerifiablePresentation {
  '@context': string | string[] | any
  id?: string
  '@id'?: string
  type?: string | string[]
  '@type'?: string | string[]
  verifiableCredential: VerifiableCredential[] | EnvelopedVerifiableCredential[]
  [key: string]: any
}
