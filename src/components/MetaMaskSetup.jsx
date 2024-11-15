import { useState } from 'react'
import Modal from './Modal'

function MetaMaskSetup({ onConnect }) {
  const [showModal, setShowModal] = useState(false)

  const checkAndInstallMetaMask = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' })
        onConnect()
      } catch (error) {
        console.error('User denied account access')
      }
    } else {
      setShowModal(true)
    }
  }

  return (
    <div className="metamask-setup">
      <div className="metamask-content">
        <img 
          src="https://raw.githubusercontent.com/MetaMask/brand-resources/master/SVG/metamask-fox.svg" 
          alt="MetaMask" 
          className="metamask-logo"
        />
        <h2>Connect Your Wallet</h2>
        <p>Connect your MetaMask wallet to start playing!</p>
        <button onClick={checkAndInstallMetaMask} className="connect-button">
          Connect MetaMask
        </button>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <h2>MetaMask Required</h2>
        <p>To use this application, you need to install MetaMask.</p>
        <p>MetaMask is a crypto wallet & gateway to blockchain apps.</p>
        <div className="modal-actions">
          <a 
            href="https://metamask.io/download/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="install-button"
          >
            Install MetaMask
          </a>
          <button onClick={() => setShowModal(false)} className="cancel-button">
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  )
}

export default MetaMaskSetup
