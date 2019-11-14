import React from 'react';
import axios from 'axios';

class RandomItems extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            products: []
        }
    }

    componentDidMount() {
        axios.get("http://localhost:8080/randomproducts")
        .then(response => response.data)
        .then((data) => {
            console.log(data)

            data.forEach(element => {
                this.setState({products:[...this.state.products, element]})
            });
            console.log("---------")
        })
        .then(() => {
            console.log(this.state.products)
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