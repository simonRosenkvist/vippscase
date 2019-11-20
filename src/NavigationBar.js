import React from 'react'
import {BrowserRouter as Router, Switch, Route, Link} from "react-router-dom";
import LoginForm from './LoginForm.js';
import RegisterForm from './RegisterForm.js';
import { StripeProvider, Elements } from 'react-stripe-elements';
import CheckoutForm from './CheckoutForm.js';
import ProductList from './ProductList';
import axios from 'axios';

class NavigationBar extends React.Component {
    
    constructor(props){
        super(props)
        this.state = {
            amount: '',
            isLoggedin: 0,
            liveApi: 'https://pa-back-herokuapp.com/',
            localApi: 'http://localhost:8080/',
            apiUrl: 'http://localhost:8080/',
            isLive: true
        }
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

    changeLogin(isLoggedin){
        this.setState({
            isLoggedin: isLoggedin
        })
    }

    logout(){
        let parent = this;
        document.cookie = "check = 0"
        //axios.get("http://localhost:8080/logout", ({withCredentials: true}))
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
        /*if(this.state.isLive){
            this.setState({
                apiUrl: 'https://pa-vips-back.herokuapp.com/'
            })
        }*/
        console.log('navbar apiUrl: ', this.state.apiUrl)
        let parent = this;
        //axios.get(this.state.localApi+'loggedin', ({withCredentials: true}))
        axios.get(this.state.apiUrl + 'loggedin', ({ withCredentials: true }))
        .then((response) => {
            //console.log(parent.state.localApi)
            if(response.status === 200){
                parent.setState({
                    isLogedin: response.data
                })
                //console.log('isLoggedin: ', parent.state.isLoggedin)
            }
            //console.log('response status: ', response.status)
        }) 
    }

    render() { 
        if(this.state.isLoggedin > 0) {
            //console.log('is now logged in...')
            return (
                <Router>
                    <div>
                        <nav className="navbar navbar-expand-lg navbar-light bg-light">
                            <span className="navbar-brand">VipsCase</span>
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
                                        <Link className="nav-link" to="/">Home</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/checkout">Purchase</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/history">Order history</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/login" onClick={(e)=>{this.logout()}}>Logout</Link>
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
                                        /> 
                                    </Elements>
                                 </StripeProvider>
                            </Route>
                            <Route path="/login">
                                <LoginForm 
                                    onLoggedInChange={ (isLoggedin) => this.changeLogin(isLoggedin) }
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
                        <nav className="navbar navbar-expand-lg navbar-light bg-light">
                            <span className="navbar-brand">VipsCase</span>
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
                                        <Link className="nav-link" to="/">Home</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/login">Login</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/register">Register</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/checkout">Purchase without login</Link>
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
                                        /> 
                                    </Elements>
                                 </StripeProvider>
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
