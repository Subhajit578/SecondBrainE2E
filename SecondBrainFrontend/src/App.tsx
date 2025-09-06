import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {Button} from "./components/Button"
import {Card} from "./components/Card"
import { PlusIcon} from './icons/PlusIcon'
import { ShareIcon } from './icons/ShareIcon'
import { CreateContentModal } from './components/CreateContentModal'
function App() {
  const [modalOpen,setModalOpen] = useState(true)
  return (
    <div className='p-4'>
      <CreateContentModal open ={modalOpen} onClose={() => {
        setModalOpen(false);
      }}/>
      <div className='flex justify-end gap-4'>
    <Button onClick={()=> {
      setModalOpen(true)
    }} variant="primary" text = "Add Content" startIcon = {<PlusIcon/>}>
    </Button>
    <Button variant="secondary" text = " Share Brain" startIcon={<ShareIcon/>}></Button>
    </div>
    <div className='flex gap-4' >
    <Card type = "youtube" link = "https://www.youtube.com/watch?v=UwExnWHdHD4" title = "Youtube Video">
    </Card>
    <Card type = "twitter" link = "https://x.com/elonmusk/status/1964029014357725512" title = "Tweet">
    </Card>
    </div>
    </div>
  )
}

export default App
