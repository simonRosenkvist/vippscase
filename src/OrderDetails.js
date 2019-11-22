import * as React from 'react';
import axios from 'axios';

class OrderDetails extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            dataToDisplay: []
        }

    }

    componentDidMount(){
        const parent = this
        let paHTML = []
        axios.get(this.props.apiUrl + 'order/' + this.props.orderId, ({ withCredentials: true }) )
            .then((response) => {
                 response.data.forEach(element => {
                    paHTML.push(
                         <tr>
                         <td className="card-text">{ element.id }</td>
                         <td className="card-text">{ element.productname}</td>
                         <td className="card-text">{ element.productdescription }</td>
                         <td className="card-text">{ element.price }</td>
                         </tr>
                     )
                });
            })
            .then(()=>{
                parent.setState({
                    dataToDisplay: paHTML
                })
            })
    }

    render () {
        let collapseTarget = '#orderid' + this.props.orderId
        let collapseMe = 'orderid' + this.props.orderId
        let trId = 'tr' + this.props.orderId
        return (
            <div className="container-fluid order-details-container">
                <div className="row">
                    <div className="col-md-12">
                        <div className="card shadow-lg">
                            <div className="card-header pa-card-header" id={ this.props.orderId }>
                                <span><h5 className="card-title">Order number: { this.props.orderId }
                                    <button className="btn btn-primary btn-sm pa-btn pull-right" 
                                        type="button" 
                                        data-toggle="collapse" 
                                        data-target={ collapseTarget } 
                                        aria-expanded="false" 
                                        aria-controls={ collapseMe }
                                    >show
                                    </button>
                                </h5></span>
                            </div>
                            <div className="collapse table-responsive"  id={ collapseMe }>
                            <table className="card-table table" id={this.props.orderId} aria-expanded="false" aria-controls={this.props.orderId}>
                                <thead>
                                    <tr id={trId}>
                                        <th scope="col">Product id</th>
                                        <th scope="col">Name</th>
                                        <th scope="col">Description</th>
                                        <th scope="col">Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                        { this.state.dataToDisplay }
                                </tbody>
                            </table>
                            </div>
                        <div className="card-footer pa-card-footer text-muted">
                            <h6 className="card-subtitle md-2 text-muted">Status: {this.props.orderStatus}</h6>
                        </div> 
                        </div>                    
                    </div>
                </div>
            </div>
        )
    }

} export default OrderDetails;
