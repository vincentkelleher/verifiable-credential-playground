import { Module } from '@nestjs/common'
import { DidModule } from './did/did.module'
import { ConfigModule } from '@nestjs/config'
import { VerifiableCredentialModule } from './verifiable-credential/verifiable-credential.module'

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), DidModule, VerifiableCredentialModule]
})
export class AppModule {}
