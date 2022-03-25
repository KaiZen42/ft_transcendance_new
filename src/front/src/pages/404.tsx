import { useNavigate } from 'react-router-dom';
import '../styles/404.css';

export default function Error404() {
  const navigate = useNavigate();

  return (
    <div className="scene">
      <div className="body-scene">
        <div className="planet">
          <div className="crater"></div>
          <div className="crater"></div>
          <div className="crater"></div>
          <div className="crater"></div>
          <div className="crater"></div>
          <div className="rover">
            <div className="body"></div>
            <div className="wheels"></div>
            <div className="trace"></div>
          </div>
          <div className="flag">404</div>
        </div>
        <div className="message">
          <p>There is no life,</p>
          <p
            onClick={() => navigate('/')}
            style={{ marginLeft: '1rem', cursor: 'pointer'}}
          >
            back to home page
          </p>
        </div>
      </div>
    </div>
  );
}

{
  /* <a href={`http://${process.env.REACT_APP_BASE_IP}`}>home page</a> */
}
