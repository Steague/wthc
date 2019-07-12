import React, { Component } from 'react';
import './SearchForm.css';

class SearchForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            keyword: ""
        };
    }

    render() {
        return (
            <form className="SerachForm">
                <input type="text" value={this.state.keyword} onChange={e => {
                    this.setState({keyword: e.target.value});
                }} />
                <button onClick={(e) => {
                    fetch(`/search/${this.state.keyword}`, {method: "POST"})
                    .then(function(response) {
                        return response.json();
                    })
                    .then(function(json) {
                        console.log(json);
                    });
                    e.preventDefault();
                }}>First Test</button>
            </form>
        );
    }
}

export default SearchForm;
