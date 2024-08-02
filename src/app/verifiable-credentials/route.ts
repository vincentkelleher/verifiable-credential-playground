import { CompactSign, importPKCS8, KeyLike } from 'jose'
import { DateTime } from 'luxon'
import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const documents = await request.json()
  const neverExpires: boolean = request.nextUrl.searchParams.get('neverExpires') === 'true'

  const vcJwts: string[] = await Promise.all(
    documents.map(async (document: any): Promise<string> => await signDocument(document, neverExpires))
  )

  const vpJwt: any = {
    '@context': ['https://www.w3.org/ns/credentials/v2', 'https://www.w3.org/ns/credentials/examples/v2'],
    type: 'VerifiablePresentation',
    verifiableCredential: vcJwts.map((vcJwt) => ({
      '@context': 'https://www.w3.org/ns/credentials/v2',
      id: `data:application/vc+ld+json+jwt;${vcJwt}`,
      type: 'EnvelopedVerifiableCredential'
    }))
  }

  return new Response(await signDocument(vpJwt, neverExpires))
}

async function signDocument(document: any, neverExpires: boolean) {
  const didWeb: string = `did:web:${process.env.DOMAIN!}`
  const privateKey: KeyLike = await importPKCS8(process.env.PRIVATE_KEY!, 'ES256')

  document.issuer = didWeb
  document.validFrom = DateTime.now().toISO()

  if (neverExpires) {
    delete document.validUntil
  } else {
    document.validUntil = DateTime.now()
      .plus({ days: parseInt(process.env.EXPIRATION_DAYS || '1') })
      .toISO()
  }

  return await new CompactSign(new TextEncoder().encode(JSON.stringify(document)))
    .setProtectedHeader({
      alg: 'ES256',
      typ: 'vc+ld+json+jwt',
      cty: 'vc+ld+json',
      iss: didWeb,
      kid: didWeb + '#X509-JWK2020'
    })
    .sign(privateKey)
}
