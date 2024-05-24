import {Amount} from "./Amount";

export type AccountId = string;

export enum TransactionType {
    DEPOSIT = "deposit",
    WITHDRAW = "withdraw"
}

export interface Transaction {
    date: Date;
    type: TransactionType;
    amount: Amount;
}

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
        return this.transactions.reduce<number>((balance: number, transaction: any) => {
            if (transaction.type === TransactionType.DEPOSIT) return balance + transaction.amount.value;
            return balance - transaction.amount.value;
        }, 0);
    }

    addDeposit(amount: Amount): void {
        this.addTransaction(TransactionType.DEPOSIT, amount);
    }

    addWithdraw(amount: Amount): void {
        this.ensureCanWithdraw(amount);
        this.addTransaction(TransactionType.WITHDRAW, amount);
    }

    private ensureCanWithdraw(amount: Amount) {
        if (this.balance() - amount.value < 0) throw new Error("Balance cannot become negative!");
    }

    private addTransaction(type: TransactionType, amount: Amount) {
        const withdraw: Transaction = {
            date: new Date(),
            type: type,
            amount: amount
        }
        this.transactions.push(withdraw);
    }
}