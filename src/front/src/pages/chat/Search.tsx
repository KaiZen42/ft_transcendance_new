import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Autocomplete from '@mui/material/Autocomplete';
import { User } from '../../models/User.interface';
import { KeyboardReturnOutlined } from '@mui/icons-material';

interface props{
  setSearch: (str:string) => void,
}

export default function SearchBox({setSearch}: props) {
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
  }, []);

  function selection(e: any): void {
    const str = e.target.value;
    const arr = data.map((users) => users.username);
    for (let i: number = 0; i < arr.length; i++) {
      if (arr[i] === str) {
        setSearch(str);
        return;
      }
    }
    setSearch('');
  }

  return (
    <>
      <Stack spacing={2} sx={{ width: '100%', text: 'white' }}>
        <Autocomplete
          id="Search a User"
          freeSolo
          options={data.map((mappedtype) => mappedtype.username)}
          renderInput={(params) => (
            <TextField
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  selection(e);
                }
              }}
              {...params}
              label="Search a User"
            />
          )}
        />
      </Stack>
    </>
  );
}
