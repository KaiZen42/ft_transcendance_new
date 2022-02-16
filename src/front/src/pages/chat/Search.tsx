import React, { KeyboardEvent, KeyboardEventHandler, MouseEvent,SetStateAction, SyntheticEvent, useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Autocomplete from '@mui/material/Autocomplete';
import { DisplayUser, User } from '../../models/User.interface';
import { DataArray } from '@mui/icons-material';
import e from 'express';
import { text } from 'stream/consumers';

export default function SearchBox() {
  const [result, setResult] = useState<string | null>('');
  const [data, setData] = useState<User[]>([]);

    async function getter() {
      const res = await fetch(
        `http://${process.env.REACT_APP_BASE_IP}:3001/api/users`,
         { credentials: 'include' }
      );
      setData(await res.json());
    }

    useEffect(() => {
        getter();
    },[])

    function selection(e: SyntheticEvent, str: any): void {
        e.preventDefault()
        // if(e.key === "Enter")
            console.log("Aaaaaaaaa  ", e.target.value)
        const arr = data.map((users) => users.username);
        for(let i: number = 0; i < arr.length; i++)
        {
            if(arr[i] === str)
                console.log("weeeeeeee    ", str);
        }
        console.log("false")
    }

    console.log('search data: ', data);
    return (
    <>
      <Stack spacing={2} sx={{ width: "100%", text: "white"}} >
        <Autocomplete
          onKeyPress={(e, v) => selection(e, v)}
          id="Search a User"
          freeSolo
          options={data.map((mappedtype) => mappedtype.username)}
          renderInput={(params) => <TextField {...params} label="Search a User" />}
        />
      </Stack>
    </>
  );
}
