import * as React from 'react';

class LoginSuccess extends React.Component{
    

    render () {
        if(this.props.isLoggedin > 0){
            return (
                <div className="container-fluid center">
                    <div className="card pa-card mt-3 border rounded shadow-lg">
                        <div className="card-body">
                            <h5 className="card-title"> Welcome</h5>
                            <p className="card-text">Use the menu bar to navigate around the page. </p>
                        </div>
                    </div>
                </div>
            )
        }
    }

} export default LoginSuccess;
