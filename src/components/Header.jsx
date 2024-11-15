import { useState, useEffect } from 'react'
import { ethers } from 'ethers'

function Header({ account, onConnect }) {
  const [networkName, setNetworkName] = useState('')
  const [balance, setBalance] = useState('')

  useEffect(() => {
    if (account) {
      getNetworkAndBalance()
    }
  }, [account])

  const getNetworkAndBalance = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const network = await provider.getNetwork()
      const balance = await provider.getBalance(account)
      
      setNetworkName(network.name)
      setBalance(ethers.utils.formatEther(balance).slice(0, 6))
    } catch (error) {
      console.error('Error fetching network and balance:', error)
    }
  }

  const formatAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <header className="app-header">
      <div className="header-content">
        <h1>Horse Racing Game</h1>
        <div className="wallet-info">
          {account ? (
            <>
              <div className="network-badge">
                {networkName.charAt(0).toUpperCase() + networkName.slice(1)}
              </div>
              <div className="account-badge">
                <span>{formatAddress(account)}</span>
                <span className="balance">{balance} ETH</span>
              </div>
            </>
          ) : (
            <button className="connect-wallet" onClick={onConnect}>
              Connect MetaMask
            </button>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
