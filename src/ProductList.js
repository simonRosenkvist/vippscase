
import React from 'react';
import axios from 'axios';
import OrderDetails from './OrderDetails.js';


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
            dataToDisplay: [],
            orderIds: [], // p-a för test
            paHTML: []
            

        }
    }
    

    UNSAFE_componentWillMount(){
     axios.get(this.props.apiUrl + 'orders', ({withCredentials: true}))
    .then(response => response.data)
    .then((data) => {
        //console.log('product data: ', data)
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
        
        //console.log("Final efter 'en rad'")
        //console.log(map)
        //console.log('tempData: ', tempData);
        //console.log('orderIds: ', this.state.orderIds)

        //var prettyHTML=[]
        let paHTML = []
        console.log("order: ", paorder)

        for (const key of paorder) {
            console.log('order id: ', key.orderId)
            console.log('status: ', key.orderStatus)
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
            
            /*axios.get(this.props.apiUrl + 'order/' + key.orderId, ({ withCredentials: true }) )
            .then((response) => {
                console.log('axios then')
                 response.data.forEach(element => {
                    //console.log('foreach: ', element)
                    paHTML.push(
                        <div className="test2">
                            <h3 className="test3">Order ID: {key.orderId}</h3>
                            <ul className="test4" key={key.orderId}>
                                <li className="test6" key={element.id}>Product id: {element.id}</li>
                                <li className="test6" key={element.productname}>Name: {element.productname}</li>
                                <li className="test6" key={element.productdescription}>Description: {element.productdescription}</li>
                                <li className="test6" key={element.price}>Price: {element.price}</li>
                            </ul>
                        </div>
                    )
            
                });
            })
        }*/
        console.log('pahtml size: ', paHTML.length)
        //tempData.map((order)=>{
            //console.log('orderid: ', order.orderId)
            /*axios.get(this.props.apiUrl + 'order/' + order.orderId, ({withCredentials: true}))
            .then((response) => {
                //console.log('order/19: ', response.data)
                //console.log('id 7', response.data[0].id)
        //})
                response.data.forEach(element => {
                    //console.log('foreach: ', element)
                    paHTML.push(
                        <div className="test2">
                            <h3 className="test3">Order ID: {order.orderId}</h3>
                            <ul className="test4" key={order.orderId}>
                                <li className="test6" key={element.id}>Product id: {element.id}</li>
                                <li className="test6" key={element.productname}>Name: {element.productname}</li>
                                <li className="test6" key={element.productdescription}>Description: {element.productdescription}</li>
                                <li className="test6" key={element.price}>Price: {element.price}</li>
                            </ul>
                        </div>
                    )
            
                });*/

        
                /*this.setState({
                    dataToDisplay:paHTML
                })*/
        
            //}) //this axios
            //return null
        //}) // simon map    
        this.setState({
            dataToDisplay:paHTML
        })
        }) // then
        


       
       
    //})
   
    }

componentDidMount() {

    
    
    //axios.get(this.state.local, ({withCredentials: true}))
   /* axios.get(this.props.apiUrl + 'orders', ({withCredentials: true}))
    .then(response => response.data)
    .then((data) => {
        //console.log('product data: ', data)
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
            this.state.orderIds.push({orderId: this.state.order[i][0][0]})
        }
        
        //console.log("Final efter 'en rad'")
        //console.log(map)
        console.log('tempData: ', tempData);
        console.log('orderIds: ', this.state.orderIds)

        /*var prettyHTML=[]
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

        });*/
        /*this.setState({
            dataToDisplay:prettyHTML
        })*/


       
       
    /*})
    .then(() =>{*/
    console.log('orderIds. lenght: ', this.state.orderIds.length)
    
        //let paHTML= []
        this.state.orderIds.forEach(orders => {
        //console.log('orders.. ', orders.orderId)
        /*axios.get(this.props.apiUrl + 'order/' + orders.orderId, ({withCredentials: true}))
        .then((response) => {
            console.log('order/19: ', response.data)
            console.log('id 7', response.data[0].id)
            //let paHTML = []
        //})
            response.data.forEach(element => {
                console.log('foreach: ', element)
                parent.state.paHTML.push(
                    <div className="test2">
                        <h3 className="test3">Order ID: {orders.orderId}</h3>
                        <ul className="test4" key={orders.orderId}>
                            <li className="test6" key={element.id}>Product id: {element.id}</li>
                            <li className="test6" key={element.productname}>Name: {element.productname}</li>
                            <li className="test6" key={element.productdescription}>Description: {element.productdescription}</li>
                            <li className="test6" key={element.price}>Price: {element.price}</li>
                        </ul>
                    </div>
                )
            
            });*/
        
        /*this.setState({
            dataToDisplay:paHTML
        })*/
        
        //}) //this axios
    
    }) // foreach
     /*this.setState({
            dataToDisplay:paHTML
        })
    }) */ // then
    

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
