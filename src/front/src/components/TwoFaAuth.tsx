import axios from "axios";
import { userInfo } from "os";
import React, { ChangeEvent, FormEvent, useState } from "react";
import { Navigate } from "react-router";
import ProtectedRoute from "../components/ProtectedRoutes";

interface Props {
    onSubmit: (arg0: boolean) => void
}

export default function TwoFaAuth({onSubmit}: Props) {
    const [code, setCode] = useState("") 

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const res = await axios.post(`http://${process.env.REACT_APP_BASE_IP}:3000/api/auth2fa`,  {        
            twoFaAuthCode: code
        }, { withCredentials: true})
        onSubmit(res.data)
    }

    return(
        <form onSubmit={handleSubmit}>
            <div>
                <p>INSERISCI CODICE GOOGLE AUTH</p>
                <input className="text" onChange={(e) => setCode(e.target.value)}/>
                <button className="btn btn-primary" >Authenticate</button>
            </div>
        </form>
    )
}