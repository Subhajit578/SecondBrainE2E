import { useState } from 'react'
import {Button} from "../components/Button"
import {Card} from "../components/Card"
import { PlusIcon} from '../icons/PlusIcon'
import { ShareIcon } from '../icons/ShareIcon'
import { CreateContentModal } from '../components/CreateContentModal'
import { Sidebar } from '../components/Sidebar'
import { useContent } from '../hooks/useContent'
export function Dashboard() {
  const [modalOpen,setModalOpen] = useState(false)
  const contents = useContent()
  
  return (
    <div>
      <Sidebar />
      <div className='p-4 ml-72 min-h-screen bg-gray-100 border-2'>
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
    <div className='flex gap-4 flex-wrap' >
    {contents.map(({type,link,title}) =>
    <Card type = {type} link ={link} title = {title}/>
    )}
    </div>
    </div>
    </div>
  )
}

export default Dashboard
 //Todos  - Make Youtube , Twitter, sort work 
 // - Work on Share Brain 
 // - Work on delete Post and Work on re rendering 