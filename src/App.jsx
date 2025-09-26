import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1 className="title">
        HELPDESK
      </h1>
      <h3>PLATAFORMA DE CHAMADOS DA INFORMÁTICA</h3>
      <img src="logoCharqueadas.png" alt="" />
    </>
  )
}

export default App
