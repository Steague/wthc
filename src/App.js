import React from 'react';
import './App.css';

function App() {
    return (
        <div className="App">
            <header className="App-header">
                Take-Home Challenge
            </header>
            <button onClick={() => {
                fetch('/test')
                .then(function(response) {
                    return response.json();
                })
                .then(function(json) {
                    console.log(json.message);
                });
            }}>First Test</button>
        </div>
    );
}

export default App;
