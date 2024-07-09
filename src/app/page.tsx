'use client'

import { Anchor, Button, Container, CopyButton, Group, JsonInput, Paper, SimpleGrid, Text, Title } from '@mantine/core'
import { useForm } from '@mantine/form'
import React, { useState } from 'react'

export default function Home() {
  const [vcJwt, setVcJwt] = useState('')

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      document:
        '{\n' +
        '  "@context": [\n' +
        '    "https://www.w3.org/ns/credentials/v2",\n' +
        '    "https://www.w3.org/ns/credentials/examples/v2"\n' +
        '  ],\n' +
        '  "id": "http://university.example/credentials/3732",\n' +
        '  "type": ["VerifiableCredential", "ExampleDegreeCredential"],\n' +
        '  "issuer": "https://university.example/issuers/565049",\n' +
        '  "validFrom": "2010-01-01T00:00:00Z",\n' +
        '  "credentialSubject": {\n' +
        '    "id": "did:example:ebfeb1f712ebc6f1c276e12ec21",\n' +
        '    "degree": {\n' +
        '      "type": "ExampleBachelorDegree",\n' +
        '      "name": "Bachelor of Science and Arts"\n' +
        '    }\n' +
        '  }\n' +
        '}'
    }
  })

  const buildVcJwt = async (document: any) => {
    let response = await fetch('/verifiable-credentials', {
      method: 'POST',
      body: document
    })

    setVcJwt(await response.text())
  }

  const displayJwt = (jwt: string): React.JSX.Element => {
    const parts: string[] = jwt.split('.')

    return (
      <>
        <Title mt="xl" mb="lg" order={3}>
          Result
        </Title>
        <Text component="span" c="blue" fw="600" style={{ overflowWrap: 'anywhere' }}>
          {parts[0]}
        </Text>
        <Text component="span">.</Text>
        <Text component="span" c="green" fw="600" style={{ overflowWrap: 'anywhere' }}>
          {parts[1]}
        </Text>
        <Text component="span">.</Text>
        <Text component="span" c="orange" fw="600" style={{ overflowWrap: 'anywhere' }}>
          {parts[2]}
        </Text>
        <Group mt="xl" justify="right">
          <Button component="a" variant="light" href={`https://jwt.io/#debugger-io?token=${vcJwt}`} target="_blank">
            Open with JWT.io
          </Button>
          <CopyButton value={vcJwt}>
            {({ copied, copy }) => (
              <Button variant="light" color={copied ? 'teal' : 'blue'} onClick={copy}>
                {copied ? 'Copied VC-JWT' : 'Copy VC-JWT'}
              </Button>
            )}
          </CopyButton>
        </Group>
      </>
    )
  }

  return (
    <>
      <Container>
        <SimpleGrid cols={1}>
          <Title m="lg" ta="center">
            Verifiable Credential Playground
          </Title>
          <Paper shadow="xs" p="xl">
            <Text ta="justify">
              This is only a <strong>testing/development instance</strong> used to provide a DID document for verifiable
              credential signing and verification.
            </Text>
            <Text mt="md" ta="justify">
              Verifiable credentials are encoded using VC-JWT according to&nbsp;
              <Anchor href="https://www.w3.org/TR/vc-jose-cose/" target="_blank">
                W3C's Securing Verifiable Credentials using JOSE and COSE
              </Anchor>.
            </Text>
          </Paper>
          <Paper shadow="xs" p="xl">
            <form onSubmit={form.onSubmit((values) => buildVcJwt(values.document))}>
              <Title order={3} ta="center">
                Verifiable Credential Generator
              </Title>
              <JsonInput
                mt="md"
                autosize={true}
                minRows={20}
                inputSize="400px"
                label="Document"
                description="The input document you wish to sign"
                placeholder="Your document to become a verifiable credential"
                formatOnBlur
                key={form.key('document')}
                {...form.getInputProps('document')}
              />
              <Group mt="lg" justify="right">
                <Button type="submit" variant="light">
                  Sign
                </Button>
              </Group>
            </form>
            {vcJwt && displayJwt(vcJwt)}
          </Paper>
        </SimpleGrid>
      </Container>
    </>
  )
}
