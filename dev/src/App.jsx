import { useState } from 'react'
import logo from './logo.svg'
import './App.css'
import  { Button } from 'poseidon'

// const Button = () => {
//   return (
//     <button>
//       button
//     </button>
//   )
// }

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <Button />
    </div>
  )
}

export default App
