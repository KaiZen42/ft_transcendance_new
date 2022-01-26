import * as React from "react";
import "../Login.css";
import axios from "axios";
import { Navigate} from "react-router-dom";

class SignUp extends React.Component {
  username = "";
  email = "";
  password = "";
  passwordConf = "";
  state = {
    redirect: false
  };

  submit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    const response = await axios.post("http://localhost:3000/api/register", {
      name: this.username,
      email: this.email,
      password: this.password,
      passwordConfirm: this.passwordConf,
    });

    console.log(response.data);
    this.setState({
      redirect: true
    })
  };
  render() {

    if(this.state.redirect){
        return <Navigate to={'/signin'}/>
    }
    return (
      <main className="form-signin">
        <form onSubmit={this.submit}>
          <h1 className="h3 mb-3 fw-normal">Please Sign Up</h1>

          <input
            className="form-control"
            placeholder="Username"
            required
            onChange={(e) => (this.username = e.target.value)}
          />

          <input
            type="email"
            className="form-control"
            placeholder="Email - name@example.com"
            required
            onChange={(e) => (this.email = e.target.value)}
          />

          <input
            type="password"
            className="form-control"
            placeholder="Password"
            required
            onChange={(e) => (this.password = e.target.value)}
          />
          <input
            type="password"
            className="form-control"
            placeholder="Confirm Password"
            required
            onChange={(e) => (this.passwordConf = e.target.value)}
          />

          <button className="w-100 btn btn-lg btn-primary" type="submit">
            Sign Up
          </button>
        </form>
      </main>
    );
  }
}

export default SignUp;
