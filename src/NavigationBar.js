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
            isLoggedin: 0
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

    logout(){
        document.cookie = "check = 0"
        axios.get("http://localhost:8080/logout", ({withCredentials: true}))
        .then((response) => {
            console.log(response)

        })
    }

    render() {
        
        if(this.state.isLogedin === 0) {

            
        } else {
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
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/history">Order history</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/login" onClick={(e)=>{this.logout()}}>Logout</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/home" onClick={(e)=>{this.readCookie()}}>Read Cookies</Link>
                                    </li>
                                </ul>
                            </div>
                        </nav>

                        <Switch>
                            <Route path="/login">
                                <LoginForm />
                                
                            </Route>
                            <Route path="/register">
                                <RegisterForm />
                            </Route>
                            <Route path="/history">
                                <ProductList />
                            </Route>
                            <Route path="/checkout">
                                 <StripeProvider apiKey="pk_test_e8TJTQjsPOOemqjW1YMdF6ok00LFY2p2Ez"> 
                                    <Elements>
                                        <CheckoutForm /> 
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
