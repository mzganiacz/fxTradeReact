import { observable, computed } from 'mobx';
import { observer } from 'mobx-react';

export const CurrencyPairs: string[] = ['EURUSD', 'EURPLN', 'EURGBP', 'CHFUSD'];

export class Trade {
    @observable pair: string = '';
    @observable amount1: Number = 0;
    @observable amount2: Number = 0;
    @observable rate: Number = 0;
    @observable tradeDate: Date = new Date();

    @computed get tradeCalendarDate() {
        return this.tradeDate.toISOString().split('T')[0];
    }
}

export class AppState {
    @observable tradeToAdd: Trade = new Trade();

    @observable trades: Trade[] = [];

    constructor() {
        this.addTrade = this.addTrade.bind(this);
    }

    public addTrade(){
        this.trades.push(this.tradeToAdd);
        this.tradeToAdd = new Trade();
    }
}