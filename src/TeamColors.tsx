import { Box, HStack } from '@chakra-ui/react'

type Props = {
  colors: FbColors
}

const TeamColors = ({ colors }: Props) => {
  const colorArray = Object.values(colors)
  return (
    <HStack spacing={0}>
      {colorArray.map((color, index) => {
        const singleWidth = Math.ceil(30 / colorArray.length)
        const width = `${singleWidth}px`
        return (
          <Box
            key={color}
            background={color}
            height='20px'
            width={width}
            padding={0}
            minWidth='unset'
            borderStartRadius={index === 0 ? 3 : 0}
            borderEndRadius={index === colorArray.length-1 ? 3 : 0}
          />
        )})}
    </HStack>
  )
}

export default TeamColors
