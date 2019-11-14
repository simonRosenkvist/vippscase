import React from 'react';
import axios from 'axios';

class RandomItems extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            products: [],
            finalProd: [],
            amount: 0,
            clothes: [],
            descriptions: [],
            prices: [],
            test: []
        }
        
        


    }

    
    
    

    componentDidMount() {
        axios.get("http://localhost:8080/randomproducts")
        .then(response => response.data)
        .then((data) => {
            //What is even going on in here?
            data.forEach(element => {
                this.setState({products:[...this.state.products, element]})
            });
        })
        .then(() => {
            //Unnesteling the loop and summarizing the total amount.
            let tempAmount = 0;
            for (let i = 0; i < 4; i++)
            {
                this.state.finalProd.push(this.state.products[i][0])
                tempAmount += this.state.products[i][0][3];
                this.state.clothes.push(this.state.products[i][0][0])
                this.state.descriptions.push(this.state.products[i][0][1])
                this.state.prices.push(this.state.products[i][0][3])

 
            }
            console.log(this.state.finalProd)
            console.log(this.state.amount)
            this.setState({
                amount: (tempAmount*100)
            })
            console.log("amount after setState: ", this.state.amount)
            this.props.onAmountChanged(this.state.amount)
            console.log("------")
            console.log(this.state.clothes[0])
            console.log(this.state.descriptions[0])
            console.log(this.state.prices[0])

        })
        
         
    }

    render() {
        return(
            <div className="card">
                <div className="card" >
                    <p><b>Name:</b> {this.state.clothes[0]}</p>
                    <p><b>Price:</b> {this.state.prices[0]} SEK</p>
                    <p><b>Description:</b> {this.state.descriptions[0]}</p>
                </div>
                <div className="card" >
                    <p><b>Name:</b> {this.state.clothes[1]}</p>
                    <p><b>Price:</b> {this.state.prices[1]} SEK</p>
                    <p><b>Description:</b> {this.state.descriptions[1]}</p>                
                </div>
                <div className="card" >
                    <p><b>Name:</b> {this.state.clothes[2]}</p>
                    <p><b>Price:</b> {this.state.prices[2]} SEK</p>
                    <p><b>Description:</b> {this.state.descriptions[2]}</p>                
                </div>
                <div className="card" >
                    <p><b>Name:</b> {this.state.clothes[3]}</p>
                    <p><b>Price:</b> {this.state.prices[3]} SEK</p>
                    <p><b>Description:</b> {this.state.descriptions[3]}</p>                
                </div>
            </div>
        )   
    }
}

export default RandomItems;
