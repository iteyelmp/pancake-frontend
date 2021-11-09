import React from 'react'
import { useLocation } from 'react-router'
import { Menu as UikitMenu } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import useTheme from 'hooks/useTheme'
import config from './config/config'
import UserMenu from './UserMenu'
import GlobalSettings from './GlobalSettings'
import ShareMenu from './ShareMenu'
import { getActiveMenuItem } from './utils'

const Menu = (props) => {
  const { isDark } = useTheme()
  const { t } = useTranslation()
  let { pathname } = useLocation()
  pathname = pathname === "/" ? "/swap" : pathname
  const activeMenuItem = getActiveMenuItem({ pathname, menuConfig: config(t) })

  return (
    <UikitMenu
      userMenu={<UserMenu />}
      shareMenu={<ShareMenu />}
      globalMenu={<GlobalSettings />}
      isDark={isDark}
      links={config(t)}
      activeItem={activeMenuItem?.href}
      {...props}
    />
  )
}

export default Menu
