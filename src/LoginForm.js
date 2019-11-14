
import React from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';


class LoginForm extends React.Component {
	state = {
		email: "",
		password: ""
	}

onChangeEmail = (event) => {
		const email = event.target.value;
		this.setState({
			email: email
		})
	}

onChangePassword = (event) => {
	const password = event.target.value;
	this.setState({
		password: password
	})
}

onSubmitUser = (event) => {
	console.log("email: " + this.state.email + ". pass: " + this.state.password);
	/*
	Submit to backend happends here'
	*/
	let data = {
		email: this.state.email,
		password: this.state.password,
	}

	//let url = "https://pa-vips-back.herokuapp.com/login";
	let url = "http://localhost:8080/login";
	/*axios.post(url, data)
	.then(res => {
		console.log(res)
        console.log(Cookies.getJSON())
        console.log('----------------------------')
        console.log(res.headers['Set-Cookies'])
    })*/

    axios.post(url, data)
        .then((response) => {
            console.log(response);
            console.log(Cookies.getJSON());
            console.log(response.data);
		})
}

	render() {
		return( 
			<div class="row no-gutters">
                <div class="col-md-3">
				    <div class="card">
                        <form class="form-group">
                            <label htmlFor="loginEmail">Email</label>
					        <input type="text" class="form-control" id="loginEmail" onChange={this.onChangeEmail} placeholder="Email"></input>

						    <br />

					        <label>Password: </label>
					        <input type="password" class="form-control" onChange={this.onChangePassword} placeholder="Password"></input>

					        <br />

					        <button onClick={this.onSubmitUser} type="button">Log In</button>

				        </form>
                    </div>
                </div>
			</div>
		)
	}
}

export default LoginForm;
