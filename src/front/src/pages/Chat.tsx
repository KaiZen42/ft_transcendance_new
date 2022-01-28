import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client"
const ENDPOINT = "http://10.11.12.1:3000";

function Chat() {
   const [response, setResponse] = useState("");

   useEffect(() => {
    const socket = socketIOClient(ENDPOINT);
    socket.on("FromAPI", data => {
      setResponse(data);
    });
  }, []);
  setResponse("ciaone");
  return (
    <p>
      It's <time dateTime={response}>{response}</time>
    </p>
  ); 
}

export default Chat;
