import React from 'react'
import { Flex, IconButton, Image } from '@pancakeswap/uikit'


const ShareMenu = () => {
  return (
    <Flex>
      <IconButton variant="text" scale="sm" mr="8px" id="open-settings-dialog-button">
        <Image height={24} width={24} src="./images/doc.png"/>
      </IconButton>
      <IconButton variant="text" scale="sm" mr="8px" id="open-settings-dialog-button">
          <Image height={24} width={24} src="./images/midum.png"/>
      </IconButton>
      <IconButton variant="text" scale="sm" mr="8px" id="open-settings-dialog-button">
          <Image height={24} width={24} src="./images/telegram.png"/>
      </IconButton>
      <IconButton variant="text" scale="sm" mr="8px" id="open-settings-dialog-button">
          <Image height={24} width={24} src="./images/twiter.png"/>
      </IconButton>
    </Flex>
  )
}

export default ShareMenu
