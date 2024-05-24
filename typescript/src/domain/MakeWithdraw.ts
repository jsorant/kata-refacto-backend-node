import {Accounts} from "../persistence/Accounts";
import {AccountId} from "./Account";

export class MakeWithdraw {
    private readonly accounts: Accounts;

    constructor(accounts: Accounts) {
        this.accounts = accounts;
    }

    async act(accountId: AccountId, amount: number): Promise<void> {
        const account = await this.accounts.getById(accountId);

        if (account === undefined) {
            throw new Error(`Account '${accountId}' not found!`);
        }

        //TODO amount must be > 0
        //TODO balance must be > 0
        const newTransactions = [...account.transactions, {
            date: Date.now(),
            type: "withdraw",
            amount: amount
        }];

        await this.accounts.updateTransactionsOf(accountId, newTransactions);
    }
}