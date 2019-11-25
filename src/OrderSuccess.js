import * as React from 'react';

class OrderSuccess extends React.Component{
    

    componentDidMount(){
        
    }

    render () {
        if(this.props.isLoggedin > 0){
        return (
            <div className="container-fluid center">
                    <div className="card pa-card mt-3 border rounded shadow-lg">
                        <div className="card-body">
                            <h5 className="card-title">Thank you for your order!</h5>
                            <p className="card-text">You find the order details under Order history. <br /> 
                                Your recepipt can be found <a href={ this.props.receiptUrl } target="_blank" rel="noopener noreferrer">here</a></p>
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
                            <p className="card-text"> An acccount has been created for you. <br />
                                You can now log in using <br />Email: { this.props.newUserEmail } <br />Password: { this.props.generatedPasswd} <br />
                                Your receipt can be found <a href={ this.props.receiptUrl } target="_blank" rel="noopener noreferrer">here</a></p>
                        </div>
                    </div>
                </div>
            )
        }
    }

} export default OrderSuccess;
