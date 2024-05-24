import {AccountsRepository} from "../domain/ports/AccountsRepository";
import {MongoClient} from "mongodb";
import {Account, AccountId} from "../domain/model/Account";
import {Amount} from "../domain/model/Amount";
import {Transaction} from "../domain/model/Transaction";
import {Deposit} from "../domain/model/Deposit";
import {Withdraw} from "../domain/model/Withdraw";

const DATABASE_NAME = 'Banking';
const ACCOUNTS_COLLECTION = 'accounts';

interface AccountInMongo {
    id: string,
    owner: string,
    transactions: TransactionInMongo[]
}

interface TransactionInMongo {
    type: "deposit" | "withdraw",
    date: Date,
    amount: number
}

export class MongoDbAccounts implements AccountsRepository {
    private mongoClient;

    constructor(mongoUrl: string) {
        this.mongoClient = new MongoClient(mongoUrl);
    }

    async save(account: Account): Promise<void> {
        const collection = await this.accountsCollection();
        await collection.insertOne(this.toAccountInMongo(account));
    }

    async getById(id: AccountId): Promise<Account | undefined> {
        const collection = await this.accountsCollection();
        const findResult = await collection.findOne({id: id});

        if (findResult === null) return undefined;

        return this.toAccount(findResult as unknown as AccountInMongo);
    }

    async updateTransactionsOf(account: Account): Promise<void> {
        const collection = await this.accountsCollection();
        await collection.updateOne(
            {id: account.id}, {
                $set:
                    {
                        transactions: account.transactions.map(this.toTransactionInMongo)
                    }
            });
    }

    private toAccountInMongo(account: Account): AccountInMongo {
        return {
            id: account.id,
            owner: account.owner,
            transactions: account.transactions.map(this.toTransactionInMongo)
        }
    }

    private toTransactionInMongo(transaction: Transaction): TransactionInMongo {
        return {
            type: transaction instanceof Deposit ? "deposit" : "withdraw",
            date: transaction.date,
            amount: transaction.amount.value
        }
    }

    private toAccount(accountInMongo: AccountInMongo): Account {
        return new Account(
            accountInMongo.id,
            accountInMongo.owner,
            accountInMongo.transactions.map(this.toTransaction)
        )
    }

    private toTransaction(transactionInMongo: TransactionInMongo): Transaction {
        if (transactionInMongo.type === "deposit") {
            return new Deposit(transactionInMongo.date, new Amount(transactionInMongo.amount));
        }
        return new Withdraw(transactionInMongo.date, new Amount(transactionInMongo.amount));
    }

    private async accountsCollection() {
        await this.mongoClient.connect();
        const db = this.mongoClient.db(DATABASE_NAME);
        return db.collection(ACCOUNTS_COLLECTION);
    }
}