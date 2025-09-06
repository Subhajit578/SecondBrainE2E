import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {Button} from "./components/Button"
import { PlusIcon} from './icons/PlusIcon'
import { ShareIcon } from './icons/ShareIcon'
function App() {

  return (
    <>
    <Button variant="primary" text = "Add Content" startIcon = {<PlusIcon/>}>

    </Button>
    <Button variant="secondary" text = " Share Brain" startIcon={<ShareIcon/>}></Button>
    </>
  )
}

export default App
