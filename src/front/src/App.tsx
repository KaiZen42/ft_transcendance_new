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
  online: Set<number>
}

export const Context = createContext<context>({
  socket: undefined,
  userId: -1,
  online: new Set<number>()
});

export default function App() {
  
  const [contextData, setcontextData] = useState<context>({
  socket: undefined,
  userId: -1,
  online: new Set<number>()
});

  function getOnline() 
  {
    fetch(`http://${process.env.REACT_APP_BASE_IP}:3001/api/chat/userOnline`,{credentials: "include"})
    .then((response) => response.json())
    .then((result) => {
          setcontextData(pred => {
            pred.online = result;
            return pred;
          })
          console.log("onlines: ", contextData)
        })
        .catch((error) => console.log(error))
  }

  function getUser()
  {
    console.log("getUser")
    fetch(`http://${process.env.REACT_APP_BASE_IP}:3001/api/user`, {
        credentials: 'include',
      })
        .then((response) => response.json())
        .then((result) => {
          setcontextData({
            socket: io(WS_SERVER), 
            userId: result.id,
            online: new Set<number>([])
          })
          console.log("getted: ", contextData)
        })
        .catch((error) => console.log(error))
        
  }
  function quit(event: any){
    event.preventDefault();
    //console.log("APP DEST: " ,contextData)
    if (contextData.socket === undefined)
      return;
    contextData.socket?.emit("offline", contextData.userId)
  }

  useEffect(() => {
    console.log("RENDER: ", contextData)
    if (contextData.socket === undefined)
      return getUser()
    else
      contextData.socket?.emit("online", contextData.userId)
    contextData.socket.on("areNowOnline", (id: number)=>
    {
      if (contextData.online.size === 0)
        getOnline();
      else
        setcontextData(pred => {
          console.log("id: ", id, pred)
          
          pred.online = new Set([...Array.from(pred.online), id])
          return pred;
        })
    })
    
   

    window.onbeforeunload = quit
    window.onclose = quit
  },[contextData])


  
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
