import {Amount} from "./Amount";
import {Transaction} from "./Transaction";

export class Withdraw extends Transaction {
    constructor(date: Date, amount: Amount) {
        super(date, amount);
    }

    static of(amount: Amount): Withdraw {
        return new Withdraw(new Date(), amount);
    }

    applyTo(balance: number): number {
        return balance - this.amount.value;
    }
}