import {Input} from "../components/Input"
import {Button} from "../components/Button"
import { useRef } from "react";
import { BACKEND_URL } from "../config";
import { useNavigate } from "react-router-dom";
import axios from "axios"
export function SignUp(){
    const usernameRef = useRef<HTMLInputElement>();
    const passwordRef = useRef<HTMLInputElement>()
    const navigate = useNavigate()
    async function signup(){
        const username = usernameRef.current?.value;
        console.log(usernameRef.current,"username");
        const password = passwordRef.current?.value;
        await axios.post(
      `${BACKEND_URL}/api/v1/signup`,
      { username, password }
    );
    navigate("/signin")
    }
    return <div className="h-screen w-screen bg-gray-200 flex justify-center items-center">
        <div className="bg-white rounded-xl border min-w-48 p-8">
            <Input ref = {usernameRef} placeholder="Username"/>
            <Input ref = {passwordRef} placeholder="Password"/>
            <div className="flex justify-center pt-4">
            <Button onClick = {signup}loading = {false}variant = "primary" text= "Signup" fullWidth = {true}/>
            </div>
        </div>
    </div>
}