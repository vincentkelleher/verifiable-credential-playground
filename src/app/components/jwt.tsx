import { Button, CopyButton, Group, Text } from '@mantine/core'
import React from 'react'

export default function JWT(props: { value: string }) {
  const parts: string[] = props.value.split('.')

  return (
    <>
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
        <Button component="a" variant="light" href={`https://jwt.io/#debugger-io?token=${props.value}`} target="_blank">
          Open with JWT.io
        </Button>
        <CopyButton value={props.value}>
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
