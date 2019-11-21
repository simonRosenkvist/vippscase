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
        console.log('order_details ', this.props.orderId)
        const parent = this
        let paHTML = []
        axios.get(this.props.apiUrl + 'order/' + this.props.orderId, ({ withCredentials: true }) )
            .then((response) => {
                console.log('axios then')
                 response.data.forEach(element => {
                    //console.log('foreach: ', element)
                    /*paHTML.push(
                        <ul className="test4" key={ this.props.orderId }>
                                <li className="test6" key={element.id}>Product id: {element.id}</li>
                                <li className="test6" key={element.productname}>Name: {element.productname}</li>
                                <li className="test6" key={element.productdescription}>Description: {element.productdescription}</li>
                                <li className="test6" key={element.price}>Price: {element.price}</li>
                        </ul>
                    )*/

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
                console.log('pahtml size: ', paHTML.length)
                parent.setState({
                    dataToDisplay: paHTML
                })
                console.log('data to display size ', parent.state.dataToDisplay.length)
            })

    }
/*
    <button class="btn btn-primary" type="button" data-toggle="collapse" data-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample">
    Button with data-target
  </button>
</p>
<div class="collapse" id="collapseExample">
  <div class="card card-body">
    Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident.
  </div>
</div>*/

    render () {
        let collapseTarget = '#orderid' + this.props.orderId
        let collapseMe = 'orderid' + this.props.orderId
        let trId = 'tr' + this.props.orderId
        return (
            <div className="container-fluid order-details-container">
                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
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
        
        /*return (
            <div className="test2">
                <h3 className="test3">Order id: { this.props.orderId }</h3>
                    { this.state.dataToDisplay }
            </div>

        )*/
    }

} export default OrderDetails;
