import {Amount} from "./Amount";
import {Transaction} from "./Transaction";
import {Deposit} from "./Deposit";
import {Withdraw} from "./Withdraw";
import {Currency} from "../usecases/ComputeBalance";
import {RatesProvider} from "../ports/RatesProvider";
import {randomUUID} from "node:crypto";

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

    static CreateNew(owner: string): Account {
        return new Account(this.generateAccountId(), owner);
    }

    async balance(targetCurrency: Currency, ratesProvider: RatesProvider): Promise<number> {
        const balanceInEuros = this.computeBalanceInEuros();

        if (targetCurrency === Currency.JPY) {
            const rate = await ratesProvider.getRateFrom("EUR", "JPY");
            return balanceInEuros * rate;
        }

        return balanceInEuros;
    }

    addDeposit(amount: Amount): void {
        this.transactions.push(Deposit.of(amount));
    }

    addWithdraw(amount: Amount): void {
        this.ensureCanWithdraw(amount);
        this.transactions.push(Withdraw.of(amount));
    }

    private ensureCanWithdraw(amount: Amount) {
        if (this.computeBalanceInEuros() - amount.value < 0)
            throw new Error("Balance cannot become negative!");
    }

    private computeBalanceInEuros(): number {
        return this.transactions.reduce<number>((balance: number, transaction: Transaction) => transaction.applyTo(balance), 0);
    }

    private static generateAccountId() {
        return `account-${randomUUID()}`;
    }
}