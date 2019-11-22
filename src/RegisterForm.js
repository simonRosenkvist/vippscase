import React from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';

const ButtonOrder = ({ children, ...rest}) => {
    return <button className="btn btn-primary"{...rest}>{children}</button>
}

const ButtonSpinner = () =>(
    <span className="card-text">
        <span className="spinner-border spinner-border-sm pa-spinner" 
            role="status" 
            aria-hidden="true">
        </span> 
           Please wait
    </span>
)

class RegisterForm extends React.Component {
	state = {
		name: "",
		password: "",
		email: "",
		lastname: "",
		street: "",
		postcode: "",
		city: "",
		birthdate: "",
        rdyToMove: false,
        doRegister: false
	}
		
	
	onChangeName = (event) => {
		let val = event.target.value;
		this.setState({ name: val});
	}


	onChangePassword = (event) => {
		let val = event.target.value;
		this.setState({ password: val });
	}

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
        this.setState({
            doRegister: true
        })

		
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
		
        const parent = this
        axios.post(this.props.apiUrl + 'register/user', data)
		.then((response) => {
            if(response.status === 201){
                console.log('user register redirect to login or confirmation page')
                parent.setState({
                    rdyToMove: true,
                    doRegister: false
                })
            }
		})
		
		

	}

	render() {
        if(this.state.rdyToMove){
            return <Redirect to={{ pathname: '/registersuccess' }}/>
              
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
                            required
                        />
                    </div>
                    <div className="form-group col-md-6">
				        <label htmlFor="inputLastname">Lastname </label>
				        <input type="text" 
                            placeholder="Lastname" 
                            id="inputLastname"
                            className="form-control"
                            onChange={this.onChangeLastName} 
                            required
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
                            required
                    />  
                    </div>
                    <div className="form-group col-md-6">
                        <label htmlFor="inputPassword">Password </label>
				        <input type="password" 
                            placeholder="Password" 
                            id="inputPassword"
                            className="form-control"
                            onChange={this.onChangePassword} 
                            required
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
                            required
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
                        required
                    />
                </div>
                <div className="form-row">
                    <div className="form-group col-md-6">
				        <label htmlFor="inputZip">Postcode </label>
				        <input type="integer" step="1" pattern="\d+" min="2"
                            placeholder="Postcode" 
                            id="inputZip"
                            className="form-control"
                            onChange={this.onChangePostcode} 
                            required
                        />
                    </div>
				    <div className="form-group col-md-6">
                        <label htmlFor="inputCity">City </label>
				        <input type="text" 
                            placeholder="City" 
                            id="inputCity"
                            className="form-control"
                            onChange={this.onChangeCity}
                            required
                        />
                    </div>
                </div>
               <ButtonOrder type="submit" disabled={ this.state.doRegister }>
                            { this.state.doRegister ? <ButtonSpinner /> : "Register" }
                </ButtonOrder>
			</form>
		</main>
	);
	}
}

export default RegisterForm;
