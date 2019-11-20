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
            apiResponseCode: 0,
            stripeCustomerId: '',
            userId: 0

        }
    }
    
    componentDidMount() {
        console.log(this.state.live)
        let parent = this;
        //axios.get('http://localhost:8080/stripe/customer', ({withCredentials: true}))
        axios.get(this.props.apiUrl + 'stripe/customer', ({ withCredentials: true }))
        .then((response) => {
            console.log('checkout apiResponseCode on load', parent.state.apiResponseCode)
            parent.setState({
                    apiResponseCode: response.status,
                    stripeCustomerId: response.data
                })
            /*if(response.status === 200){
                parent.setState({
                    apiResponseCode: response.status,
                    stripeCustomerId: response.data
                })
                console.log('checkout apiResponseCode after setstate: ', parent.state.apiResponseCode)
                console.log('checkout stripeCustomerId after setstate', parent.state.stripeCustomerId)
            }*/
            //console.log('checkout response status: ', response.status)
        })

        //axios.get('http://localhost:8080/loggedin', ({withCredentials: true}))
        axios.get(this.props.apiUrl + 'loggedin', ({ withCredentials: true }))
        .then((response)  => {
            console.log(response)
            parent.setState({
                userId: response.data
            })
        })
        console.log('is logged in nu userid?: ', this.props.isLoggedin)
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

    // Customer that's not loggeding purchase
    handleNewCustomerPayment = async (e) => {
         e.preventDefault();
            try {
                const parent = this;
                let amount = this.state.amount;
                let idempotencyThing = this.state.idempotency;
                let saveCard = this.state.saveMe;
                //await fetch(this.state.stripeLocal, {
                await fetch(this.props.apiUrl + 'stripe/intent', {
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
                        }
                    }) // The return..
                })
                .then(function (result) {

                    parent.setState({
                        generatedPasswd: parent.generatePassword()
                    })
                    if(result.error){
                        console.log('fail with: ', result.error.message) // catches the first vailid error message.. ex email then country code and at last any card errors like processing error and funds errors
                        parent.setState({
                            stripeError: result.error.message
                        })
                    } else {
                        if(result.paymentIntent.status === 'succeeded')
                        {
                            console.log('payment succeded now add the order...')
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
                            
                            //axios.post('http://localhost:8080/register/user', userData)
                            axios.post(parent.props.apiUrl + 'register/user', userData)
                            .then((regResponse) => {
                                console.log(regResponse)
                                if(regResponse.status === 201){
                                    console.log('user created with id: ', regResponse.data )
                                    let orderData = {
                                        customer_id: regResponse.data,
                                        product_id: parent.state.productIds,
                                        status: 'pending'
                                    }
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
                                        status: 'payment comfirmed'
                                    }
                                    //axios.post('http://localhost:8080/order', orderData)
                                    axios.post(parent.props.apiUrl + 'order', orderData, ({ withCredentials: true })) //med credentials true?
                                    .then((orderResponse) => {
                                        console.log('order response: ', orderResponse)
                                        if(orderResponse.status === 201){
                                            console.log('order successfully placed for user:' + orderData.customer_id + ' with passwd: ' + parent.state.generatedPasswd)
                                            console.log('now ready to redirect')

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

    // Customer thats loggedin but has not saved a card
    handleLoggedInCustomerPayment = async (e) => {
         e.preventDefault();
            try {
                const parent = this;
                let amount = this.state.amount;
                let idempotencyThing = this.state.idempotency;
                let saveCard = this.state.saveMe;
                let userId = this.state.userId.toString();
                //await fetch(this.state.stripeLocal, {
                await fetch(this.props.apiUrl + 'stripe/intent', {
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json'
                    },
                    body: JSON.stringify({ amount, idempotencyThing, saveCard, userId })
                })
                .then(function (response) {
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
                    parent.setState({
                        generatedPasswd: parent.generatePassword()
                    })
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
                            

                            let orderData = {
                                    customer_id: parent.state.userId, //regResponse.data, // hur komma åt vårt customer id dock??
                                    product_id: parent.state.productIds,
                                    status: 'pending'
                                }
                            console.log('orderData: ', orderData)
                            //axios.post('http://localhost:8080/order', orderData)
                            axios.post(parent.props.apiUrl + 'order', orderData)
                            .then((response) => {
                                
                                if(response.status === 201){
                                    console.log('order successfully placed for user: ' + orderData.customer_id)
                                    console.log('Now redirect to successpage')
                                } else {
                                    console.log('something whent wrong while placing order in db')
                                }
                            })
                        }
                    }
                })
                } catch (error) {
                
                }        
    }

    // Customer thats loggedin and has a card saved stripeCustomer
    handleSavedCardPayment = async (e) => {
         e.preventDefault();
            try {
                const parent = this;
                let amount = this.state.amount;
                let idempotencyThing = this.state.idempotency;
                let saveCard = this.state.saveMe;
                let stripeCustomer = this.state.stripeCustomerId;
                //await fetch('http://localhost:8080/stripe/savedcustomer', {
                await fetch(this.props.apiUrl + 'stripe/savedcustomer', {
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json'
                    },
                    body: JSON.stringify({ amount, idempotencyThing, stripeCustomer })
                })
                .then(function (response) {
                    console.log('response: ', response)
                    return response.json();
                })
                .then(function (responseJson){
                    let clientSecret = responseJson.client_secret;
                    console.log('json response: ',responseJson.status)
                    if(responseJson.status === 'succeeded'){
                        console.log('payment successfull now place the order in the database')
                        let orderData = {
                            customer_id: parent.state.userId, //regResponse.data hur komma åt vårt customer id Cookie??
                            product_id: parent.state.productIds,
                            status: 'pending'
                            }

                        console.log('orderData: ', orderData)
                        //axios.post('http://localhost:8080/order', orderData)
                        axios.post(parent.props.apiUrl + 'order', orderData)
                        .then((response) => {
                                
                            if(response.status === 201){
                                console.log('order successfully placed for user: ' + orderData.customer_id)
                                console.log('Now redirect to successpage')
                            } else {
                                console.log('something whent wrong while placing order in db')
                            }
                        })

                    }
                })
                /*.then(function (result) {
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
                            //axios.post('https://pa-vips-back.herokuapp.com/register/user', userData)
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
                                    //axios.post('https://pa-vips-back.herokuapp.com/order', orderData, ({ withCredentials: true })) //med credentials true?
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
                })*/
                } catch (error) {
                
                }        
    }



    handleSubmit = async (e) => {
        e.preventDefault();
            try {
                const parent = this;
                let amount = this.state.amount;
                let idempotencyThing = this.state.idempotency;
                let saveCard = this.state.saveMe;
                await fetch(this.state.stripeLocal, {
                //await fetch(this.state.stripeLive, {
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
                            //axios.post('https://pa-vips-back.herokuapp.com/register/user', userData)
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
                                    //axios.post('https://pa-vips-back.herokuapp.com/order', orderData, ({ withCredentials: true })) //med credentials true?
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

    getCustomer(){
        const parent = this;
        let tmp = ''
         axios.get('http://localhost:8080/stripe/customer', ({withCredentials: true}))
            //axios.get('https://pa-vips-back.herokuapp.com/stripe/customer', ({withCredentials: true}))
            .then((response) => {
            
                console.log('response: ', response)
                if(response.status === 200 && response.data.includes('cus')){
                    // saved card stuff
                    console.log('customer: ', response.data)
                    //this.setState({ x: response.data })
                    parent.tmp = response.status
                    console.log('tmp i then: ', parent.tmp)
                    //console.log('response status set : ', parent.state.x)
                    /*return (
                        <main className="container">
 
                            <form className="form-group mt-3 p-3 border rounded shadow-lg pa-form"
                                onSubmit={this.handleSubmit }
                            >
                                <button className="btn btn-primary">Pay</button>
                                <span style={{color:'red'}}>{ this.state.stripeError }</span>
                            </form>
                            <RandomItems 
                                onAmountChanged={ (amount, productIds) => this.handleAmount(amount, productIds) }
                            />
                        </main> 
                    )*/
                }

            })
        console.log('tmp_ ', tmp)

        return tmp

    }

    render() {

        //this.getCustomer()
        if(this.props.isLoggedin === 1){
            console.log('props is loggedin: ', this.props.isLoggedin)
            console.log('checkout response code state: ', this.state.apiResponseCode)
            console.log('checkout stripeCustomerId state: ', this.state.stripeCustomerId)
            //let tmp2 = this.getCustomer();
            if(this.state.apiResponseCode === 200 && this.state.stripeCustomerId.includes('cus_')) {
                return (

                    <main className="container">
 
                        <form className="form-group mt-3 p-3 border rounded shadow-lg pa-form"
                            onSubmit={ this.handleSavedCardPayment  }
                        >
                            <button className="btn btn-primary">Pay</button>
                            <span style={{color:'red'}}>{ this.state.stripeError }</span>
                        </form>
                            <RandomItems 
                                onAmountChanged={ (amount, productIds) => this.handleAmount(amount, productIds) }
                                apiUrl = { this.props.apiUrl }
                            />
                    </main> 
                )
            } else if (this.state.apiResponseCode === 200){
                return (

                    <main className="container">
 
                            <form className="form-group mt-3 p-3 border rounded shadow-lg pa-form"
                                onSubmit={ this.handleLoggedInCustomerPayment }
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
                apiUrl = { this.props.apiUrl }
            />

            </main>
                )
            } // else if closes
           
        } else if(this.state.apiResponseCode === 200){ // close if loggedin and do a else
            return(
                <main className="container">
 
                    <form className="form-group mt-3 p-3 border rounded shadow-lg pa-form"
                        onSubmit={ this.handleNewCustomerPayment }
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
                        apiUrl = { this.props.apiUrl }
                    />

                </main>
            )
        }

        return(
            <div></div>
        )
    }
}
export default injectStripe(CheckoutForm);
