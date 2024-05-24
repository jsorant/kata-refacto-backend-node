import {Amount} from "./Amount";

export abstract class Transaction {
    public readonly date: Date;
    public readonly amount: Amount;

    protected constructor(date: Date, amount: Amount) {
        this.date = date;
        this.amount = amount;
    }

    abstract applyTo(balance: number): number;
}

