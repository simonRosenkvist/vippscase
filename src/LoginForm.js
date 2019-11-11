
import React from 'react';


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
	Submit to backend happends here
	*/
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