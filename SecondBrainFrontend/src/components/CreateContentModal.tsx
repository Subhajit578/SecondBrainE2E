import {useRef, useState} from 'react'
import { CrossIcon } from '../icons/CrossIcon';
import { Button } from './Button';
import {Input} from './Input'
import axios from 'axios';
import { BACKEND_URL } from '../config';
enum ContentType {
    Article = "article",
    Youtube = "youtube",
    Twitter = "tweet"
}
export function CreateContentModal({ open,onClose}){
    const titleRef = useRef<HTMLInputElement>();
    const linkRef = useRef<HTMLInputElement>();
    const [type,setType] = useState(ContentType.Article)
    async function addContent(){
        const title = titleRef.current?.value
        const link = linkRef.current?.value
        console.log(title,link,type)
        await axios.post(BACKEND_URL+"/api/v1/content",{
            title,link,type
        },{
            headers:{
                "token": localStorage.getItem("token")
            }
        })
        onClose();
    }
    return <div>
        {open && <div>
        <div className='w-screen h-screen bg-slate-500 fixed top-0 left-0 opacity-60 flex justify-center'>
        </div>
        <div className='w-screen h-screen fixed top-0 left-0 flex justify-center'>
        <div className='flex flex-col justify-center'>
            <span className = "bg-white opacity-100 p-4 rounded ">
                <div className='flex justify-end'>
                    <div onClick={onClose} className='cursor-pointer'>
                    <CrossIcon />
                    </div>
                </div>
                <div>
                    <Input ref={titleRef} placeholder={"Title"}/>
                    <Input ref={linkRef} placeholder={"Link"}/>
                </div>
                <div className='flex justify-center gap-2 p-4'>
                    <Button text ="Youtube" variant="tag" onClick = {() => {
                        setType(ContentType.Youtube)
                    }}>
                    </Button>
                    <Button text ="Twitter" variant="tag" onClick = {() => {
                        setType(ContentType.Twitter)
                    }}> </Button> 
                      <Button text ="Article" variant="tag" onClick = {() => {
                        setType(ContentType.Article)
                    }}> 
                    </Button>
                </div>
                <div className='flex justify-center'>
                <Button onClick={addContent} variant = "primary" text = "Submit"/>
                </div>
            </span>
            </div>
        </div>
        
        </div>}
    </div>
}
