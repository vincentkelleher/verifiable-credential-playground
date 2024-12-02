import { Controller, Get, Res } from '@nestjs/common'
import { createDidDocument } from '@gaia-x/did-web-generator'
import { ConfigService } from '@nestjs/config'
import { DID } from '@gaia-x/did-web-generator/dist/did'
import { Response } from 'express'

@Controller('.well-known/')
export class DidController {
  constructor(private readonly configService: ConfigService) {}

  @Get('did.json')
  async getDid(): Promise<DID> {
    return await createDidDocument(
      `https://${this.configService.get('DOMAIN')}`,
      'x509Certificate.pem',
      this.configService.get('CERTIFICATE')
    )
  }

  @Get('x509Certificate.pem')
  async getCertificate(@Res() response: Response): Promise<void> {
    response.header('Content-Type', 'text/plain').send(this.configService.get('CERTIFICATE'))
  }
}
