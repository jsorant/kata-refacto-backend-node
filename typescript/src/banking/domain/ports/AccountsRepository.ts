import {Account, AccountId} from "../entities/Account";

export interface AccountsRepository {
    save(account: Account): Promise<void>;

    getById(id: AccountId): Promise<Account | undefined>;

    updateTransactionsOf(account: Account): Promise<void>;
}

