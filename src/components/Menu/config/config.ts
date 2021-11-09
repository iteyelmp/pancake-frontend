import { MenuItemsType } from '@pancakeswap/uikit'
import { ContextApi } from 'contexts/Localization/types'

export type ConfigMenuItemsType = MenuItemsType & { hideSubNav?: boolean }

const config: (t: ContextApi['t']) => ConfigMenuItemsType[] = (t) => [
  {
    label: t('Exchange'),
    icon: 'Swap',
    href: '/swap',
    showItemsOnMobile: false,
    showOnMobile: false,
  },
  {
    label: t('Liquidity'),
    icon: 'Swap',
    href: '/liquidity',
    showItemsOnMobile: false,
    showOnMobile: false,
  },
]

export default config
