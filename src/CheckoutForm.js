
import React, {Component} from 'react';
import {CardElement, injectStripe} from 'react-stripe-elements';

class CheckoutForm extends Component {
	constructor(props) {
		super(props);
	  	this.state = {complete: false};
		this.submit = this.submit.bind(this);
	}

	async submit(ev) {
	  	let {token} = await this.props.stripe.createToken({name: "Name"});
	  	/*let response = await fetch("localhost:8080/order", {
		    method: "POST",
		    headers: {"Content-Type": "text/plain"},
		    body: token.id
	  	});*/

  //if (response.ok) this.setState({complete: true});
  	let aaa = this.props.stripe.createToken({name: "Name"});

  	setInterval(() => {console.log({aaa});}, 1000);
}

	render() {
		if (this.state.complete) return <h1>Purchase Complete</h1>;
			return (
				<div className="checkout">
					<p>Would you like some drugs?</p>
					<CardElement />
					<button onClick={this.submit}>Buy</button>
				</div>
			);
	}
}

//testar

export default injectStripe(CheckoutForm);