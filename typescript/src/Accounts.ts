import {Account, AccountId} from "./Account";

export interface Accounts {
    save(account: Account): Promise<void>;

    getById(id: AccountId): Promise<Account | undefined>;

    updateTransactionsOf(id: AccountId, newTransactions: any[]): Promise<void>;
}

