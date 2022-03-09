import React from 'react';
import '../styles/404.css';

class Error404 extends React.Component {
  render() {
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
            <p>
              There is no life, back to{' '}
              <a href={`http://${process.env.REACT_APP_BASE_IP}:3000`}>
                home page
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }
}
export default Error404;
