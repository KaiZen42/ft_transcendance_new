// import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Chat from './pages/chat/Chat';
import Leaderboard from './pages/Leaderboard';
import SignIn from './pages/SignIn';
import Error404 from './pages/404';
import ProtectedRoute from './components/ProtectedRoutes';
import Profile from './pages/Profile';
import TwoFaAuth from './pages/TwoFaAuth';
import Game from './pages/Game';
import  { createContext, useEffect, useState } from 'react';
import { io , Socket} from 'socket.io-client';
import { wait } from '@testing-library/user-event/dist/utils';
import e from 'express';

const WS_SERVER = `http://${process.env.REACT_APP_BASE_IP}:3001/chat`;

export interface context
{
  socket: Socket | undefined; 
  userId: number;
  online: number[]
}

export const Context = createContext<context>({
  socket: undefined,
  userId: -1,
  online: []
});

export default function App() {
  
  const [checkOnline, setCk] = useState(false)
  const [contextData, setcontextData] = useState<context>({
  socket: undefined,
  userId: -1,
  online: []
});


  function getUser()
  {
    //console.log("getUser")
    fetch(`http://${process.env.REACT_APP_BASE_IP}:3001/api/user`, {
        credentials: 'include',
      })
        .then((response) => response.json())
        .then((result) => {
          setcontextData({
            socket: io(WS_SERVER), 
            userId: result.id,
            online: []
          })
          //console.log("getted: ", contextData)
        })
        .catch((error) => console.log(error))
        
  }
  function quit(event: any){
    event.preventDefault();
    //console.log("APP DEST: " ,contextData)
    if (contextData.socket === undefined)
      return;
      contextData.socket.emit("offline", contextData.userId)
  }

  
  useEffect(() => {
    window.onbeforeunload = quit
    //window.onclose = quit
    console.log("RENDER: ", contextData)
    if (contextData.socket === undefined)
      return getUser()
    if (contextData.online.length === 0 )
     contextData.socket.emit("WhoOnline");
    

    
  },[contextData])

  useEffect(()=>
  {
    if (contextData.socket === undefined) return
    console.log("NOT 2 TIMES!")
    contextData.socket.on("areOnline", (ons: number[])=>
      {
        if (contextData.online.length === 0)
          setcontextData(pred => {
            pred.online = ons;
            return {...pred};
          })
          console.log("are online: ", ons)
      })
    
    if (contextData.userId != -1
      && !checkOnline)
      {
        setCk(true)
        console.log("I "+ contextData.userId + " go online")
        contextData.socket?.emit("online", contextData.userId)
      }
      
      contextData.socket.on("areNowOnline", (id: number)=>
      {
        
          setcontextData(pred => {
            if (pred.online.findIndex((el)=> (el === id || el === -id)) === -1)
              pred.online = [...pred.online, id]
            console.log(" ON id: ", id, pred)
            return {...pred};
          })
        })
        
      
      contextData.socket.on("areNowOffline", (id : number) =>
      {
        if (contextData.online.length === 0)
          return;
        else
          setcontextData(pred => {
            const index = pred.online.findIndex((el)=> (el === id || el === -id))
            
            if (index !== -1)
              pred.online.splice(index, 1)
            console.log("OFF id: ", id, {...pred})
            return {...pred};
          })
      })
  
      contextData.socket.on("areNowInGame", (id : number) =>
      {
        if (contextData.online.length === 0)
          return;
        else
          setcontextData(pred => {
            
            const index = pred.online.findIndex((el)=>( el === id))
            pred.online[index] = -pred.online[index]
            console.log("IN GAME id: ", id, {...pred})
            return {...pred};
          })
      })
    
      contextData.socket.on("areNotInGame", (id : number) =>
      {
        if (contextData.online.length === 0)
          return;
        else
          setcontextData(pred => {
            const index = pred.online.findIndex((el)=> (el === -id))
            pred.online[index] = -pred.online[index]
            console.log("NOT IN GAME id: ", id, {...pred})
            return {...pred};
          })
      })    
     
  },[contextData.socket])

  return (
    <div className="App">
      
      <BrowserRouter>
      <Context.Provider value={contextData}>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                  <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/leaderboard"
            element={
              <ProtectedRoute>
                <Leaderboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <Chat />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/game"
            element={
              <ProtectedRoute>
                <Game />
              </ProtectedRoute>
            }
          />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/two_fa_auth" element={<TwoFaAuth />} />
          <Route path="*" element={<Error404 />} />
        </Routes>
        </Context.Provider>
      </BrowserRouter>
    </div>
  );
}
