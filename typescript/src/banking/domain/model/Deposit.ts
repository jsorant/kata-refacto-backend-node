import {Amount} from "./Amount";
import {Transaction} from "./Transaction";

export class Deposit extends Transaction {
    constructor(date: Date, amount: Amount) {
        super(date, amount);
    }

    applyToBalance(balance: number): number {
        return balance + this.amount.value;
    }
}