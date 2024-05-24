import {AccountsRepository} from "../ports/AccountsRepository";
import {Account} from "../entities/Account";
import {randomUUID} from "node:crypto";

export class CreateAccount {
    private readonly accounts: AccountsRepository;

    constructor(accounts: AccountsRepository) {
        this.accounts = accounts;
    }

    async act(owner: string): Promise<Account> {
        // TODO cannot have Two accounts for the same user

        const newAccount = Account.CreateNew(owner);

        await this.accounts.save(newAccount);

        return newAccount;
    }
}