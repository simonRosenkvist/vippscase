
import React from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';

class LoginForm extends React.Component {
	state = {
		local: "http://localhost:8080/login",
		live: "https://pa-vips-back.herokuapp.com/login",
		email: "",
		password: "",
        loginError: "",
        rdyToMove: false,
        isPressed: false
	}

onChangeEmail = (event) => {
		const val = event.target.value;
		this.setState({
			email: val
		})
	}

onChangePassword = (event) => {
	const val = event.target.value;
	this.setState({
		password: val
	})
}


onSubmitUser = (event) => {
	event.preventDefault();
    this.setState({
        isPressed: true
    })
    console.log("submit user")
	
    let data = {
		email: this.state.email,
		password: this.state.password,
	}
	

	const httpOptions = {
		headers: { 
			'Content-Type': 'application/json',
			'Access-Control-Allow-Credentials': 'true',
		},
		withCredentials: true,

	  };
    const parent = this;
    axios.post(this.props.apiUrl + 'login', data, httpOptions)
    .then((response) => {
         if(response.status === 200){
             parent.props.onLoggedInChange(1) 
             parent.setState({
                 rdyToMove: true
                })
            }
		})
        .catch((error) => {
            if (error.response) {
                if(error.response.status === 401){
                    parent.setState({
                        loginError: "Invalid Email or password"
                    })
                }
            }
        })
		
 	}

	render() {

        if(this.state.rdyToMove){
            return <Redirect to={{ 
                                pathname: '/loginsuccess',
                                state: { 
                                        isLoggedin: this.props.live, 
                                        email: this.state.email,
                                        password: this.state.password
                                        }
                                }} 
                        />

        }

		if (this.props.isLoggedin === 0) {
		    return( 
				    <main className="container-fluid center">
					<form className="form-group mt-3 p-3 border rounded shadow-lg" 
							onSubmit={this.onSubmitUser}>
							<label >Email</label>
					        <input type="email" className="form-control" id="loginEmail" onChange={this.onChangeEmail} placeholder="Email" required></input>

						    <br />

					        <label>Password: </label>
					        <input type="password" className="form-control" onChange={this.onChangePassword} placeholder="Password" required></input>

					        <br />

							<button className="btn btn-primary">Log in</button><center>{this.state.loginError}</center>
							

				        </form>
                    </main>
		        )
        } else {
            return(<div></div>)
        }
	}
}

export default LoginForm;
