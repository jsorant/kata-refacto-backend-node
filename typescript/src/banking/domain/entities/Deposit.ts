import {Amount} from "./Amount";
import {Transaction} from "./Transaction";

export class Deposit extends Transaction {
    constructor(date: Date, amount: Amount) {
        super(date, amount);
    }

    static of(amount: Amount): Deposit {
        return new Deposit(new Date(), amount);
    }

    applyTo(balance: number): number {
        return balance + this.amount.value;
    }
}