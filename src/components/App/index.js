import React, { Component } from 'react';
import SearchForm from '../SearchForm';

import './App.css';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            keyword: ""
        };
    }

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    Take-Home Challenge
                </header>
                <SearchForm />
            </div>
        );
    }
}

export default App;
