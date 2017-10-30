import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {TradeInputAndOutputScreen} from './Components';
import {AppState} from './AppState';
import './styles.css';


const appState = new AppState();
ReactDOM.render(<TradeInputAndOutputScreen appState={appState} />, document.getElementById('root'));
