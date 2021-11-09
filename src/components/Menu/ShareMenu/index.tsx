import React from 'react'
import { Flex, IconButton, Image } from '@pancakeswap/uikit'


const ShareMenu = () => {
  return (
    <Flex>
      <IconButton variant="text" scale="sm" mr="8px" id="open-settings-dialog-button">
        <Image height={24} width={24} src="./images/doc.png" style={{ marginTop: "5px"}}/>
      </IconButton>
      <IconButton variant="text" scale="sm" mr="8px" id="open-settings-dialog-button">
          <Image height={24} width={24} src="./images/midum.png" style={{ marginTop: "5px"}}/>
      </IconButton>
      <IconButton variant="text" scale="sm" mr="8px" id="open-settings-dialog-button">
          <Image height={24} width={24} src="./images/telegram.png" style={{ marginTop: "5px"}}/>
      </IconButton>
      <IconButton variant="text" scale="sm" mr="8px" id="open-settings-dialog-button" style={{marginRight: "20px"}}>
          <Image height={24} width={24} src="./images/twiter.png" style={{ marginTop: "5px"}}/>
      </IconButton>
    </Flex>
  )
}

export default ShareMenu
