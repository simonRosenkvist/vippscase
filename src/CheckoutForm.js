import * as React from 'react';
import { Redirect } from 'react-router-dom';
import {
    injectStripe,
//    CardElement,
    CardNumberElement,
    CardExpiryElement,
    CardCVCElement,
        } from 'react-stripe-elements';
import axios from 'axios';
import RandomItems from './RandomItems'

const uuidv4 = require('uuid/v4');
class CheckoutForm extends React.Component {
    
    constructor(props){
        super(props);
        this.state = {
            stripeLocal: "http://localhost:8080/stripe/intent",
            stripeLive: "https://pa-vips-back.herokuapp.com/stripe/intent",
            orderLocal: "http://localhost:8080/order",
            orderLive: "https://pa-vips-back.herokuapp.com/order",
            name: "",
            email: "",
            phone: "",
            address: "",
            city: "",
            statename: "",
            country: "",
            zipCode: "",
            amount: "",
            saveMe: false,
            stripeError: "",
            productIds: [],
            generatedPasswd: '',
            idempotency: uuidv4(),
            x: 1
        }
    }
    
    handleAmount(amount, productIds) {
        this.setState({
            amount: amount,
            productIds: productIds
        })
        console.log('amount to pay: ' + this.state.amount + '\nproducts in cart: ' + productIds)
    }

    generatePassword(){
        let length = 8
        let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890'

        var passwd = ''

        for(let i = 0; i < length; i++){
            passwd += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        console.log('random pass: ', passwd)
        return passwd
    }

    handleSubmit = async (e) => {
        e.preventDefault();

        // if loged in and has a previous purchase render other form... 

        // if saveme box is checked (saveMe = true) first create the customer and then do the charge else just charge the card with the details form
        
            console.log('save my card and take my money')
            //console.log(this.generatePassword())
            try {
                // first create the payment intent to get the stripe client_secret 
       
                //this shit works.... denna ska användas
                const parent = this;
                let amount = this.state.amount;
                console.log("simon amount: " + amount)
                let idempotencyThing = this.state.idempotency;
                let saveCard = this.state.saveMe;
            // this.state.stripeLive
                await fetch(this.state.stripeLocal, {
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json'
                    },
                    body: JSON.stringify({ amount, idempotencyThing, saveCard })
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
                    }) // The return..
                })
                .then(function (result) {
                    console.log("result then")
                    console.log('paymnetintent: ', result)

                    parent.setState({
                        generatedPasswd: parent.generatePassword()
                    })
                    //return result.json()
                    //
                    if(result.error){
                        console.log('fail with: ', result.error.message) // catches the first vailid error message.. ex email then country code and at last any card errors like processing error and funds errors
                        parent.setState({
                            stripeError: result.error.message
                        })
                    } else {
                        if(result.paymentIntent.status === 'succeeded')
                        {
                            console.log('payment succeded now save the customer and add the order...')
                            // webhook will save the customer.
                            // now create a new user and then place the order and show the order successfull page..
                            let userData = {
	                            "name": parent.state.name,
	                            "email": parent.state.email,
                                "password": parent.state.generatedPasswd,
	                            "lastname": parent.state.lastname,
	                            "street": parent.state.address,
	                            "postcode": parent.state.zipCode,
	                            "city": parent.state.city,
                            }

                            console.log('POST user: ', userData)
                            //console.log('POST order: ', orderData)
                            axios.post('http://localhost:8080/register/user', userData)
                            .then((regResponse) => {
                                console.log(regResponse)
                                if(regResponse.status === 201){
                                    console.log('user created with id: ', regResponse.data )
                                    let orderData = {
                                        customer_id: regResponse.data,
                                        product_id: parent.state.productIds,
                                        status: 'pending'
                                    }
                                    console.log('orderData: ', orderData)
                                } else {
                                    console.log('Something went horribly wrong.. :\'( ')
                                }
                                return regResponse
                            })
                            .then((regResponse) => {
                                console.log('place order for id: ', regResponse.data)
                                if(regResponse.status === 201){

                                    let orderData = {
                                        customer_id: regResponse.data,
                                        product_id: parent.state.productIds,
                                        status: 'pending'
                                    }
                                    console.log('order data igen: ', orderData)
                                       axios.post('http://localhost:8080/order', orderData)
                                    .then((orderResponse) => {
                                        console.log('order response: ', orderResponse)
                                        if(orderResponse.status === 201){
                                            console.log('order successfully placed for user:' + orderData.customer_id + ' with passwd: ' + parent.state.generatedPasswd)

                                            return <Redirect to='/OrderSuccess' />
                                        }
                                    })

                                } else {
                                    console.log('Something went horribly wrong.. :\'( ')
                                }
                            })
                        }
                    }
                })
                } catch (error) {
                
                } 
            }

    render() {

        if(this.state.x === 0){

            // do axios to check for stripe id in db
            axios.get('http://localhost:8080/stipecust')
            .then((response) => {
                if(response.data.includes('cus')){
                    // saved card stuff
                } else {
                    // customer without saved card
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
                                <input type="integer"
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
                    <span style={{color:'red'}}>{ this.state.stripeError }</span>
            </form>
            <RandomItems 
                onAmountChanged={ (amount, productIds) => this.handleAmount(amount, productIds) }
            />

            </main> 
                    )
                }
            });
        } else {
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
                    <input type="integer"
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
           
           <button className="btn btn-primary">Pay</button>
            <span style={{color:'red'}}>{ this.state.stripeError }</span>
            </form>
            <RandomItems 
                onAmountChanged={ (amount, productIds) => this.handleAmount(amount, productIds) }
            />

            </main>


        );

        }
    }
}
export default injectStripe(CheckoutForm);
