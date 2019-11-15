
import React from 'react';
import axios from 'axios';


class LoginForm extends React.Component {
	state = {
		local: "http://localhost:8080/login",
		live: "https://pa-vips-back.herokuapp.com/login",
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

/*sendStuff = (event) => {
	axios.get(this.state.local)
	.then(response => {
		console.log(response.statusText)
		console.log(response.data.data)
		
	})
}*/

onSubmitUser = (event) => {

	let data = {
		email: this.state.email,
		password: this.state.password,
	}
	
	console.log("email: " + data.email + ". pass: " + data.password);


    axios.post(this.state.local, data)
        .then((response) => {
            console.log(response);
            console.log(response.data);
		})
}
	render() {
		return( 
			<div className="row no-gutters">
                <div className="col-md-3">
				    <div className="card">
                        <form className="form-group">
                            <label htmlFor="loginEmail">Email</label>
					        <input type="text" className="form-control" id="loginEmail" onChange={this.onChangeEmail} placeholder="Email"></input>

						    <br />

					        <label>Password: </label>
					        <input type="password" className="form-control" onChange={this.onChangePassword} placeholder="Password"></input>

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
