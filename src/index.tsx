import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { observable, computed } from 'mobx';
import { observer } from 'mobx-react';
import DevTools from 'mobx-react-devtools';
import * as moment from 'moment'
import './styles.css';
import { Input, Header, Grid, Segment, Dropdown, Button, Table, Form } from 'semantic-ui-react';


var CurrencyPairs: string[] = ['EURUSD', 'EURPLN', 'EURGBP', 'CHFUSD'];



class Trade {
    pair: string;
    @observable amount1: Number;
    @observable amount2: Number;
    @observable rate: Number;
    @observable tradeDate: Date = new Date();

    @computed get tradeCalendarDate() {
        console.log(this.tradeDate.toISOString())
        return this.tradeDate.toISOString().split('T')[0];
    }
}



class AppState {
    @observable tradeToAdd: Trade = new Trade();

    @observable trades: Trade[] = [];



    constructor() {
    }

}

class TradeInputAndOutputScreen extends React.Component<{appState: AppState}, {}>{
    constructor() {
        super();
        this.changeTradeDate = this.changeTradeDate.bind(this);
    }

    changeTradeDate(event) {
        this.props.appState.tradeToAdd.tradeDate = moment.utc(event.target.value, 'YYYY-MM-DD').toDate();
    }

    changeCurrencyPair(event) {
        this.props.appState.tradeToAdd.pair = event.target.value;
    }


    render() {
        return (
            <div className='trade-app'>
                <Header size='huge'>Trade Input</Header>
                <TradeInputComponent model={this.props.appState.tradeToAdd} rateComponentProperties={this.props.appState.tradeToAdd}/>
                <p>{this.props.appState.tradeToAdd.pair}</p>

                <Header size='huge'>Trade History</Header>
                <TradesTable model={this.props.appState} />
                <DevTools />
            </div>
        );
    }
}


@observer
class TradeInputComponent extends React.Component<{ model: {tradeDate: Date, tradeCalendarDate: string, pair: string}, rateComponentProperties: RateComponentProperties}, {}> {
    constructor() {
        super();
        this.changeTradeDate = this.changeTradeDate.bind(this);
    }

    changeTradeDate(event) {
        this.props.model.tradeDate = moment.utc(event.target.value, 'YYYY-MM-DD').toDate();
    }

    changeCurrencyPair(event) {
        this.props.model.pair = event.target.value;
    }


    render() {
        return (

                <Form className='trade-input-form'>
                    <Grid columns={3} stackable>
                        <Grid.Column>
                            <select className='trade-input-form--currency-pair' required defaultValue=''>
                                <option disabled value=''>Currency Pair</option>
                                {CurrencyPairs.map((el) => { return <option value={el}>{el}</option> })}
                            </select>
                        </Grid.Column>
                        <Grid.Column>
                            <RateComponent model={this.props.rateComponentProperties} />
                        </Grid.Column>
                        <Grid.Column>
                            <Input className="trade-input-form--trade-date" required type='date' placeholder='Trade Date' value={this.props.model.tradeCalendarDate} onChange={this.changeTradeDate} />
                        </Grid.Column>
                    </Grid>
                    <Grid columns={1} stackable>
                        <Grid.Column>
                            <Button floated='right' onClick={() => { }}>Add Trade</Button>
                        </Grid.Column>
                    </Grid>
                </Form>
              
        );
    }

};
type RateComponentProperties = { amount1: Number, rate: Number, amount2: Number };
@observer
class RateComponent extends React.Component<{ model:  RateComponentProperties}, {}> {

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
ReactDOM.render(<TradeInputAndOutputScreen appState={appState} />, document.getElementById('root'));
