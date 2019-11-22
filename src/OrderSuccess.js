import * as React from 'react';

class OrderSuccess extends React.Component{
    

    componentDidMount(){
        
    }

    render () {
        if(this.props.isLoggedIn > 0){
        return (
            <div className="container-fluid center">
                    <div className="card pa-card mt-3 border rounded shadow-lg">
                        <div className="card-body">
                            <h5 className="card-title">Thank you for your order!</h5>
                            <p className="card-text">You find the order details under Order history.</p>
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
                            <p className="card-text"></p>
                        </div>
                    </div>
                </div>
            )
        }
    }

} export default OrderSuccess;
