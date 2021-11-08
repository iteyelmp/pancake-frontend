import React from 'react'
import { Menu as UikitMenu } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import useTheme from 'hooks/useTheme'
import config from './config/config'
import UserMenu from './UserMenu'
import GlobalSettings from './GlobalSettings'

const Menu = (props) => {
  const { isDark } = useTheme()
  const { t } = useTranslation()

  return (
    <UikitMenu
      userMenu={<UserMenu />}
      globalMenu={<GlobalSettings />}
      isDark={isDark}
      links={config(t)}
      {...props}
    />
  )
}

export default Menu
