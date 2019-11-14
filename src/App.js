
import React, {Component} from 'react';
//import {Elements} from 'react-stripe-elements';
//import CheckoutForm from './CheckoutForm.js';
import LoginForm from './LoginForm.js';
import RegisterForm from './RegisterForm.js';
import ProductList from './ProductList';

class App extends Component {
  constructor(props) {
    super(props);
  }


  render() {
    return (
      <div>
        <RegisterForm />
        <br/>
        <LoginForm />
        <br/>
        <ProductList />
      </div>
    );
  }
}

export default App;
