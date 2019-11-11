
import React, {Component} from 'react';
import {Elements, StripeProvider} from 'react-stripe-elements';
import CheckoutForm from './CheckoutForm.js';
import LoginForm from './LoginForm.js';

class App extends Component {

  render() {
    return (
      <div>
        <LoginForm />
        <StripeProvider apiKey=" pk_test_AtSP8PNrjvdY0irSoVFsaH4P00GrVSyWv8">
          <div className="example">
            <h1>React Stripe Elements Example</h1>
            <Elements>
              <CheckoutForm />
            </Elements>
          </div>
        </StripeProvider>
      </div>
    );
  }
}

export default App;
