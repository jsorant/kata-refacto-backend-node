export type AccountId = string;

export class Account {
    readonly id: AccountId;
    readonly owner: string;
    readonly transactions: any[];

    constructor(id: AccountId, owner: string, transactions: any[] = []) {
        this.id = id;
        this.owner = owner;
        this.transactions = transactions;
    }
}