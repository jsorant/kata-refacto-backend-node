import {Accounts} from "../persistence/Accounts";
import {Account} from "./Account";
import {randomUUID} from "node:crypto";

export class CreateAccount {
    private readonly accounts: Accounts;

    constructor(accounts: Accounts) {
        this.accounts = accounts;
    }

    async act(owner: string): Promise<Account> {
        // TODO cannot have Two accounts for the same user

        const accountId = `account-${randomUUID()}`;
        const newAccount = new Account(accountId, owner);
        await this.accounts.save(newAccount);

        return newAccount;
    }
}