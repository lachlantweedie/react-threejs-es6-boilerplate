import React, { Component } from 'react';
import css from './styles.scss';
import Three from '../Three/Three';
import { $on } from '../../js/helpers';

class App extends Component {

  constructor() {
    super();

    this.state = { loaded: false };

    $on(window, 'load', () => {
      this.setState({ loaded: true });
    });

  }

  render() {
    return (
      <main className={this.state.loaded ? 'loaded' : ''}>
        <Three />
        <div className="content">
          <h1 className="h1">
            <code>
              React + Three.js Boilerplate;
            </code>
          </h1>
        </div>
      </main>
    );
  }
}

export default App;
