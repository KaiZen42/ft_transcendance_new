import { useLocation } from 'react-router-dom';

export default function SignIn() {
  let location = useLocation();

  let from: any = location.state;
  const url: string =
    'https://api.intra.42.fr/oauth/authorize?client_id=' +
    process.env.REACT_APP_CLIENT_ID +
    '&redirect_uri=' +
    process.env.REACT_APP_REDIRECT_URI +
    '&response_type=code' +
    '&state=' +
    from.from.pathname;

  return (
    <div>
      <p></p>
      {window.location.replace(url)}
    </div>
  );
}
