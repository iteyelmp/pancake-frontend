import React from 'react'
import { Box, Button, Flex, InjectedModalProps, LinkExternal, Message, Skeleton, Text } from '@pancakeswap/uikit'
import { useWeb3React } from '@web3-react/core'
import { FetchStatus, useGetBnbBalance } from 'hooks/useTokenBalance'
import useAuth from 'hooks/useAuth'
import { useTranslation } from 'contexts/Localization'
import { getBscScanLink } from 'utils'
import { formatBigNumber } from 'utils/formatBalance'
import CopyAddress from './CopyAddress'

interface WalletInfoProps {
  hasLowBnbBalance: boolean
  onDismiss: InjectedModalProps['onDismiss']
}

const WalletInfo: React.FC<WalletInfoProps> = ({ hasLowBnbBalance, onDismiss }) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { balance, fetchStatus } = useGetBnbBalance()
  const { logout } = useAuth()

  const handleLogout = () => {
    onDismiss()
    logout()
  }

  return (
    <>
      <Text color="secondary" fontSize="12px" textTransform="uppercase" fontWeight="bold" mb="8px">
        {t('Your Address')}
      </Text>
      <CopyAddress account={account} mb="24px" />
      {hasLowBnbBalance && (
        <Message variant="warning" mb="24px">
          <Box>
            <Text fontWeight="bold">{t('QKC Balance Low')}</Text>
            <Text as="p">{t('You need QKC for transaction fees.')}</Text>
          </Box>
        </Message>
      )}
      <Flex alignItems="center" justifyContent="space-between" mb="24px">
        <Text color="textSubtle">{t('QKC Balance')}</Text>
        {fetchStatus !== FetchStatus.SUCCESS ? (
          <Skeleton height="22px" width="60px" />
        ) : (
          <Text>{formatBigNumber(balance, 6)}</Text>
        )}
      </Flex>
      <Flex alignItems="center" justifyContent="end" mb="24px">
        <LinkExternal href={getBscScanLink(account, 'address')}>{t('View on QuarkChain')}</LinkExternal>
      </Flex>
      <Button variant="secondary" width="100%" onClick={handleLogout}>
        {t('Disconnect Wallet')}
      </Button>
    </>
  )
}

export default WalletInfo
