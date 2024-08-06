import { Anchor, Paper, Text, Title } from '@mantine/core'
import React from 'react'

export default function Intro() {
  return (
    <>
      <Title m="lg" ta="center">
        Verifiable Credential Playground
      </Title>
      <Paper shadow="xs" p="xl">
        <Text ta="center">
          This is only a <strong>testing/development instance</strong> used to provide a DID document for verifiable
          credential signing and verification.
        </Text>
        <Text mt="md" ta="center">
          Verifiable credentials are encoded using VC-JWT according to&nbsp;
          <Anchor href="https://www.w3.org/TR/vc-jose-cose/" target="_blank">
            W3C&apos;s Securing Verifiable Credentials using JOSE and COSE
          </Anchor>
          .
        </Text>
      </Paper>
    </>
  )
}
