import * as React from 'react'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconProp } from '@fortawesome/fontawesome-svg-core'

type Props = {
  icon: IconProp
  label: string
  onClick?: React.MouseEventHandler<HTMLButtonElement>
}
const LabeledIconButton: React.FC<Props> = ({ icon, label, onClick }) => {
  return (
    <Button onClick={onClick}>
      <Stack alignItems="center">
        <FontAwesomeIcon icon={icon} size="2x" />
        <Typography variant="caption">{label}</Typography>
      </Stack>
    </Button>
  )
}

export default LabeledIconButton
