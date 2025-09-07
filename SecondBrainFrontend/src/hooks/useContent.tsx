import { useEffect, useState } from "react";
import { BACKEND_URL } from "../config";
import axios from "axios";
export interface Content {
    id: string;
    title: string;
    link: string;
    type: "youtube" | "tweet" | "article"; // match your backend enum
  }

export function useContent(): Content[] {
    const [contents,setContents] = useState<Content[]>([]);
    useEffect(()=> {
        axios.get<Content[]>(BACKEND_URL + "/api/v1/allContent",{headers:{
            token : localStorage.getItem("token")
        },})
        .then((response) => {
            setContents(response.data)
        })
    },[])
    return contents;
}