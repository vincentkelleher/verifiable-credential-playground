'use client'

import {
  ActionIcon,
  Anchor,
  Button,
  Checkbox,
  Container,
  CopyButton,
  Grid,
  Group,
  JsonInput,
  Paper,
  SimpleGrid,
  Text,
  Title
} from '@mantine/core'
import { useForm } from '@mantine/form'
import React, { useState } from 'react'
import { IconTrash } from '@tabler/icons-react'

const defaultDocument =
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

export default function Home() {
  const [vcJwt, setVcJwt] = useState('')

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      neverExpires: false,
      documents: [defaultDocument]
    }
  })

  const buildVcJwt = async (documents: any[], neverExpires: boolean) => {
    let response = await fetch(`/verifiable-credentials?neverExpires=${neverExpires}`, {
      method: 'POST',
      body: JSON.stringify(documents.map((document) => JSON.parse(document)))
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
                W3C&apos;s Securing Verifiable Credentials using JOSE and COSE
              </Anchor>
              .
            </Text>
          </Paper>
          <Paper shadow="xs" p="xl">
            <form onSubmit={form.onSubmit((values) => buildVcJwt(values.documents, values.neverExpires))}>
              <Title order={3} ta="center">
                Verifiable Presentation Generator
              </Title>
              {form.getValues().documents.map((document, index) => (
                <Grid key={`document-${index}`} mt="md">
                  <Grid.Col span={11}>
                    <JsonInput
                      autosize={true}
                      minRows={20}
                      inputSize="400px"
                      formatOnBlur
                      key={form.key(`documents.${index}`)}
                      {...form.getInputProps(`documents.${index}`)}
                    />
                  </Grid.Col>
                  <Grid.Col span={1}>
                    <ActionIcon
                      variant="light"
                      color="red"
                      aria-label="Trash"
                      style={{ height: '100%', width: '100%' }}
                      onClick={() => form.removeListItem('documents', index)}
                    >
                      <IconTrash style={{ width: '40%', height: '40%' }} stroke={1.5} />
                    </ActionIcon>
                  </Grid.Col>
                </Grid>
              ))}
              <Group mt="lg" justify="center">
                <Button variant="light" onClick={() => form.insertListItem('documents', defaultDocument)}>
                  +
                </Button>
              </Group>
              <Group mt="lg">
                <Checkbox
                  defaultChecked
                  label="Never Expires"
                  description="Doesn't set a validUntil property"
                  variant="outline"
                  key={form.key('neverExpires')}
                  {...form.getInputProps('neverExpires', { type: 'checkbox' })}
                />
              </Group>
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
