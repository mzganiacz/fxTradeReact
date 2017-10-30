import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Input, Header, Grid, Segment, Dropdown, Button, Table, Form, Label } from 'semantic-ui-react';
import { observable, computed } from 'mobx';
import { observer } from 'mobx-react';
import {AppState, Trade, CurrencyPairs} from './AppState';
import * as moment from 'moment';
import DevTools from 'mobx-react-devtools';

@observer
export class TradeInputAndOutputScreen extends React.Component<{ appState: AppState }, {}>{
    constructor() {
        super();
        this.changeTradeDate = this.changeTradeDate.bind(this);
    }

    private changeTradeDate(event) {
        this.props.appState.tradeToAdd.tradeDate = moment.utc(event.target.value, 'YYYY-MM-DD').toDate();
    }

    private changeCurrencyPair(event) {
        this.props.appState.tradeToAdd.pair = event.target.value;
    }

    render() {
        return (
            <div className='trade-app'>
                <Header size='huge'>Trade Input</Header>
                <TradeInputComponent model={this.props.appState.tradeToAdd} rateComponentProperties={this.props.appState.tradeToAdd} addTrade={this.props.appState.addTrade} />
                <p>{this.props.appState.tradeToAdd.pair}</p>

                <Header size='huge'>Trade History</Header>
                <TradesTable model={this.props.appState} />
                <DevTools />
            </div>
        );
    }
}

@observer
class TradeInputComponent extends React.Component<{ model: { tradeDate: Date, tradeCalendarDate: string, pair: string }, rateComponentProperties: RateComponentProperties, addTrade: ()=>void }, {}> {
    constructor() {
        super();
        this.changeTradeDate = this.changeTradeDate.bind(this);
        this.changeCurrencyPair = this.changeCurrencyPair.bind(this);
    }

    private changeTradeDate(event) {
        this.props.model.tradeDate = moment.utc(event.target.value, 'YYYY-MM-DD').toDate();
    }

    private changeCurrencyPair(event) {
        this.props.model.pair = event.target.value;
    }

    render() {
        return (
            <Form className='trade-input-form'>
                <Grid columns={3} stackable>
                    <Grid.Column>
                        <label>Currency Pair</label>
                        <select className='trade-input-form__currency-pair' required value={this.props.model.pair} onChange={this.changeCurrencyPair}>
                            <option value=''>Currency Pair</option>
                            {CurrencyPairs.map((el, i) => { return <option key={i} value={el}>{el}</option> })}
                        </select>
                    </Grid.Column>
                    <Grid.Column>
                        <RateComponent model={this.props.rateComponentProperties} />
                    </Grid.Column>
                    <Grid.Column>
                        <label>Trade Date</label>
                        <Input className="trade-input-form__trade-date" required type='date' placeholder='Trade Date' value={this.props.model.tradeCalendarDate} onChange={this.changeTradeDate} />
                    </Grid.Column>
                </Grid>
                <Grid columns={1} stackable>
                    <Grid.Column>
                        <Button floated='right' type='submit' onClick={this.props.addTrade}>Add Trade</Button>
                    </Grid.Column>
                </Grid>
            </Form>
        );
    }

};

type RateComponentProperties = { amount1: Number, rate: Number, amount2: Number };

@observer
class RateComponent extends React.Component<{ model: RateComponentProperties }, {}> {

    private changeAmount1(event) {
        let am1: Number = new Number(event.target.value);
        this.props.model.amount1 = am1.valueOf();
        if (this.props.model.rate) {
            this.props.model.amount2 = new Number((am1.valueOf() * this.props.model.rate.valueOf()).toFixed(4));
        }
    }

    private changeAmount2(event) {
        let am2: Number = new Number(event.target.value);
        this.props.model.amount2 = am2.valueOf();
        if (this.props.model.rate) {
            this.props.model.amount1 = new Number((am2.valueOf() / this.props.model.rate.valueOf()).toFixed(4));
        }
    }

    private changeRate(event) {
        let rate: Number = new Number(event.target.value);
        this.props.model.rate = rate.valueOf();
        if (this.props.model.amount1) {
            this.props.model.amount2 = new Number((this.props.model.amount1.valueOf() * rate.valueOf()).toFixed(4));
        }
    }

    render() {
        return (
            <div className='rate-component'>
                <div className='rate-component__labels'>
                <div><label>Amount 1</label></div>
                <div><label>Rate</label></div>
                <div><label>Amount 2</label></div>
                </div>
                <Input type='number' required className='rate-component__amount1' min='0.01' step='0.01' placeholder='Amount1' value={this.props.model.amount1} onChange={this.changeAmount1.bind(this)} />
                <Input type='number' required className='rate-component__rate' min='0.01' step='0.01' placeholder='Rate' value={this.props.model.rate} onChange={this.changeRate.bind(this)} />
                <Input type='number' required className='rate-component__amount2' min='0.01' step='0.01' placeholder='Amount2' value={this.props.model.amount2} onChange={this.changeAmount2.bind(this)} />
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
                    {this.props.model.trades.map((el: Trade, i) => {
                        return <Table.Row key={i}>
                            <Table.Cell>{el.pair.toString()}</Table.Cell>
                            <Table.Cell>{el.amount1.toString()}</Table.Cell>
                            <Table.Cell>{el.rate.toString()}</Table.Cell>
                            <Table.Cell>{el.amount2.toString()}</Table.Cell>
                            <Table.Cell>{moment(el.tradeDate).format('L')}</Table.Cell>
                        </Table.Row>
                    })}
                </Table.Body>
            </Table>
        );
    }
};