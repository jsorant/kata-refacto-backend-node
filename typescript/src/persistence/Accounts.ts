import {Account, AccountId} from "../domain/Account";

export interface Accounts {
    save(account: Account): Promise<void>;

    getById(id: AccountId): Promise<Account | undefined>;

    updateTransactionsOf(id: AccountId, newTransactions: any[]): Promise<void>;
}

