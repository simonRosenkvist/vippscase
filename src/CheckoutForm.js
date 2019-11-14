import * as React from 'react';
import {
    injectStripe,
//    CardElement,
    CardNumberElement,
    CardExpiryElement,
    CardCVCElement,
        } from 'react-stripe-elements';
//import axios from 'axios';

const uuidv4 = require('uuid/v4');
class CheckoutForm extends React.Component {
    
    constructor(props){
        super(props);
        this.state = {
            name: "",
            email: "",
            phone: "",
            address: "",
            city: "",
            statename: "",
            country: "",
            zipCode: "",
            amount: "1337",
            saveMe: false,
            idempotency: uuidv4()
        }
    }

    handleSubmit = async (e) => {
        e.preventDefault();

        // if loged in and has a previous purchase render other form... 

        // if saveme box is checked (saveMe = true) first create the customer and then do the charge else just charge the card with the details form
        
            console.log('save my card and take my money')
            try {
                // first create the payment intent to get the stripe client_secret 
/*                const parent = this;
                let idempotencyThing = this.state.idempotency
                let amount = this.state.amount
                let response = await fetch('http://localhost:8080/stripe/setupintent', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ amount, idempotencyThing })
                })
                .then(function (response) {
                    return response.json()
                })
                .then(function (responseJson) {
                    console.log(responseJson)
                    let client_secret = responseJson.client_secret
                    console.log('client_secret', client_secret)
                    // charge the card
                    //parent.props.stripe.createPaymentMethod(clientInformation)
                    parent.props.stripe.handleCardPayment(client_secret, {
                        payment_method_data: {
                            billing_details: {
                                name: parent.state.name,
                                email: parent.state.email,
                                phone: parent.state.phone,
                                address: {
                                    city: parent.state.city,
                                    country: parent.state.country,
                                    line1: parent.state.address,
                                    postal_code: parent.state.zipCode,
                                    state: parent.state.statename
                                }
                            }
                        }//,
                        //setup_future_usage: 'on_session'
                        
                    })
                })
                .then(function (result) {
                    if(result.error){
                        console.log(result.error.message)
                    } else {
                        if(result.paymentIntent.status === 'succeeded'){
                            console.log("payment successful now save customer and redirect to success page...")
                        }
                    }
                })
                
  */        
            //this shit works....
            const parent = this;
            let amount = this.state.amount;
            let idempotencyThing = this.state.idempotency;
            let response = await fetch('http://localhost:8080/stripe/intent', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({ amount, idempotencyThing })
            })
            .then(function (response) {
                console.log('response: ', response)
                return response.json();
            })
            .then(function (responseJson){
                let clientSecret = responseJson.client_secret;
                return parent.props.stripe.handleCardPayment(clientSecret,{
                    payment_method_data: {
                        billing_details: {
                            name: parent.state.name,
                            email: parent.state.email,
                            phone: parent.state.phone,
                            address: {
                                city: parent.state.city,
                                country: parent.state.country,
                                line1: parent.state.address,
                                postal_code: parent.state.zipCode,
                                state: parent.state.statename
                            }
                        }
                    },
                    setup_future_usage: 'on_session'
                } )
            })
            .then(function (result) {
                console.log("result then")
                console.log(result)
                //return result.json()
                if(result.error){
                    console.log('fail with: ', result.error.message) // catches the first vailid error message.. ex email then country code and at last any card errors like processing error and funds errors.
                } else {
                    if(result.paymentIntent.status === 'succeeded'){
                        console.log('payment succeded now save the customer and add the order...')

                    }
                }
            })

                //setupinent test..
                /*let parent = this
                let response = await fetch('http://localhost:8080/stripe/setupintent')
                .then(function (response) {
                    console.log("1 res: ", response)
                    return response.json()
                })
                .then(function (responseJson){
                    console.log("2nd resp: ", responseJson)
                    let client_secret = responseJson.client_secret
                    return parent.props.stripe.handleCardSetup(client_secret, {
                        payment_method: {
                            billing_details: {
                                name: parent.state.name,
                                email: parent.state.email,
                                phone: parent.state.phone,
                                address: {
                                    city: parent.state.city,
                                    country: parent.state.country,
                                    line1: parent.state.address,
                                    postal_code: parent.state.zipCode,
                                    state: parent.state.statename
                                }
                            }
                        }
                    })
                })
                .then(function (result){
                    console.log("result")
                    console.log(result)

                    if(result.error){
                        console.log("error: ", result.error.message)
                    } else {
                        console.log('else') 
                    }
                })*/
            } catch (error) {
                
            }

        // working payment intent
        /*
        try {
            const parent = this;
            let amount = this.state.amount;
            let idempotencyThing = this.state.idempotency;
            let response = await fetch('http://localhost:8080/stripe/intent', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({ amount, idempotencyThing })
            })
            .then(function (response) {
                return response.json();
            })
            .then(function (responseJson){
                let clientSecret = responseJson.client_secret;
                parent.props.stripe.handleCardPayment(clientSecret,{
                    payment_method_data: {
                        billing_details: {
                            name: parent.state.name,
                            email: parent.state.email,
                            phone: parent.state.phone,
                            address: {
                                city: parent.state.city,
                                country: parent.state.country,
                                line1: parent.state.address,
                                postal_code: parent.state.zipCode,
                                state: parent.state.statename
                            }
                        }
                    }
                } );
            })
        } catch (error) {
            
        }*/
    }

    render() {
        

        return(
            <main className="container">
 
            <form className="form-group mt-3 p-3 border rounded shadow-lg pa-form"
                onSubmit={this.handleSubmit }
                >
            <div className="form-row">
                <div className="form-group col-md-6">
                    <label htmlFor="inputName">Name</label>
                    <input type="text" 
                            className="form-control" 
                            id="inputName" 
                            placeholder="Name" 
                            value={ this.state.name }
                            onChange={ (e) => this.setState({ name: e.target.value }) } 
                    />
                </div>
                <div className="form-group col-md-6">
                    <label htmlFor="inputEmail">Email</label>
                    <input type="email"
                            className="form-control" 
                            id="inputEmail" 
                            placeholder="Email" 
                            value={ this.state.email } 
                            onChange={ (e) => this.setState({ email: e.target.value }) } 
                    />
                </div>
            </div>
             <div className="form-group">
                <label htmlFor="inputPhone">Phone number</label>
                <input type="text" 
                        className="form-control" 
                        id="inputPhone" 
                        placeholder="+46 470 123 45" 
                        value={ this.state.phone } 
                        onChange={ (e) => this.setState({ phone: e.target.value }) } 
                />
            </div>
            <div className="form-group">
                <label htmlFor="inputAddress">Address</label>
                <input type="text" 
                        className="form-control" 
                        id="inputAddress" 
                        placeholder="1234 Main St" 
                        value={ this.state.address } onChange={ (e) => this.setState({ address: e.target.value }) }  
                />
            </div>
           
            <div className="form-row">
                <div className="form-group col-md-2">
                    <label htmlFor="inputZip">Zip</label>
                    <input type="text"
                            className="form-control" 
                            id="inputZip" 
                            value={ this.state.zipCode } 
                            onChange={ (e) => this.setState({ zipCode: e.target.value }) } 
                    />
                </div>
                <div className="form-group col-md-4">
                    <label htmlFor="inputCity">City</label>
                    <input type="text" 
                            className="form-control" 
                            id="inputCity" 
                            value={ this.state.city } 
                            onChange={ (e) => this.setState({ city: e.target.value }) } 
                    />
                </div>
            </div>
            <div className="form-row">
                 <div className="form-group col-md-4">
                    <label htmlFor="inputState">State</label>
                    <input type="text" 
                            className="form-control" 
                            id="inputState" 
                            value={ this.state.statename } 
                            onChange={ (e) => this.setState({ statename: e.target.value }) } 
                    />
                </div>
                 <div className="form-group col-md-4">
                    <label htmlFor="inputCountry">Country</label>
                    <input type="text" 
                            className="form-control" 
                            id="inputCountry" 
                            placeholder="Country code ex SE" 
                            value={ this.state.country } 
                            onChange={ (e) => this.setState({ country: e.target.value }) }  
                    />
                </div>
            </div>
            
            <div className="form-row">
                <div className="form-group col-md-6">
                    <label htmlFor="cardNumber">Card number</label>
                    <CardNumberElement 
                            className="form-control" 
                            id="cardNumber"
                    /> 
                </div>
            </div> 
            <div className="form row">
                <div className="form-group col-md-3">
                    <label htmlFor="expirationDate">Expiration</label>
                    <CardExpiryElement 
                            className="form-control" 
                            id="expirationDate" 
                    />
                </div>
                <div className="form-group col-md-3">
                    <label htmlFor="cvcNumber">CVC number</label>
                    <CardCVCElement 
                            className="form-control" 
                            id="cvcNumber" 
                    />
                </div>
            </div>  
           <div className="form-group">
                <div className="form-check">
                    <input className="form-check-input" 
                            type="checkbox" 
                            id="gridCheck"
                            onChange={ (e) => this.setState({ saveMe: !this.state.saveMe})}
                    />
                    <label className="form-check-label" 
                            htmlFor="gridCheck">
                                Remember card
                    </label>
                </div>
            </div>
            <button className="btn btn-primary">Pay</button>
            </form>
            </main>
        );
    }
}
export default injectStripe(CheckoutForm);
