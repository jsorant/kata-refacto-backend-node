import {Accounts} from "../persistence/Accounts";
import {AccountId} from "./Account";
import {Amount} from "./Amount";

export class MakeDeposit {
    private readonly accounts: Accounts;

    constructor(accounts: Accounts) {
        this.accounts = accounts;
    }

    async act(accountId: AccountId, amount: Amount): Promise<void> {
        const account = await this.accounts.getById(accountId);

        if (account === undefined) {
            throw new Error(`Account '${accountId}' not found!`);
        }

        account.addDeposit(amount);

        await this.accounts.updateTransactionsOf(accountId, account.transactions);
    }
}