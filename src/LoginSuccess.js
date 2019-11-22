import * as React from 'react';

class LoginSuccess extends React.Component{
    

    render () {
        console.log('ordersuccess is loggedin ', this.props.isLoggedin)
        //console.log('location ' + this.state.isLoggedin)
        //console.log('login success ' + this.props.isLoggedin + ' email: ' + this.state.email + ' password: ' + this.state.password)
        if(this.props.isLoggedin > 0){
            return (
                <div className="container-fluid center">
                    <div className="card pa-card mt-3 border rounded shadow-lg">
                        <div className="card-body">
                            <h5 className="card-title"> Welcome</h5>
                            <p className="card-text">Use the nav bar to do stuff. </p>
                        </div>
                    </div>
                </div>
            )
        }
    }

} export default LoginSuccess;
