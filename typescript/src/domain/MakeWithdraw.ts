import {Accounts} from "../persistence/Accounts";
import {AccountId} from "./Account";
import {Amount} from "./Amount";

export class MakeWithdraw {
    private readonly accounts: Accounts;

    constructor(accounts: Accounts) {
        this.accounts = accounts;
    }

    async act(accountId: AccountId, amount: Amount): Promise<void> {
        const account = await this.accounts.getById(accountId);

        if (account === undefined) {
            throw new Error(`Account '${accountId}' not found!`);
        }

        account.addWithdraw(amount);

        await this.accounts.updateTransactionsOf(accountId, account.transactions);
    }
}