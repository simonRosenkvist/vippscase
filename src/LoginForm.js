
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

/*sendStuff = (event) => {
	axios.get(this.state.local)
	.then(response => {
		console.log(response.statusText)
		console.log(response.data.data)
		
	})
}*/


onSubmitUser = (event) => {
	event.preventDefault();
    this.setState({
        isPressed: true
    })
    console.log("submit user")
	
    /*console.log()
    this.props.setState({
        isLoggedin: 1
    })*/

    let data = {
		email: this.state.email,
		password: this.state.password,
	}
	
	//console.log("email: " + data.email + ". pass: " + data.password);

	const httpOptions = {
		headers: { 
			'Content-Type': 'application/json',
			'Access-Control-Allow-Credentials': 'true',
		},
		withCredentials: true,

	  };
    const parent = this;
    axios.post(this.props.apiUrl + 'login', data, httpOptions)
	//axios.post(this.state.local, data, httpOptions)
        .then((response) => {
			//console.log(document.cookie)
            //console.log('status_ ', response.statusText)
            if(response.status === 200){
                //parent.onLoggedInChanged(1)
  //              parent.props.match.onLoggedInChange(1)
                console.log('isloggedin: ', parent.props.isLoggedin)
                //parent.propsisLoggedin = 1
                /*parent.props.setState({ // dont work
                    isLoggedin: 1
                })*/
                //parent.props.tests()
                parent.props.onLoggedInChange(1) // funkar med gamla sättet
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

		if (this.props.isLoggedin > 0) {
			return( 
				<div className="row no-gutters">
	                <h2>Welcome!</h2>
	                <p>This is the hipster store of fashinon clothes for all your consumer needs. We take great care to include animal testing, gluten and lactose in all of our products!</p>
				</div>
			);
		}

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
	}
}

export default LoginForm;
