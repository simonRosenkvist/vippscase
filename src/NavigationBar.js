import React from 'react'
import {BrowserRouter as Router, Switch, Route, Link} from "react-router-dom";
import LoginForm from './LoginForm.js';
import RegisterForm from './RegisterForm.js';
import { StripeProvider, Elements } from 'react-stripe-elements';
import CheckoutForm from './CheckoutForm.js';

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

    render() {
        
        if(this.state.isLogedin === 1) {
            
        } else {
            return (
                <Router>
                    <div>
                        <nav class="navbar navbar-expand-lg navbar-light bg-light">
                            <a class="navbar-brand" href="#">VipsCase</a>
                            <button class="navbar-toggler collapsed"
                                    type="button" 
                                    data-toggle="collapse" 
                                    data-target="#navbarSupportedContent" 
                                    aria-controls="navbarSupportedContent" 
                                    aria-expanded="false" 
                                    aria-label="Toggle navigation">
                                <span class="navbar-toggler-icon"></span>
                            </button>
                            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                                <ul class="navbar-nav mr-auto">
                                    <li class="nav-item">
                                        <Link class="nav-link" to="/">Home</Link>
                                    </li>
                                    <li class="nav-item">
                                        <Link class="nav-link" to="/login">Login</Link>
                                    </li>
                                    <li class="nav-item">
                                        <Link class="nav-link" to="/register">Register</Link>
                                    </li>
                                    <li class="nav-item">
                                        <Link class="nav-link" to="/checkout">Purchase without login</Link>
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
