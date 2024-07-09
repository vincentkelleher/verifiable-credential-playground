import { exportPKCS8, exportSPKI, generateKeyPair } from 'jose'
import { writeFileSync } from 'fs'

const generate = async () => {
  console.log('Generating key pair...')

  const { privateKey, publicKey } = await generateKeyPair('ES256')

  let privateKeyPem = await exportPKCS8(privateKey)
  let publicKeyPem = await exportSPKI(publicKey)

  writeFileSync('private-key.pem', privateKeyPem)
  writeFileSync('public-key.pem', publicKeyPem)

  console.log('👉 Private key: ./private-key.pem')
  console.log('👉 Public key: ./private-key.pem')

  writeFileSync(
    '.env.local',
    `DOMAIN=my-domain.com
PRIVATE_KEY="${privateKeyPem.trim()}"
PUBLIC_KEY="${publicKeyPem.trim()}"
CERTIFICATE=""`
  )

  console.log('👉 Default environment file: ./env.local')

  console.log('\nℹ️ Please run')
  console.log('\n\topenssl req -new -x509 -key private-key.pem -out certificate.pem\n')
  console.log(
    "Then paste the content (without any line breaks) of certificate.pem as the value of .env.local's CERTIFICATE variable"
  )
}

generate().then()
