import axios from "axios";
import {FormEvent, useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router";


export default function TwoFaAuth() {
    const location = useLocation();
    const from : any = location.state;
    const navigate = useNavigate()
    const [code, setCode] = useState("")
    const [authed, setAuthed] = useState<boolean | undefined>(undefined)

    useEffect(() => {
        async function getAuth() {
            const res = await fetch(`http://${process.env.REACT_APP_BASE_IP}:3000/api/user`, {credentials: "include"});
            const data = await res.json();
            if (!data.two_fa)
                navigate(-1) // che figata
            else
                setAuthed(false)
        }
        getAuth()
    }, [])

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const res = await axios.post(`http://${process.env.REACT_APP_BASE_IP}:3000/api/auth2fa`,  {        
            twoFaAuthCode: code
        }, { withCredentials: true})
        setAuthed(res.data)
    }

    return(
        <>
        {
            authed && <Navigate to={from.from.pathname}/>
        }
        {
            (authed === false) &&
            <form onSubmit={handleSubmit}>
                <div>
                    <p>INSERISCI CODICE GOOGLE AUTH</p>
                    <input className="text" onChange={(e) => setCode(e.target.value)} value={code}/>
                    <button className="btn btn-primary" >Authenticate</button>
                </div>
            </form>
        }
        </>
    )
}