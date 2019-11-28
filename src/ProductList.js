
import React from 'react';
import axios from 'axios';
import OrderDetails from './OrderDetails.js';


class ProductList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            order: [
            ],
            orderId: [],
            productId: [],
            status: [],
            finalOrder: [], //Ska hålla en array (som innehåller en eller flera ordrar) per orderId
            dataToDisplay: [],
            orderIds: [], 
            paHTML: []
            

        }
    }
    

    UNSAFE_componentWillMount(){
        axios.get(this.props.apiUrl + 'orders', ({withCredentials: true}))
        .then(response => response.data)
        .then((data) => {
            data.forEach(element => {
                this.setState({order:[...this.state.order, element]})
            });
        
        })
        .then(() => {

            var tempData = [];
            let paorder = []
            for (let i = 0; i < this.state.order.length; i++){
        
                var cart = [];
                for (let y = 0; y < this.state.order[i].length; y++) { 

                    cart.push(this.state.order[i][y][1]);
                }

                tempData.push({
                    orderId: this.state.order[i][0][0],
                    cart: cart
                });
                paorder.push({
                    orderId: this.state.order[i][0][0],
                    orderStatus: this.state.order[i][0][2]
                })
            }
        
            let paHTML = []

            for (const key of paorder) {
               paHTML.push(
                    <div id={ key.orderId}>
                        <OrderDetails
                            apiUrl = { this.props.apiUrl }
                            orderId = { key.orderId }
                            orderStatus = { key.orderStatus }
                        />
                    </div>
                )
            }
            
               
            this.setState({
                dataToDisplay:paHTML
            })
        }) 
    }

    componentDidMount() {
    }

    render() {
        return(
            <div className="test">
                <h1 className="test1">Order history</h1>
                {this.state.dataToDisplay}
            </div>
        )
    }
}

export default ProductList;
