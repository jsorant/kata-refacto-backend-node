import {Accounts} from "./Accounts";
import {MongoClient, ObjectId} from "mongodb";
import {Account, AccountId} from "../domain/Account";

const MONGO_URL = 'mongodb://localhost:27017';
const DATABASE_NAME = 'Banking';
const ACCOUNTS_COLLECTION = 'accounts';

export class MongoDbAccounts implements Accounts {
    private mongoClient = new MongoClient(MONGO_URL);

    async save(account: Account): Promise<void> {
        const collection = await this.accountsCollection();
        await collection.insertOne(account);
    }

    async getById(id: AccountId): Promise<Account | undefined> {
        const collection = await this.accountsCollection();
        const findResult = await collection.findOne({id: id});

        if (findResult === null) return undefined;

        return new Account(findResult.id, findResult.owner, findResult.transactions);
    }

    async updateTransactionsOf(id: AccountId, newTransactions: any[]): Promise<void> {
        const collection = await this.accountsCollection();
        await collection.updateOne(
            {id: id}, {
                $set:
                    {
                        transactions: newTransactions
                    }
            });
    }

    private async accountsCollection() {
        await this.mongoClient.connect();
        const db = this.mongoClient.db(DATABASE_NAME);
        return db.collection(ACCOUNTS_COLLECTION);
    }
}