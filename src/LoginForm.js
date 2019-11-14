
import React from 'react';
import axios from 'axios';
//import Cookies from 'js-cookie';


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

sendStuff = (event) => {
	axios.get("http://localhost:8080/login")
	.then(response => {
		console.log(response.statusText)
		console.log(response.data.data)
		//var wtf = document.cookie;
		//console.log(wtf)
	})
}

onSubmitUser = (event) => {
	/*
	Submit to backend happends here'
	*/
	let data = {
		email: "test1@testpw.com",
		password: "test1"
		
		//email: this.state.email,
		//password: this.state.password
	}
	
	console.log("email: " + data.email + ". pass: " + data.password);

	let url = "http://localhost:8080/login";
	axios.post(url, data)
	.then(res => {
		console.log(res.cookies)
		console.log(res)

	})
	
}
	render() {
		return( 
			<div>
				<form>
					<label>Email: </label>
					<input type="text" onChange={this.onChangeEmail} placeholder="Email"></input>

						<br />

					<label>Password: </label>
					<input type="password" onChange={this.onChangePassword} placeholder="Password"></input>

					<br />

					<button onClick={this.onSubmitUser} type="button">Log In</button>

				</form>
				<button onClick={this.sendStuff} type="button">SEND In</button>

			</div>
		)
	}
}

export default LoginForm;