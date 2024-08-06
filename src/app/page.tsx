'use client'

import { Box, Button, Checkbox, Container, Grid, Group, Modal, Paper, Textarea, Title } from '@mantine/core'
import { useForm } from '@mantine/form'
import React, { useState } from 'react'
import JWT from '@/app/components/jwt'
import { nanoid } from 'nanoid'
import Document from '@/app/components/document'
import Intro from '@/app/components/intro'
import { IconSparkles } from '@tabler/icons-react'
import { useDisclosure, useInputState } from '@mantine/hooks'
import { decodeJwt } from 'jose'
import VerifiableCredential from '@/app/model/verifiable-credential'
import EnvelopedVerifiableCredential from '@/app/model/enveloped-verifiable-credential'
import { VcJwt } from '@/app/model/vc-jwt'

const defaultDocument: string =
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
  const [importedVcJwt, setImportedVcJwt] = useInputState('')
  const [opened, { open, close }] = useDisclosure(false)

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      neverExpires: false,
      documents: [defaultDocument]
    }
  })

  const importVcJwt = async () => {
    const verifiableCredentials: VerifiableCredential[] | EnvelopedVerifiableCredential[] = decodeJwt(importedVcJwt)
      .verifiableCredential as unknown as VerifiableCredential[] | EnvelopedVerifiableCredential[]

    form.reset()
    form.removeListItem('documents', 0)

    for (const verifiableCredential of verifiableCredentials) {
      if (verifiableCredential.type?.includes('EnvelopedVerifiableCredential')) {
        const vcJwt: VcJwt = (verifiableCredential.id ?? verifiableCredential['@id']!).replace(
          'data:application/vc+ld+json+jwt;',
          ''
        )
        form.insertListItem('documents', JSON.stringify(decodeJwt(vcJwt), null, 2))
      } else {
        form.insertListItem('documents', JSON.stringify(verifiableCredential, null, 2))
      }
    }

    close()
  }

  const buildVcJwt = async (documents: string[], neverExpires: boolean) => {
    let response = await fetch(`/verifiable-credentials?neverExpires=${neverExpires}`, {
      method: 'POST',
      body: JSON.stringify(documents.map((document) => JSON.parse(document)))
    })

    setVcJwt(await response.text())
  }

  return (
    <>
      <Modal ta="center" opened={opened} onClose={close} title="Import from VC-JWT" size="70%" centered>
        <Textarea
          data-autofocus
          placeholder="Enter your VC-JWT here..."
          autosize
          minRows={6}
          maxRows={10}
          onChange={setImportedVcJwt}
          value={importedVcJwt}
        />
        <Button variant="light" mt="lg" onClick={() => importVcJwt()}>
          Import
        </Button>
      </Modal>

      <Container fluid>
        <Grid>
          <Grid.Col span={12}>
            <Intro />
          </Grid.Col>
          <Grid.Col span={{ base: 12, lg: 6 }}>
            <Paper shadow="xs" p="xl">
              <form onSubmit={form.onSubmit((values) => buildVcJwt(values.documents, values.neverExpires))}>
                <Title order={3} ta="center" mb="lg">
                  Verifiable Presentation Generator
                </Title>
                <Button variant="light" mt="md" mb="md" w="100%" h="50px" onClick={open}>
                  <IconSparkles />
                  &nbsp; Import from VC-JWT
                </Button>
                {form.getValues().documents.map((_: string, index: number) => (
                  <Document key={nanoid()} index={index} form={form} />
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
            </Paper>
          </Grid.Col>
          <Grid.Col span={{ base: 12, lg: 6 }}>
            <Paper shadow="xs" p="xl">
              <Title order={3} ta="center">
                Result
              </Title>
              {vcJwt && (
                <Box mt="lg">
                  <JWT value={vcJwt} />
                </Box>
              )}
            </Paper>
          </Grid.Col>
        </Grid>
      </Container>
    </>
  )
}
