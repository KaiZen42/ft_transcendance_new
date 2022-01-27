import React from "react";
import "../Error404.css"

class Error404 extends React.Component {
    render() {
        return (
            <div className="scene">
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
                    <div className="flag">
                        404
                    </div>
                </div>
                <div className="message">
                    <p>
                        There is no life, back to <a href={`http://${process.env.REACT_APP_BASE_IP}:8080`}>home page</a>
                    </p>
                </div>
            </div>
        )
    }

}
export default Error404;