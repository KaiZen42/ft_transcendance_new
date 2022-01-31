import React, { useState, useEffect, useRef  } from "react";
import socketIOClient, { Socket } from "socket.io-client";

interface Prop
{
	socket : Socket | undefined,
}

export function Sender({socket} : Prop) {
	const [message, setMessage] = useState('');

	const handleSubmit = (event: any) => {
    event.preventDefault();
		console.log("SEND TO SERVER: " + message)
		socket?.emit('message', message);
	}
	
	return(<div>
        <form onSubmit={handleSubmit} >
          <label>
            <input type="text" value={message} onChange={e => setMessage(e.target.value)}/>
          </label>
          <input type="submit" value="Send" />
      </form>
    </div>)
}

