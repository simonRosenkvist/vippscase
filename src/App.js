
import React, {Component} from 'react';
//import {Elements, StripeProvider} from 'react-stripe-elements';
//import CheckoutForm from './CheckoutForm.js';
import LoginForm from './LoginForm.js';
import RegisterForm from './RegisterForm.js';
import { StripeProvider, Elements } from 'react-stripe-elements';
import CheckoutForm from './CheckoutForm.js';
import NavigationBar from './NavigationBar.js'
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
  }


  render() {
    return (
      <div>
        <NavigationBar /> 
      </div>
    );
  }
}

export default App;
