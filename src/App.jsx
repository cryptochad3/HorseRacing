import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Header from './components/Header'
import MetaMaskSetup from './components/MetaMaskSetup'
import Dashboard from './components/Dashboard'
import contractABI from './contracts/HorseRacing.json'

const CONTRACT_ADDRESS = "YOUR_CONTRACT_ADDRESS"

function App() {
  const [account, setAccount] = useState(null)
  const [contract, setContract] = useState(null)

  useEffect(() => {
    checkConnection()
    addWalletListener()
  }, [])

  const checkConnection = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' })
        if (accounts.length > 0) {
          connectWallet()
        }
      }
    } catch (error) {
      console.error('Error checking connection:', error)
    }
  }

  const addWalletListener = () => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          connectWallet()
        } else {
          setAccount(null)
          setContract(null)
        }
      })

      window.ethereum.on('chainChanged', () => {
        window.location.reload()
      })
    }
  }

  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer)
        
        setAccount(accounts[0])
        setContract(contract)
      } else {
        toast.error('Please install MetaMask!')
      }
    } catch (error) {
      console.error('Error connecting wallet:', error)
      toast.error('Failed to connect wallet')
    }
  }

  return (
    <div className="app">
      <ToastContainer />
      <Header account={account} onConnect={connectWallet} />
      
      {!account ? (
        <MetaMaskSetup onConnect={connectWallet} />
      ) : (
        <Dashboard contract={contract} account={account} />
      )}
    </div>
  )
}

export default App
