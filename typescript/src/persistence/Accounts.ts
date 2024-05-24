import {Account, AccountId, Transaction} from "../domain/Account";

export interface Accounts {
    save(account: Account): Promise<void>;

    getById(id: AccountId): Promise<Account | undefined>;

    updateTransactionsOf(id: AccountId, newTransactions: Transaction[]): Promise<void>;
}

