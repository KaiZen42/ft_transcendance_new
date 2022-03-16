import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

export default function ProtectedRoute({
  children,
}: {
  children: JSX.Element;
}) {
  const [page, setPage] = useState<JSX.Element>(<></>);

  let location = useLocation();

  useEffect(() => {
    async function getUser() {
      const res = await fetch(
        `http://${process.env.REACT_APP_BASE_IP}:3001/api/user`,
        { credentials: 'include' }
      );
      const data = await res.json();
      if (data.id != null) {
        if (data.two_fa)
          setPage(
            <Navigate to="/two_fa_auth" state={{ from: location }} replace />
          );
        else setPage(children);
      } else
        setPage(<Navigate to="/signin" state={{ from: location }} replace />);
    }
    getUser();
  });

  return page;
}
