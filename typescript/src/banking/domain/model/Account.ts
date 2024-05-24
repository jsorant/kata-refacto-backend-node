import {Amount} from "./Amount";
import {Transaction} from "./Transaction";
import {Deposit} from "./Deposit";
import {Withdraw} from "./Withdraw";

export type AccountId = string;

export class Account {
    readonly id: AccountId;
    readonly owner: string;
    readonly transactions: Transaction[];

    constructor(id: AccountId, owner: string, transactions: Transaction[] = []) {
        this.id = id;
        this.owner = owner;
        this.transactions = transactions;
    }

    balance(): number {
        return this.transactions.reduce<number>((balance: number, transaction: Transaction) => transaction.applyToBalance(balance), 0);
    }

    addDeposit(amount: Amount): void {
        this.transactions.push(new Deposit(new Date(), amount));
    }

    addWithdraw(amount: Amount): void {
        this.ensureCanWithdraw(amount);
        this.transactions.push(new Withdraw(new Date(), amount));
    }

    private ensureCanWithdraw(amount: Amount) {
        if (this.balance() - amount.value < 0) throw new Error("Balance cannot become negative!");
    }
}