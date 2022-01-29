import React, { useState, useEffect, useRef  } from "react";
import socketIOClient, { Socket } from "socket.io-client";
import { Sender } from "./Sender";
import Wrapper from "../../components/Wrapper";
const WS_SERVER = "http://localhost:3000/chat";


export function Chat() {

  const [chats, setChats] = useState<String[]>([]);
  const [message, setMessage] = useState('');
  const socketReference = useRef<Socket>();
  const [response, setResponse] = useState("");
    useEffect( () => {
        const  socket: Socket =  socketIOClient(WS_SERVER);
        console.log("AO ME PROVO A CONNETTE:");
        console.log(socket);
        socket.emit("IO SONO CONNESSO ORA NON ROMPERE");
        socket.on("connect", () => 
        {
          console.log('connected')
        });
        socket.on("disconnect", () => 
        {
          console.log('diconnected')
        });
        socket.on("message", data => 
        {
          setChats([...chats, message]);
          setResponse(data);
          console.log("data:");
          console.log(data);
      });
      socketReference.current = socket;
       return () => {
        socket.removeAllListeners()
      } 
  }, []); 

  //setResponse("ciaone");
  return (
    <Wrapper>
      <div>
        <p>
          It's {response};
        </p>
      </div>
      <div>
        <Sender socket={socketReference.current}/>
      </div>
      
   </Wrapper>
  ); 
}

export default Chat;

