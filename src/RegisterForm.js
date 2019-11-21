import React from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import OrderSuccess from './OrderSuccess'; // för å testa redirect

class RegisterForm extends React.Component {
	state = {
		local: "http://localhost:8080/register/user",
		live: "https://pa-vips-back.herokuapp.com/register/user",
		name: "",
		password: "",
		email: "",
		lastname: "",
		street: "",
		postcode: "",
		city: "",
		birthdate: "",
        rdyToMove: false
	
			

	}
		
		//password: ""
	
	onChangeName = (event) => {
		let val = event.target.value;
		this.setState({ name: val});
	}


	onChangePassword = (event) => {
		let val = event.target.value;
		this.setState({ password: val });
	}
//asd
	onChangeEmail = (event) => {
		let val = event.target.value;
		this.setState({ email: val });
	}

	onChangeLastName = (event) => {
		let val = event.target.value;
		this.setState({ lastname: val });
	}
	onChangeStreetName = (event) => {
		let val = event.target.value;
		this.setState({ street: val });
	}

	onChangePostcode = (event) => {
		let val = event.target.value;
		this.setState({ postcode: val });
	}
	onChangeCity = (event) => {
		let val = event.target.value;
		this.setState({ city: val });
	}
	onChangeBirthyear = (event) => {
		let val = event.target.value;
		this.setState({ birthdate: val });
	}
	

	onSubmitForm = (event) => {
		event.preventDefault();
		//console.log('sending email: ' + this.state.email + ' and password: ' + this.state.password + ' to server, remember to salt and hash password on server!');


		
		let data = {
			"name": this.state.name,
			"password": this.state.password,
			"email": this.state.email,
			"lastname": this.state.lastname,
			"street": this.state.street,
			"postcode": this.state.postcode,
			"city": this.state.city,
			"birthdate": this.state.birthdate
		}
		
		//axios.post(this.state.local, data)
        const parent = this
        axios.post(this.props.apiUrl + 'register/user', data)
		.then((response) => {
			//console.log(response)
            if(response.status === 201){
                console.log('user register redirect to login or confirmation page')
                parent.setState({
                    rdyToMove: true
                })
            }
		})
		
		

	}

	render() {
		//name, password, email, lastname, street, postcode, city, birthdate dd/mm/yyyy
        console.log('move? ',this.state.rdyToMove)
        if(this.state.rdyToMove){
            console.log('ready to redirect: ', this.state.rdyToMove)
            //return <Redirect to = {{ pathname: "/home" }} />;
            return <Redirect to={{ pathname: '/ordersuccess' }}/>
              
        }

	return (
		<main className="container-fluid center">
			<form className="form-group mt-3 p-3 border rounded shadow-lg" 
			onSubmit={this.onSubmitForm }>
                <div className="form-row">
                    <div className="form-group col-md-6">
				        <label htmlFor="inputName">Firstname </label>
				        <input type="text"
                            placeholder="Firstname"
                            id="input"
                            className="form-control"
                            onChange={this.onChangeName} 
                        />
                    </div>
                    <div className="form-group col-md-6">
				        <label htmlFor="inputLastname">Lastname </label>
				        <input type="text" 
                            placeholder="Lastname" 
                            id="inputLastname"
                            className="form-control"
                            onChange={this.onChangeLastName} 
                        />
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group col-md-6">
                     <label htmlFor="inputMail">Email </label>
				        <input type="email" 
                            placeholder="Email" 
                            id="inputMail"
                            className="form-control"
                            onChange={this.onChangeEmail} 
                    />  
                    </div>
                    <div className="form-group col-md-6">
                        <label htmlFor="inputPassword">Password </label>
				        <input type="password" 
                            placeholder="Password" 
                            id="inputPassword"
                            className="form-control"
                            onChange={this.onChangePassword} 
                        />
                    </div>
                </div>
			     <div className="form-row">
                    <div className="form-group col-md-6">

				        <label htmlFor="inputBirth">Birthdate </label>
				        <input type="text"
                            placeholder="dd/mm/yyyy" 
                            id="inputBirth"
                            className="form-control"
                            onChange={this.onChangeBirthyear} 
                        />
                    </div>
                </div>
                <div className="form-group">					
				    <label htmlFor="inputStreet">Street </label>
				    <input type="text" 
                        placeholder="1234 Main St" 
                        id="inputStreet"
                        className="form-control"
                        onChange={this.onChangeStreetName} 
                    />
                </div>
                <div className="form-row">
                    <div className="form-group col-md-6">
				        <label htmlFor="inputZip">Postcode </label>
				        <input type="integer" 
                            placeholder="Postcode" 
                            id="inputZip"
                            className="form-control"
                            onChange={this.onChangePostcode} 
                        />
                    </div>
				    <div className="form-group col-md-6">
                        <label htmlFor="inputCity">City </label>
				        <input type="text" 
                            placeholder="City" 
                            id="inputCity"
                            className="form-control"
                            onChange={this.onChangeCity} 
                        />
                    </div>
                </div>
               
				<button className="btn btn-primary">Register</button>
			</form>
		</main>
	);
	}
}

export default RegisterForm;
