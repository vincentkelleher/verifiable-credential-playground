import { BadRequestException, Body, Controller, Post, Query } from '@nestjs/common'
import { SigningService } from './signing.service'
import VerifiableCredential from '../model/verifiable-credential'
import { VpJwt } from '../model/vp-jwt'
import { VcJwt } from '../model/vc-jwt'
import VerifiablePresentation from '../model/verifiable-presentation'
import EnvelopedVerifiableCredential from '../model/enveloped-verifiable-credential'
import { DateTime } from 'luxon'

@Controller('verifiable-credentials')
export class VerifiableCredentialController {
  constructor(private readonly signingService: SigningService) {}

  @Post()
  async buildVerifiablePresentation(
    @Body() documents: VerifiableCredential[],
    @Query('neverExpires') neverExpiresString?: string,
    @Query('validUntil') validUntilString?: string
  ): Promise<VpJwt> {
    const neverExpires: boolean = neverExpiresString == 'true' || neverExpiresString == '1'

    const validUntil: DateTime = validUntilString ? DateTime.fromISO(validUntilString) : null
    if (validUntil?.invalidReason) {
      throw new BadRequestException(validUntil.invalidReason, validUntil.invalidExplanation)
    }

    const vcJwts: VcJwt[] = await Promise.all(
      documents.map(
        async (document: any): Promise<string> =>
          await this.signingService.signDocument(document, neverExpires, validUntil)
      )
    )

    const verifiablePresentation: VerifiablePresentation = {
      '@context': ['https://www.w3.org/ns/credentials/v2', 'https://www.w3.org/ns/credentials/examples/v2'],
      type: 'VerifiablePresentation',
      verifiableCredential: vcJwts.map(
        (vcJwt: VcJwt): EnvelopedVerifiableCredential => ({
          '@context': 'https://www.w3.org/ns/credentials/v2',
          id: `data:application/vc+jwt,${vcJwt}`,
          type: 'EnvelopedVerifiableCredential'
        })
      )
    }

    return await this.signingService.signDocument(verifiablePresentation, neverExpires, validUntil)
  }
}
