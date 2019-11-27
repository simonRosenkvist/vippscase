import * as React from 'react';
import { Redirect } from 'react-router-dom';
import {
    injectStripe,
    CardNumberElement,
    CardExpiryElement,
    CardCVCElement,
        } from 'react-stripe-elements';
import axios from 'axios';
import RandomItems from './RandomItems'

const uuidv4 = require('uuid/v4');
const ButtonOrder = ({ children, ...rest}) => {
    return <button className="btn btn-primary pa-btn"{...rest}>{children}</button>
}

const ButtonSpinner = () =>(
    <span className="card-text">
        <span className="spinner-border spinner-border-sm pa-spinner" 
            role="status" 
            aria-hidden="true">
        </span> 
           Processing
    </span>
)

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
            zipError: "",
            amount: "",
            prettyAmount: "",
            saveMe: false,
            stripeError: "",
            productIds: [],
            generatedPasswd: '',
            idempotency: uuidv4(),
            apiResponseCode: 0,
            stripeCustomerId: '',
            receiptIntent: '',
            userId: 0,
            proccessingPayment: false,
            rdyToMove: false

        }
    }
    
    componentDidMount() {
        let parent = this;
        axios.get(this.props.apiUrl + 'stripe/customer', ({ withCredentials: true }))
        .then((response) => {
            parent.setState({
                    apiResponseCode: response.status,
                    stripeCustomerId: response.data
                })
        })

        axios.get(this.props.apiUrl + 'loggedin', ({ withCredentials: true }))
        .then((response)  => {
            parent.setState({
                userId: response.data
            })
        })
    }
    
    handleAmount(amount, prettyAmount, productIds) {
        this.setState({
            amount: amount,
            prettyAmount: prettyAmount,
            productIds: productIds
        })
    }

    generatePassword(){
        let length = 8
        let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890'

        var passwd = ''

        for(let i = 0; i < length; i++){
            passwd += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        //console.log('random pass: ', passwd)
        return passwd
    }

    // Customer that's not loggeding purchase
    handleNewCustomerPayment = async (e) => {
        e.preventDefault();
        this.setState({
            proccessingPayment: true
        })
            try {
                const parent = this;
                let amount = this.state.amount;
                let idempotencyThing = this.state.idempotency;
                //await fetch(this.state.stripeLocal, {
                await fetch(this.props.apiUrl + 'stripe/intent', {
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json'
                    },
                    body: JSON.stringify({ amount, idempotencyThing })
                })
                .then(function (response) {
                    console.log(response)
                    return response.json();
                })
                .then(function (responseJson){
                    let clientSecret = responseJson.client_secret;
                    parent.setState({
                        receiptIntent: responseJson.id
                    })
                    console.log('respJ: ',responseJson)
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
                        } //can we do receipt email stuff here
                    }) // The return..
                })
                .then(function (result) {
                    console.log()
                    parent.setState({
                        generatedPasswd: parent.generatePassword()
                    })
                    if(result.error){
                        //console.log('fail with: ', result.error.message) // catches the first vailid error message.. ex email then country code and at last any card errors like processing error and funds errors
                        parent.setState({
                            stripeError: result.error.message,
                            proccessingPayment: false
                        })
                    } else {
                        if(result.paymentIntent.status === 'succeeded')
                        {
                            console.log('where is the receipt?: ',result) // inte här
                            // set the receipt now.
                            //parent.props.onReceipt('kvitto url här')

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
                            
                            axios.post(parent.props.apiUrl + 'register/user', userData)
                            .then((regResponse) => {
                                if(regResponse.status === 201){
                                    parent.props.onAnonCheckout(parent.state.email, parent.state.generatedPasswd) // <------- -HERE IS NEW SHIT
                                } else {
                                    //console.log('Something went horribly wrong.. :\'( ')
                                }
                                return regResponse
                            })
                            .then((regResponse) => {
                                if(regResponse.status === 201){
                                    
                                    //get teh receipt
                                    let receipt = {
                                        intent: parent.state.receiptIntent
                                    }
                                    axios.post(parent.props.apiUrl + 'stripe/receipt', receipt)
                                    .then((receiptResponse) => {
                                        if(receiptResponse.status === 200){
                                            parent.props.onReceipt(receiptResponse.data.url)

                                            let orderData = {
                                            customer_id: regResponse.data,
                                            product_id: parent.state.productIds,
                                            status: 'payment confirmed'
                                            }
                                            axios.post(parent.props.apiUrl + 'order', orderData, ({ withCredentials: true })) 
                                            .then((orderResponse) => {
                                                if(orderResponse.status === 201){

                                                    parent.setState({
                                                        rdyToMove: true
                                                    })
                                                }
                                            })
         
                                        }
                                    })

                                   
                                } else {
                                    console.log('Something went horribly wrong.. :\'( ')
                                }
                            })
                            .catch((error) => {
                                if (error.response) {
                                    if(error.response.status === 401){
                                        parent.setState({
                                            zipError: "Zip must be numbers.",
                                            proccessingPayment: false
                                        })
                                    }
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
        this.setState({
            proccessingPayment: true
        })  
        try {
                const parent = this;
                let amount = this.state.amount;
                let idempotencyThing = this.state.idempotency;
                let saveCard = this.state.saveMe;
                let userId = this.state.userId.toString();
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
                    parent.setState({
                        receiptIntent: responseJson.id
                    })
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
                    }) 
                })
                .then(function (result) {
                    if(result.error){
                        console.log('fail with: ', result.error.message) // catches the first vailid error message.. ex email then country code and at last any card errors like processing error and funds errors
                        parent.setState({
                            stripeError: result.error.message,
                            proccessingPayment: false
                        })
                    } else {
                        if(result.paymentIntent.status === 'succeeded')
                        {
                            // webhook will save the customer.
                            // now create a new user and then place the order and show the order successfull page..
                            let receipt = {
                                intent: parent.state.receiptIntent
                            }
                            axios.post(parent.props.apiUrl + 'stripe/receipt', receipt)
                            .then((receiptResponse) => {
                                if(receiptResponse.status === 200){
                                    parent.props.onReceipt(receiptResponse.data.url)
                                    let orderData = {
                                        customer_id: parent.state.userId, 
                                        product_id: parent.state.productIds,
                                        status: 'payment confirmed'
                                        }
                            
                                        axios.post(parent.props.apiUrl + 'order', orderData)
                                        .then((response) => {
                                            if(response.status === 201){
                                                parent.setState({
                                                    rdyToMove: true
                                                })
                                            } else {
                                                //console.log('something whent wrong while placing order in db')
                                            }
                                        })
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
        this.setState({
            proccessingPayment: true
        })    
        try {
                const parent = this;
                let amount = this.state.amount;
                let idempotencyThing = this.state.idempotency;
                let stripeCustomer = this.state.stripeCustomerId;
                await fetch(this.props.apiUrl + 'stripe/savedcustomer', {
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json'
                    },
                    body: JSON.stringify({ amount, idempotencyThing, stripeCustomer })
                })
                .then(function (response) {
                    return response.json();
                })
                .then(function (responseJson){
                    
                    if(responseJson.status === 'succeeded'){
                        parent.setState({
                            receiptIntent: responseJson.id
                        })
                        let receipt = {
                            intent: parent.state.receiptIntent
                        }
                        axios.post(parent.props.apiUrl + 'stripe/receipt', receipt)
                        .then((receiptResponse) => {
                            if(receiptResponse.status === 200){
                                console.log('kvitto: ', receiptResponse.data.url)
                                parent.props.onReceipt(receiptResponse.data.url)
                                let orderData = {
                                    customer_id: parent.state.userId, 
                                    product_id: parent.state.productIds,
                                    status: 'payment confirmed'
                                }
                       
                                axios.post(parent.props.apiUrl + 'order', orderData)
                                .then((response) => {
                                
                                    if(response.status === 201){
                                        parent.setState({
                                            rdyToMove: true
                                        })
                                    } else {
                                        //console.log('something whent wrong while placing order in db')
                                    }
                                })
                            }
                        })
                    }
                })
        } catch (error) {
                
        }        
    }
    
   
    render() {

        if(this.state.rdyToMove){
                return <Redirect to={{ 
                                pathname: '/ordersuccess',
                                state: { 
                                        isLoggedin: this.props.isLoggedin, 
                                        email: this.state.email,
                                        password: this.state.generatePassword
                                        }
                                }} 
                        />
        }
        if(this.props.isLoggedin > 0){
            if(this.state.apiResponseCode === 200 && this.state.stripeCustomerId.includes('cus_')) {
                return (
                    <main className="container-fluid container-checkout ">
                        <div className="row">
                            <div className="col-md-6">
                                <form className="form-group mt-3 p-3 border rounded shadow-lg pa-form"
                                    onSubmit={ this.handleSavedCardPayment  }
                                >
                                    <h6 className="class-text">Total amount: { this.state.prettyAmount } sek</h6>
                                    <ButtonOrder className="btn btn-primary pa-btn" type="submit" disabled={ this.state.proccessingPayment }>
                                        { this.state.proccessingPayment ? <ButtonSpinner /> : "Purchase" }
                                    </ButtonOrder>
                                    <div><span style={{color:'red'}}>{ this.state.stripeError }</span></div>
                                </form>
                            </div>

                            <div className="col-md-4">
                                <RandomItems 
                                    onAmountChanged={ (amount, prettyAmount, productIds) => this.handleAmount(amount, prettyAmount, productIds) }
                                    apiUrl = { this.props.apiUrl }
                                />
                            </div>
                        </div>
                    </main> 
                )
            } else if (this.state.apiResponseCode === 200){
                return (
                    <main className="container-fluid container-checkout ">
                        <div className="row">
                            <div className="col-md-6">
 
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
                                                    required
                                                />
                                        </div>
                                        <div className="form-group col-md-6">
                                            <label htmlFor="inputEmail">E-mail</label>
                                            <input type="email"
                                                className="form-control" 
                                                id="inputEmail" 
                                                placeholder="E-mail" 
                                                value={ this.state.email } 
                                                onChange={ (e) => this.setState({ email: e.target.value }) } 
                                                required
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
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="inputAddress">Address</label>
                                        <input type="text" 
                                            className="form-control" 
                                            id="inputAddress" 
                                            placeholder="1234 Main St" 
                                            value={ this.state.address } onChange={ (e) => this.setState({ address: e.target.value }) }  
                                            required
                                        />
                                    </div>
           
                                    <div className="form-row">
                                        <div className="form-group col-md-2">
                                            <label htmlFor="inputZip">Zip</label>
                                            <input type="integer" step="1" pattern="\d+" min="2"
                                                className="form-control" 
                                                id="inputZip" 
                                                value={ this.state.zipCode } 
                                                onChange={ (e) => this.setState({ zipCode: e.target.value }) } 
                                                required
                                            />
                                        </div>
                                        <div className="form-group col-md-4">
                                            <label htmlFor="inputCity">City</label>
                                            <input type="text" 
                                                className="form-control" 
                                                id="inputCity" 
                                                value={ this.state.city } 
                                                onChange={ (e) => this.setState({ city: e.target.value }) } 
                                                required
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
                                                required
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
                                                required
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
                                    <h6 className="class-text">Total amount: { this.state.prettyAmount } sek</h6>
                                    <ButtonOrder className="btn btn-primary pa-btn" type="submit" disabled={ this.state.proccessingPayment }>
                                        { this.state.proccessingPayment ? <ButtonSpinner /> : "Purchase" }
                                    </ButtonOrder>
                                    <div><span style={{color:'red'}}>{ this.state.stripeError }</span></div>
                                </form>
                            </div>
                            <div className="col-md-4">
                                <RandomItems 
                                    onAmountChanged={ (amount, prettyAmount, productIds) => this.handleAmount(amount, prettyAmount, productIds) }
                                    apiUrl = { this.props.apiUrl }
                                />
                            </div>
                        </div>
                    </main>
                )
            }            
        } else if(this.state.apiResponseCode === 200){ 
            return(
                <main className="container-fluid container-checkout ">
                    <div className="row">
 
                    <div className="col-md-6">
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
                                        required
                                    />
                                </div>
                                <div className="form-group col-md-6">
                                    <label htmlFor="inputEmail">E-mail</label>
                                    <input type="email"
                                        className="form-control" 
                                        id="inputEmail" 
                                        placeholder="E-mail" 
                                        value={ this.state.email } 
                                        onChange={ (e) => this.setState({ email: e.target.value }) } 
                                        required
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
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="inputAddress">Address</label>
                                <input type="text" 
                                    className="form-control" 
                                    id="inputAddress" 
                                    placeholder="1234 Main St" 
                                    value={ this.state.address } onChange={ (e) => this.setState({ address: e.target.value }) }  
                                    required
                                />
                            </div>
           
                            <div className="form-row">
                                <div className="form-group col-md-2">
                                    <label htmlFor="inputZip">Zip</label>
                                    <input type="integer" step="1" pattern="\d+" min="2"
                                        className="form-control" 
                                        id="inputZip" 
                                        value={ this.state.zipCode } 
                                        onChange={ (e) => this.setState({ zipCode: e.target.value }) } 
                                        required
                                    />
                                </div>
                                <div className="form-group col-md-4">
                                    <label htmlFor="inputCity">City</label>
                                    <input type="text" 
                                        className="form-control" 
                                        id="inputCity" 
                                        value={ this.state.city } 
                                        onChange={ (e) => this.setState({ city: e.target.value }) } 
                                        required
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
                                        required
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
                                        required
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
           
                            <h6 className="class-text">Total amount: { this.state.prettyAmount } sek</h6>
                            <ButtonOrder className="btn btn-primary pa-btn" type="submit" disabled={ this.state.proccessingPayment }>
                                { this.state.proccessingPayment ? <ButtonSpinner /> : "Purchase" }
                            </ButtonOrder>
                            <div>
                            <span style={{color:'red'}}>{ this.state.stripeError } {this.state.zipError}</span>
                            </div>
                        </form>
                    </div>
                    <div className="col-md-4">
                        <RandomItems 
                            onAmountChanged={ (amount, prettyAmount, productIds) => this.handleAmount(amount, prettyAmount, productIds) }
                            apiUrl = { this.props.apiUrl }
                        />
                    </div>

                </div>
            </main>
            )
        }

        return(
            <div></div>
        )
    }
}
export default injectStripe(CheckoutForm);
