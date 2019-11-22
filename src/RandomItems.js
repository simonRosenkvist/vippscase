import React from 'react';
import axios from 'axios';

class RandomItems extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            products: [],
            finalProd: [],
            amount: 0,
            prettyAmount: 0,
            clothes: [],
            descriptions: [],
            prices: [],
            productIds: []
        }
        
        


    }
    
    componentDidMount() {
        axios.get(this.props.apiUrl + 'randomproducts')
        .then(response => response.data)
        .then((data) => {
            data.forEach(element => {
                this.setState({products:[...this.state.products, element]})
            });
        })
        .then(() => {
            //Unnesteling the loop and summarizing the total amount.
            let tempAmount = 0;
            for (let i = 0; i < 4; i++)
            {
                this.state.productIds.push(this.state.products[i][0][0])
                this.state.finalProd.push(this.state.products[i][0])
                tempAmount += this.state.products[i][0][4];
                this.state.clothes.push(this.state.products[i][0][1])
                this.state.descriptions.push(this.state.products[i][0][2])
                this.state.prices.push(this.state.products[i][0][4])
            }
            
            this.setState({
                amount: (tempAmount*100),
                prettyAmount: tempAmount,
                productIds: this.state.productIds
            })
        
            this.props.onAmountChanged(this.state.amount, this.state.prettyAmount, this.state.productIds)
        })
    }

    render() {
        return(
            <div>
            <div className="card pa-card mt-3 border rounded shadow-lg">
                <div className="card-body" >
                    <h5 className="card-title">Name: {this.state.clothes[0]}</h5>
                    <p className="card-text"><b className="card-subtitle mb-2 text-muted">Description: </b>{this.state.descriptions[0]}</p>
                    <h6 className="card-subtitle mb-2 text-muted"><b>Price: </b>{this.state.prices[0]} SEK</h6>
                </div>
            </div>
            <div className="card pa-card mt-3 border rounded shadow-lg">
                <div className="card-body" >
                    <h5 className="card-title">Name: {this.state.clothes[1]}</h5>
                    <p className="card-text"><b className="card-subtitle mb-2 text-muted">Description:</b> {this.state.descriptions[1]}</p>                
                    <h6 className="card-subtitle mb-2 text-muted"><b>Price:</b> {this.state.prices[1]} SEK</h6>
                </div>
            </div>
            <div className="card pa-card mt-3 border rounded shadow-lg">
                <div className="card-body" >
                    <h5 className="card-title">Name: {this.state.clothes[2]}</h5>
                    <p className="card-text"><b className="card-subtitle mb-2 text-muted">Description: </b>{this.state.descriptions[2]}</p>                
                    <h6 className="card-subtitle mb-2 text-muted"><b>Price:</b> {this.state.prices[2]} SEK</h6>
                </div>
            </div>
            <div className="card pa-card mt-3 border rounded shadow-lg">
                <div className="card-body" >
                    <h5 className="card-title">Name: {this.state.clothes[3]}</h5>
                    <p className="card-text"><b className="card-subtitle mb-2 text-muted">Description: </b>{this.state.descriptions[3]}</p>                
                    <h6 className="card-subtitle mb-2 text-muted"><b>Price:</b> {this.state.prices[3]} SEK</h6>
                </div>
            </div>
            </div>
        )   
    }
}

export default RandomItems;
