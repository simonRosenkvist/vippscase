import * as React from 'react';

class OrderSuccess extends React.Component{
    constructor(props){
        super(props);

    }

    componentDidMount(){
        
    }

    render () {
        console.log('ordersuccess is loggedin ', this.props.isLoggedin)
        //console.log('Thank you for your purchase! You can se your order status by logging using the email:' + this.props.location.state.email + ' and password: ' + this.props.location.state.password)
        if(this.props.isLoggedIn > 0){
        
        return (
            <div className="container-fluid center">
                    <div className="card pa-card mt-3 border rounded shadow-lg">
                        <div className="card-body">
                            <h5 className="card-title">Thank you for your order!</h5>
                            <p className="card-text">You find the order details under Order history. <br />You can find your receipt by following this link: "stripe url"</p>
                        </div>
                    </div>
                </div>
            )
        } else {
            return (
                <div className="container-fluid center">
                    <div className="card pa-card mt-3 border rounded shadow-lg">
                        <div className="card-body">
                            <h5 className="card-title">Thank you for your order!</h5>
                            <p className="card-text">A account has been created using the details you provided during checkout. <br />
                                You can now log in and view your order detail's in Order history using the email you provided and the password: "GENERATED PASS HERE" <br />
                                You can find your receipt by following this link: "STRIPE URL"</p>
                        </div>
                    </div>
                </div>
            )
        }
    }

} export default OrderSuccess;
