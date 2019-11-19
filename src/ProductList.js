
import React from 'react';
import axios from 'axios';


class ProductList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            local: "http://localhost:8080/orders",
            live: "https://pa-vips-back.herokuapp.com/orders",
            order: [
            ],
            orderId: [],
            productId: [],
            status: [],
            finalOrder: [], //Ska hålla en array (som innehåller en eller flera ordrar) per orderId
            dataToDisplay: []
            

        }
    }
    

componentDidMount() {

    
    
    //axios.get(this.state.local, ({withCredentials: true}))
    axios.get(this.props.apiUrl + 'orders', ({withCredentials: true}))
    .then(response => response.data)
    .then((data) => {
        console.log(data)
        data.forEach(element => {
            this.setState({order:[...this.state.order, element]})
            
        });
        
    })
    .then(() => {
        var tempData = [];
        for (let i = 0; i < this.state.order.length; i++){
        
            var cart = [];
            for (let y = 0; y < this.state.order[i].length; y++) { 

                cart.push(this.state.order[i][y][1]);
            }

            tempData.push({
                orderId: this.state.order[i][0][0],
                cart: cart
            });
        }
        
        //console.log("Final efter 'en rad'")
        //console.log(map)
        //console.log(tempData);
        

        var prettyHTML=[]
        tempData.map((order)=>{
            var cartHTML=[];
            order.cart.map((item)=>{
                cartHTML.push(
                <li className="test5">Product id: {item}</li>
                )
                return null
            })
            prettyHTML.push(
                <div className="test2">
                    <h3 className="test3">Order id: {order.orderId}</h3>
                    <ul className="test4">
                        {cartHTML}
                    </ul>
                </div>
            );
            return null

        });
        this.setState({
            dataToDisplay:prettyHTML
        })


       
       
    })


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
