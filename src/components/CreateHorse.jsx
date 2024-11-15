import { useState } from 'react'
import { toast } from 'react-toastify'

function CreateHorse({ contract, onHorseCreated }) {
  const [name, setName] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const tx = await contract.createHorse(name)
      await tx.wait()
      toast.success('Horse created successfully!')
      setName('')
      onHorseCreated()
    } catch (error) {
      console.error(error)
      toast.error('Failed to create horse')
    }
  }

  return (
    <div className="create-horse">
      <h2>Create New Horse</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter horse name"
          required
        />
        <button type="submit">Create Horse</button>
      </form>
    </div>
  )
}

export default CreateHorse
