import { Module } from '@nestjs/common'
import { VerifiableCredentialController } from './verifiable-credential.controller'
import { SigningService } from './signing.service'

@Module({
  controllers: [VerifiableCredentialController],
  providers: [SigningService]
})
export class VerifiableCredentialModule {}
