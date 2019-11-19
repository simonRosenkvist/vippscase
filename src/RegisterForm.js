import React from 'react';

class RegisterForm extends React.Component {
	state = {
		local: "http://localhost:8080/register",
        live: "https://pa-vips-back.herokuapp.com/register",
		email: "",
		password: ""
	}

	onChangeEmail = (event) => {
		let val = event.target.value;
		this.setState({ email: val });
	}

	onChangePassword = (event) => {
		let val = event.target.value;
		this.setState({ password: val });
	}

	onSubmitForm = (event) => {
		event.preventDefault();
		console.log('sending email: ' + this.state.email + ' and password: ' + this.state.password + ' to server, remember to salt and hash password on server!');
	}

	render() {
	return (
		<div>
			<form>
				<label>Email: </label>
				<input type="text" placeholder="Email" onChange={this.onChangeEmail} />
					<br/>
				<label>Password: </label>
				<input type="password" placeholder="Password" onChange={this.onChangePassword} />
					<br/>
				<input type="submit" onClick={this.onSubmitForm} />
			</form>
		</div>
	);
	}
}

export default RegisterForm;
