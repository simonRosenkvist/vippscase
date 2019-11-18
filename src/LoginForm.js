
import React from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';



class LoginForm extends React.Component {
	state = {
		local: "http://localhost:8080/login",
		live: "https://pa-vips-back.herokuapp.com/login",
		email: "",
		password: ""
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

/*sendStuff = (event) => {
	axios.get(this.state.local)
	.then(response => {
		console.log(response.statusText)
		console.log(response.data.data)
		
	})
}*/

onSubmitUser = (event) => {
	event.preventDefault();
	let data = {
		email: this.state.email,
		password: this.state.password,
	}
	
	console.log("email: " + data.email + ". pass: " + data.password);


    axios.post(this.state.local, data)
        .then((response) => {
			console.log("Response: Should incloude id:22 and sessionid")
			console.log(response.data)
			

			//return response

		})
		.then((response) =>  {
			console.log(response)
		})
	}

	render() {
		return( 
			<div className="row no-gutters">
                <div className="col-md-3">
				    <div className="card">
					<form className="form-group mt-3 p-3 border rounded shadow-lg" 
							onSubmit={this.onSubmitUser}>
							<label >Email</label>
					        <input type="email" className="form-control" id="loginEmail" onChange={this.onChangeEmail} placeholder="Email"></input>

						    <br />

					        <label>Password: </label>
					        <input type="password" className="form-control" onChange={this.onChangePassword} placeholder="Password"></input>

					        <br />
							<button className="btn btn-primary">Log in</button>

				        </form>
                    </di
                </div>
			</div>
		)
	}
}

export default LoginForm;
