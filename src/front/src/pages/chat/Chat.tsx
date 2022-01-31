import React, { useState, useEffect, useRef  } from "react";
import io, { Socket } from "socket.io-client";
import { Sender } from "./Sender";
import Wrapper from "../../components/Wrapper";
import MessageBox from "./MessageBox";
import { User } from "../../models/User.interface";
const WS_SERVER = "http://localhost:3000/chat";


/* interface Prop
{
	user : User,
} */


 

export function Chat(/* {user} : Prop */) {

  
  const [message, setMessage] = useState('');
  const [socket, setSocket] = useState<Socket>();


  useEffect(
    () =>{
      const sock = io(WS_SERVER);
      setSocket(sock);
      sock.on("connect", () => 
      {
        console.log('connected')
      });
      return () => {sock.close()};
    } ,
    [setSocket]);

  return (
    socket === undefined ?  (<Wrapper> <div>Not Connected</div> </Wrapper>)
      : (
        <Wrapper>
 
          <MessageBox socket={socket}/>
          <Sender socket={socket} />

        </Wrapper>    
  )
  );
}

export default Chat;
