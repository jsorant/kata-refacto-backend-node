import {Account, AccountId} from "../domain/entities/Account";
import {AccountsRepository} from "../domain/ports/AccountsRepository";

export class InMemoryAccounts implements AccountsRepository {
    private accounts: Map<AccountId, Account> = new Map<AccountId, Account>();

    async save(account: Account): Promise<void> {
        this.accounts.set(account.id, account);
    }

    async getById(id: AccountId): Promise<Account | undefined> {
        return this.accounts.get(id);
    }

    async updateTransactionsOf(account: Account): Promise<void> {
        this.accounts.set(account.id, account);
    }
}