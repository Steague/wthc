import React, { Component } from 'react';
import StarRatingComponent from 'react-star-rating-component';
import './SearchResults.css';

class SearchResults extends Component {
    render() {
        const products = (this.props.results && this.props.results.products) && this.props.results.products.map((product, i) => {
            return <Product key={i} idx={i} product={product} />;
        });
        return (
            <div className="Product-grid">{products}</div>
        );
    }
}

class Product extends Component {
    render() {
        const {product} = this.props;
        return (
            <div className="Product">
                <img src={product.mediumImage} alt={product.name} className="Product-mediumImage" />
                <h3 className="Product-name">{product.name}</h3>
                <div className="Product-rating">
                    <span className="Product-rating-stars">
                        <StarRatingComponent
                            name={`${product.name} rating ${this.props.idx}`}
                            value={parseFloat(product.customerRating)}
                            starColor="#004c91"
                            emptyStarColor="#AAAAAA"
                            editing={false}
                        />
                    </span>
                    <span className="Product-rating-reviews"><h6>{product.numReviews}</h6></span>
                </div>
                <span className="Product-shortDescription">{product.shortDescription}</span>
                <div className="Product-price">
                    <span className="Product-salePrice">${product.salePrice.toFixed(2)}</span>
                    <span className="Product-msrp">List ${product.msrp.toFixed(2)}</span>
                </div>
                <button className="Product-cartButton"><span role="img" aria-label="Cart">&#128722;</span>Add to Cart</button>
            </div>
        );
    }
}

export default SearchResults;
