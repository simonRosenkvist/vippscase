import * as React from 'react';

class RegisterSuccess extends React.Component{
    

    render () {
        
        console.log('ordersuccess is loggedin ', this.props.isLoggedin)
        return (
            <div className="container-fluid center">
                <div className="card pa-card mt-3 border rounded shadow-lg">
                    <div className="card-body">
                        <h5 className="card-title">Registration successful.</h5>
                        <p className="card-text">
                            Thank you for registring an account, you can now log in and keep using the site.
                            If you want to save your credit card details you can choose to do so at checkout.
                        </p>
                    </div>
                </div>
            </div>
        )

    }

} export default RegisterSuccess;
