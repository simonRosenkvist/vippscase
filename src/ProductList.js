
import React from 'react';
import axios from 'axios';


class ProductList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            order: [
            ]
        }
    }
    

componentDidMount() {
    axios.get("https://pa-vips-back.herokuapp.com/orders")
    .then(response => response.data)
    .then((data) => {

        data.forEach(element => {
            this.setState({order:[...this.state.order, element]})
            
        });
        

        console.log(this.state.order)

    })
    
	}
    render() {
        return(
            <div>
                <ul>
                    {this.state.order.map(item => (
                        this.state.order.map(item2 => (
                            <li key={item2}>{item2}</li>

                        ))    

                        ))}
                </ul>
            </div>
        )
                
    
    }

}

export default ProductList;
