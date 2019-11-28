import React from 'react'
import {BrowserRouter as Router, Switch, Route, Link} from "react-router-dom";
import LoginForm from './LoginForm.js';
import RegisterForm from './RegisterForm.js';
import { StripeProvider, Elements } from 'react-stripe-elements';
import CheckoutForm from './CheckoutForm.js';
import ProductList from './ProductList.js';
import OrderSuccess from './OrderSuccess.js';
import LoginSuccess from './LoginSuccess.js';
import RegisterSuccess from './RegisterSuccess.js';
import axios from 'axios';

class NavigationBar extends React.Component {
    
    constructor(props){
        super(props)
        this.state = {
            amount: '',
            isLoggedin: 0,
            newUserEmail: '',
            generatedPasswd: '',
            receiptUrl: '',
            apiUrl: 'http://localhost:8080/',
            isLive: true
        }
        this.testL = this.testL.bind(this)
    }

    cartHandler(cart){
        this.setState({
            amount: cart
        })
    }
    readCookie() {
        console.log("Cookies:")
        console.log(document.cookie)
        console.log(document.readCookie)

    }

    newUsrCredentials(email, passwd) {
        this.setState({
            newUserEmail: email,
            generatedPasswd: passwd
        })
    }

    changeReceiept(url){
        this.setState({
            receiptUrl: url
        })
    }

    changeLogin(isLoggedin){
        this.setState({
            isLoggedin: isLoggedin
        })
    }

    testL(){
        this.setState({
            isLoggedin: 1
        })
    }

    logout(){
        let parent = this;
        document.cookie = "check = 0"
        axios.get(this.state.apiUrl + 'logout', ({withCredentials: true}))
        .then((response) => {
            //console.log(response)
            if(response.status === 200){
                parent.setState({
                    isLoggedin: 0
                })
            }
        })
    }

    // sets the apiUrl variable before the page is mounted so that the correct url is used.
    UNSAFE_componentWillMount(){
        if(this.state.isLive){
            this.setState({
                apiUrl: 'https://pa-vips-back.herokuapp.com/'
            })
        }
    }

    // Checks if a user is loggedin on when the component was mounted
    componentDidMount() {
        let parent = this;
        axios.get(this.state.apiUrl + 'loggedin', ({ withCredentials: true }))
        .then((response) => {
            if(response.status === 200){
                parent.setState({
                    isLoggedin: response.data
                })
                console.log(this.state.isLoggedin)
            }
        }) 
    }

    

    render() {
        if(this.state.isLoggedin > 0) {
            console.log('isloggedin: ', this.state.isLoggedin)
            return (
                <Router>
                    <div>
                        <nav className="navbar navbar-expand-lg navbar-light pa-nav-bg">
                            <span className="navbar-brand pa-nav-text">VippsCase</span>
                            <button className="navbar-toggler collapsed"
                                    type="button" 
                                    data-toggle="collapse" 
                                    data-target="#navbarSupportedContent" 
                                    aria-controls="navbarSupportedContent" 
                                    aria-expanded="false" 
                                    aria-label="Toggle navigation">
                                <span className="navbar-toggler-icon"></span>
                            </button>
                            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                                <ul className="navbar-nav mr-auto">
                                    <li className="nav-item">
                                        <Link className="nav-link pa-nav-text" to="/">Home</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link pa-nav-text" to="/checkout">Purchase</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link pa-nav-text" to="/history">Order history</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link pa-nav-text" to="/login" onClick={(e)=>{this.logout()}}>Logout</Link>
                                    </li>
                                </ul>
                            </div>
                        </nav>

                        <Switch>
                            <Route path="/history">
                                <ProductList 
                                    apiUrl = { this.state.apiUrl }
                                />
                            </Route>
                            <Route path="/checkout">
                                 <StripeProvider apiKey="pk_test_e8TJTQjsPOOemqjW1YMdF6ok00LFY2p2Ez"> 
                                    <Elements>
                                        <CheckoutForm 
                                            isLoggedin = { this.state.isLoggedin }
                                            apiUrl = { this.state.apiUrl }
                                            onReceipt = {(url) => this.changeReceiept(url)}
                                        /> 
                                    </Elements>
                                 </StripeProvider>
                            </Route>
                            <Route path="/ordersuccess">
                                <OrderSuccess
                                    apiUrl = { this.state.apiUrl }
                                    isLoggedin = { this.state.isLoggedin }
                                    receiptUrl = { this.state.receiptUrl}
                                />
                            </Route>
                             <Route path="/login">
                                <LoginForm 
                                    onLoggedInChange={ (isLoggedin) => this.changeLogin(isLoggedin) }
                                    apiUrl = { this.state.apiUrl }
                                    isLoggedin={this.state.isLoggedin}
                                />
                            </Route>
                            <Route path="/loginsuccess">
                                <LoginSuccess
                                    apiUrl = { this.state.apiUrl }
                                    isLoggedin={this.state.isLoggedin}
                                />
                            </Route>
                            <Route path="/">
                            </Route>
                        </Switch>
                    </div>
                </Router>
            )

        } else {
            console.log('is not logged in')
            return (
                <Router>
                    <div>
                        <nav className="navbar navbar-expand-lg navbar-light pa-nav-bg">
                            <span className="navbar-brand pa-nav-text">VippsCase</span>
                            <button className="navbar-toggler collapsed"
                                    type="button" 
                                    data-toggle="collapse" 
                                    data-target="#navbarSupportedContent" 
                                    aria-controls="navbarSupportedContent" 
                                    aria-expanded="false" 
                                    aria-label="Toggle navigation">
                                <span className="navbar-toggler-icon"></span>
                            </button>
                            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                                <ul className="navbar-nav mr-auto">
                                    <li className="nav-item">
                                        <Link className="nav-link pa-nav-text" to="/">Home</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link pa-nav-text" to="/login">Login</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link pa-nav-text" to="/register">Register</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link pa-nav-text" to="/checkout">Purchase without login</Link>
                                    </li>
                                </ul>
                            </div>
                        </nav>

                        <Switch>
                            <Route path="/login">
                                <LoginForm 
                                    onLoggedInChange={ (isLoggedin) => this.changeLogin(isLoggedin) }
                                    apiUrl = { this.state.apiUrl }
                                    isLoggedin={this.state.isLoggedin}
                                />

                            </Route>
 

                            <Route path="/register">
                                <RegisterForm 
                                    apiUrl = { this.state.apiUrl }
                                />
                            </Route>
                            <Route path="/checkout">
                                 <StripeProvider apiKey="pk_test_e8TJTQjsPOOemqjW1YMdF6ok00LFY2p2Ez"> 
                                    <Elements>
                                        <CheckoutForm 
                                            isLoggedin = { this.state.isLoggedin }
                                            apiUrl = { this.state.apiUrl }
                                            onAnonCheckout = {(email, passwd) => this.newUsrCredentials(email, passwd)}
                                            onReceipt = {(url) => this.changeReceiept(url)}
                                        /> 
                                    </Elements>
                                 </StripeProvider>
                            </Route>
                            <Route path="/registersuccess">
                                <RegisterSuccess
                                    apiUrl = { this.state.apiUrl }
                                    isLoggedin={this.state.isLoggedin}
                                />
                            </Route>
                           
                            <Route path="/ordersuccess" component={OrderSuccess}>
                                <OrderSuccess
                                    apiUrl = { this.state.apiUrl }
                                    isLoggedin={ this.state.isLoggedin }
                                    newUserEmail = { this.state.newUserEmail }
                                    generatedPasswd = { this.state.generatedPasswd }
                                    receiptUrl = { this.state.receiptUrl}
                                />
                            </Route>
                            
                            <Route path="/">
                            </Route>
                        </Switch>
                    </div>
                </Router>
            )
        }
    }

} export default NavigationBar
