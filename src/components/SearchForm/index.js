import React, { Component } from 'react';
import './SearchForm.css';

class SearchForm extends Component {
    render() {
        return (
            <form className="SerachForm" onSubmit={(e) => {
                fetch(`/search/${this.props.keyword}`, {method: "POST"})
                .then((response) => {
                    return response.json();
                })
                .then((json) => {
                    this.props.onUpdateResults(json);
                });
                e.preventDefault();
            }}>
                <input
                    className="SearchForm-searchText"
                    type="search"
                    value={this.props.keyword}
                    placeholder="Search"
                    onChange={e => {
                        this.props.onUpdateKeyword(e.target.value);
                    }}
                />
                <button className="SearchForm-searchButton"><span role="img" aria-label="Search">&#x1f50d;</span></button>
            </form>
        );
    }
}

export default SearchForm;
