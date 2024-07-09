import { CompactSign, importPKCS8, KeyLike } from 'jose'
import { DateTime } from 'luxon'

export async function POST(request: Request) {
  const didWeb: string = `did:web:${process.env.DOMAIN!}`
  const document = await request.json()
  const privateKey: KeyLike = await importPKCS8(process.env.PRIVATE_KEY!, 'ES256')

  document.issuer = didWeb
  document.validUntil = DateTime.now().plus({ days: 1 }).toISO()

  return new Response(
    await new CompactSign(new TextEncoder().encode(JSON.stringify(document)))
      .setProtectedHeader({
        alg: 'ES256',
        typ: 'vc+ld+json+jwt',
        cty: 'vc+ld+json',
        iss: didWeb,
        kid: didWeb + '#X509-JWK2020'
      })
      .sign(privateKey)
  )
}
