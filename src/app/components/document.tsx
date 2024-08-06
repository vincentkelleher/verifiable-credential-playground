import { ActionIcon, Grid, JsonInput } from '@mantine/core'
import { IconTrash } from '@tabler/icons-react'
import React from 'react'
import { UseFormReturnType } from '@mantine/form'

export default function Document(props: { form: UseFormReturnType<any>; index: number }) {
  return (
    <Grid key={`document-${props.index}`} mb="md">
      <Grid.Col span={11}>
        <JsonInput
          autosize={true}
          minRows={20}
          inputSize="400px"
          formatOnBlur
          key={props.form.key(`documents.${props.index}`)}
          {...props.form.getInputProps(`documents.${props.index}`)}
        />
      </Grid.Col>
      <Grid.Col span={1}>
        <ActionIcon
          variant="light"
          color="red"
          aria-label="Trash"
          style={{ height: '100%', width: '100%' }}
          onClick={() => props.form.removeListItem('documents', props.index)}
        >
          <IconTrash style={{ width: '40%', height: '40%' }} stroke={1.5} />
        </ActionIcon>
      </Grid.Col>
    </Grid>
  )
}
