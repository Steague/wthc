import React, { Component } from 'react';
import SearchForm from '../SearchForm';
import SearchResults from '../SearchResults';

import './App.css';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            keyword: "",
            results: {}
        };
        this.onUpdateKeyword = this.onUpdateKeyword.bind(this);
        this.onUpdateResults = this.onUpdateResults.bind(this);
    }

    onUpdateKeyword(keyword) {
        this.setState({keyword});
    }

    onUpdateResults(results) {
        this.setState({results});
    }

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    Take-Home Challenge
                </header>
                <div className="App-content">
                    <SearchForm
                        onUpdateKeyword={this.onUpdateKeyword}
                        onUpdateResults={this.onUpdateResults}
                        keyword={this.state.keyword}
                    />
                    <SearchResults
                        results={this.state.results}
                    />
                </div>
            </div>
        );
    }
}

export default App;
