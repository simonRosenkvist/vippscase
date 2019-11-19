import React from 'react';
import axios from 'axios';

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
asd
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
		
		axios.post(this.state.local, data)
		.then((response) => {
			console.log(response)
		})
		
		

	}

	render() {
		//name, password, email, lastname, street, postcode, city, birthdate dd/mm/yyyy
	return (
		<div>
			<form className="form-group mt-3 p-3 border rounded shadow-lg" 
			onSubmit={this.onSubmitForm }>
				<label>Name: </label>
				<input type="text" placeholder="Name"  onChange={this.onChangeName} />
					<br/>
				<label>Password: </label>
				<input type="password" placeholder="Password" onChange={this.onChangePassword} />
					<br/>
				<label>Mail: </label>
				<input type="email" placeholder="Mail" onChange={this.onChangeEmail} />
				<br/>	
				<label>Lastname: </label>
				<input type="text" placeholder="Lastname" onChange={this.onChangeLastName} />
				<br/>	
				<label>Street: </label>
				<input type="text" placeholder="Street" onChange={this.onChangeStreetName} />
				<br/>	
				<label>Postcode: </label>
				<input type="integer" placeholder="Postcode" onChange={this.onChangePostcode} />
				<br/>	
				<label>City: </label>
				<input type="text" placeholder="City" onChange={this.onChangeCity} />
				<br/>	
				<label>birthdate: </label>
				<input type="text" placeholder="dd/mm/yyyy" onChange={this.onChangeBirthyear} />
				<br/>	
				<button className="btn btn-primary">Submit</button>
			</form>
		</div>
	);
	}
}

export default RegisterForm;
