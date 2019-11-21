import * as React from 'react';

class OrderSuccess extends React.Component{
    constructor(props){
        super(props);

    }

    componentDidMount(){
        
    }

    render () {
        console.log('ordersuccess is loggedin ', this.props.isLoggedIn)
        if(this.props.isLoggedIn >0){
        
        return (
            <div>
                <p> tack för din order nu du kan göra stuff.. </p>
            </div>
        )
        } else {
            return (
             <div>
                <p> Thank you for your purchase! You can se your order status by logging using the email: { this.props.email } and password: { this.props.password }</p>
            </div>   
            )
        }
    }

} export default OrderSuccess;
