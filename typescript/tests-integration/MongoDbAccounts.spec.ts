import {afterAll, afterEach, beforeAll, beforeEach, describe, expect, it} from "vitest";
import {MongoDbAccounts} from "../src/banking/secondary/MongoDbAccounts";
import {Account} from "../src/banking/domain/model/Account";
import {Amount} from "../src/banking/domain/model/Amount";
import {MongoDbContainer} from "./MongoDbContainer";

describe("MongoDbAccounts", () => {
    let mongodbContainer: MongoDbContainer;
    let accounts: MongoDbAccounts;

    beforeAll(async () => {
        mongodbContainer = await MongoDbContainer.startMongoContainer();
    })

    afterAll(async () => {
        await mongodbContainer.stop();
    })

    beforeEach(() => {
        accounts = new MongoDbAccounts(mongodbContainer.mongoUrl);
    })

    afterEach(async () => {
        await mongodbContainer.clearDatabase();
    })


    it("should return undefined for a non existing account", async () => {
        const id = "non-existing-id";

        const retrievedAccount = await accounts.getById(id);

        expect(retrievedAccount).toBeUndefined;
    })

    it("should save and get an account by id", async () => {
        const account = await makeAnAccountAndSaveIt();

        const retrievedAccount = await accounts.getById(account.id);

        expect(retrievedAccount).toStrictEqual(account);
    })

    it("should update the transactions of an account", async () => {
        const account = await makeAnAccountAndSaveIt();

        account.addDeposit(new Amount(5));
        await accounts.updateTransactionsOf(account);

        const retrievedAccount = await accounts.getById(account.id);

        expect(retrievedAccount).toStrictEqual(account);
    })

    function makeAnAccountWithTransactions() {
        const account = new Account("an_id", "an_owner");
        account.addDeposit(new Amount(2));
        account.addDeposit(new Amount(3));
        account.addWithdraw(new Amount(1));
        return account;
    }

    async function makeAnAccountAndSaveIt() {
        const account = makeAnAccountWithTransactions();
        await accounts.save(account);
        return account;
    }
})