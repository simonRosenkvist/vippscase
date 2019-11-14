import React from 'react';
import axios from 'axios';

class RandomItems extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            products: [],
            finalProd: [],
            amount: 0
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
                
 
            }
            console.log(this.state.finalProd)
            console.log(this.state.amount)
            this.setState({
                amount: (tempAmount*100)
            })
            console.log("amount after setState: ", this.state.amount)
            this.props.onAmountChanged(this.state.amount)
        })
        
         
    }

    render() {
        return(
            <div>
                <p>Tjena</p>
            </div>
        )   
    }
}

export default RandomItems;
