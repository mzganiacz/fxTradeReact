import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import DevTools from 'mobx-react-devtools';
import './styles.css';
import { Input, Header, Grid, Segment, Dropdown, Button, Table, Form } from 'semantic-ui-react';


var CurrencyPairs: string[] = ['EURUSD', 'EURPLN', 'EURGBP', 'CHFUSD'];


enum BS {
    Buy, Sell
}


class Trade {
    pair: string;
    amount1: Number;
    amount2: Number;
    rate: Number;
    tradeDate: Date;
    buyOrSell: BS;
}



class AppState {
    @observable tradeToAdd: Trade = new Trade();

    @observable trades: Trade[] = [];

    constructor() {
    }

}



class TradeInputComponent extends React.Component<{ appState: AppState }, {}> {
    updateProperty(key, value) {
        this.props.appState.tradeToAdd[key] = value
    }

    bindToTrade(propName) {
        return (event) => { this.props.appState.tradeToAdd[propName] = event.target.value; }
    }


    render() {
        return (
            <div className='trade-app'>
                <Header size='huge'>Trade Input</Header>
                <Form className='trade-input-form'>
                    <Grid columns={3} stackable>
                        <Grid.Column>
                            <select required onChange={this.bindToTrade('pair')}>
                            <option selected></option>
                                {CurrencyPairs.map((el) => { return <option value={el}>{el}</option>})}
                            </select>
                        </Grid.Column>
                        <Grid.Column>
                            <RateComponent model={this.props.appState.tradeToAdd} />
                        </Grid.Column>
                        <Grid.Column>
                            <Input required type='date' style={{ width: '100%' }} focus placeholder='TradeDate' />
                        </Grid.Column>
                    </Grid>
                    <Grid columns={1} stackable>
                        <Grid.Column>
                            <Button floated='right' onClick={() => { }}>Add Trade</Button>
                        </Grid.Column>
                    </Grid>
                </Form>
                <p>{this.props.appState.tradeToAdd.pair}</p>

                <Header size='huge'>Trade History</Header>
                <TradesTable model={this.props.appState} />
                <DevTools />
            </div>
        );
    }

};


class RateComponent extends React.Component<{ model: { amount1: Number, rate: Number, amount2: Number } }, {}> {

    bindToModel(propName) {
        return (event) => { this.props.model[propName] = event.target.value; }
    }


    render() {
        return (
            <div className='rate-component'>
                <Input type='number' required className='rate-component__amount1' placeholder='Amount1' />
                <Input type='number' required className='rate-component__rate' placeholder='Rate' />
                <Input type='number' required className='rate-component__amount2' placeholder='Amount2' />
            </div>
        );
    }

};


@observer
class TradesTable extends React.Component<{ model: { trades: Trade[] } }, {}> {

    render() {
        return (
            <Table celled className='trades-table-component'>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Pair</Table.HeaderCell>
                        <Table.HeaderCell>Amount 1</Table.HeaderCell>
                        <Table.HeaderCell>Rate</Table.HeaderCell>
                        <Table.HeaderCell>Amount 2</Table.HeaderCell>
                        <Table.HeaderCell>Trade Date</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {this.props.model.trades.map((el: Trade) => {
                        return <Table.Row>
                            <Table.Cell>{el.pair}</Table.Cell>
                            <Table.Cell>{el.amount1}</Table.Cell>
                            <Table.Cell>{el.rate}</Table.Cell>
                            <Table.Cell>{el.amount2}</Table.Cell>
                            <Table.Cell>{el.tradeDate}</Table.Cell>
                        </Table.Row>
                    })}
                </Table.Body>
            </Table>
        );
    }

};


const appState = new AppState();
ReactDOM.render(<TradeInputComponent appState={appState} />, document.getElementById('root'));
