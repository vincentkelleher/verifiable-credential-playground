import { CompactSign, importPKCS8, KeyLike } from 'jose'
import { DateTime } from 'luxon'
import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const didWeb: string = `did:web:${process.env.DOMAIN!}`
  const document = await request.json()
  const neverExpires: boolean = request.nextUrl.searchParams.get('neverExpires') === 'true'
  const privateKey: KeyLike = await importPKCS8(process.env.PRIVATE_KEY!, 'ES256')

  document.issuer = didWeb

  if (neverExpires) {
    delete document.validUntil
  } else {
    document.validUntil = DateTime.now().plus({ days: parseInt(process.env.EXPIRATION_DAYS || '1') }).toISO()
  }

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
