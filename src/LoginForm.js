
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
		password: this.state.password
	}

	let url = "https://pa-vips-back.herokuapp.com/login";
	axios.post(url, data)
	.then(res => {
		console.log(res)
		let kaka = Cookies.getJSON();
		console.log("----------")
		console.log(kaka)
		console.log("**********")
		console.log(Cookies.get())
		console.log("_______________")
		console.log(Cookies.getJSON())
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
			</div>
		)
	}
}

export default LoginForm;