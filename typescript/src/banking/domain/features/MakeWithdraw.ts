import {AccountsRepository} from "../ports/AccountsRepository";
import {AccountId} from "../model/Account";
import {Amount} from "../model/Amount";

export class MakeWithdraw {
    private readonly accounts: AccountsRepository;

    constructor(accounts: AccountsRepository) {
        this.accounts = accounts;
    }

    async act(accountId: AccountId, amount: Amount): Promise<void> {
        const account = await this.accounts.getById(accountId);

        if (account === undefined) {
            throw new Error(`Account '${accountId}' not found!`);
        }

        account.addWithdraw(amount);

        await this.accounts.updateTransactionsOf(account);
    }
}