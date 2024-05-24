import {Account, AccountId, Transaction} from "../domain/Account";
import {Accounts} from "./Accounts";

export class InMemoryAccounts implements Accounts {
    private accounts = new Map<AccountId, Account>();

    async save(account: Account): Promise<void> {
        this.accounts.set(account.id, account);
    }

    async getById(id: AccountId): Promise<Account | undefined> {
        return this.accounts.get(id);
    }

    async updateTransactionsOf(id: AccountId, newTransactions: Transaction[]): Promise<void> {
        const account = this.accounts.get(id);
        if (account) {
            this.accounts.set(account.id, new Account(
                account.id,
                account.owner,
                newTransactions
            ));
        }
    }
}