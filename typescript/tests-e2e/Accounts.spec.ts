import {afterEach, describe, expect, it} from "vitest";
import {MongoClient} from "mongodb";
import supertest from "supertest";
import {makeApplication} from "../src/MakeApplication";

const OWNER = "John Doe";
const NON_EXISTING_ACCOUNT_ID = "1635fb7d8b1a07dd83cafa31";

const MONGO_URL = 'mongodb://localhost:27017';
const DATABASE_NAME = 'Banking';
const ACCOUNTS_COLLECTION = 'accounts';

describe("Accounts", () => {
    const app = makeApplication();
    const supertestApp = supertest(app.expressApp);

    afterEach(async () => {
        await cleanDatabase();
    })

    afterEach(async () => {
        await cleanDatabase();
    })

    it('should create a new account', async () => {
        const response = await supertestApp
            .post("/accounts")
            .set("Accept", "application/json")
            .set("Content-Type", "application/json")
            .send({owner: OWNER});

        expect(response.status).toEqual(200);
        expect(response.body.accountId.length).toBeGreaterThan(0);
        expect(response.body.message).toEqual("Account created.");
    });

    it('should get an existing account', async () => {
        const accountId = await createAccount();

        const response = await getAccount(accountId);

        expect(response.status).toEqual(200);
        expect(response.body.owner).toEqual(OWNER);
        expect(response.body.balance).toEqual(0);
        expect(response.body.currency).toEqual("EUR");
    });

    it('should make a deposit', async () => {
        const accountId = await createAccount();

        const response = await makeDeposit(accountId, "1.50");

        expect(response.status).toEqual(200);
        expect(response.body.message).toEqual(`Account ${accountId} updated.`);
    });

    it('should make a withdraw', async () => {
        const accountId = await createAccount();
        await makeDeposit(accountId, "3.50");
        const response = await makeWithdraw(accountId, "1.10");

        expect(response.status).toEqual(200);
        expect(response.body.message).toEqual(`Account ${accountId} updated.`);
    });

    it('should get the balance of the account', async () => {
        const accountId = await createAccount();
        await makeDeposit(accountId, "3.50");
        await makeWithdraw(accountId, "1.10");

        const response = await getAccount(accountId);

        expect(response.status).toEqual(200);
        expect(response.body.owner).toEqual(OWNER);
        expect(response.body.balance).toEqual(2.4);
        expect(response.body.currency).toEqual("EUR");
    });

    it('should get the balance of the account in JPY', async () => {
        const accountId = await createAccount();
        await makeDeposit(accountId, "3.50");
        await makeWithdraw(accountId, "1.10");

        const response = await getAccountInJPY(accountId);

        expect(response.status).toEqual(200);
        expect(response.body.owner).toEqual(OWNER);
        expect(response.body.balance).toBeGreaterThan(2.4);
        expect(response.body.currency).toEqual("JPY");
    });

    it('should not get a non existing account', async () => {
        const response = await getAccount(NON_EXISTING_ACCOUNT_ID);

        expect(response.status).toEqual(500);
        expect(response.body.error).toEqual(`Account '${NON_EXISTING_ACCOUNT_ID}' not found!`);
    });

    it('should not deposit into a non existing account', async () => {
        const response = await makeDeposit(NON_EXISTING_ACCOUNT_ID, "1");

        expect(response.status).toEqual(500);
        expect(response.body.error).toEqual(`Account '${NON_EXISTING_ACCOUNT_ID}' not found!`);
    });

    it('should not withdraw from a non existing account', async () => {
        const response = await makeWithdraw(NON_EXISTING_ACCOUNT_ID, "1");

        expect(response.status).toEqual(500);
        expect(response.body.error).toEqual(`Account '${NON_EXISTING_ACCOUNT_ID}' not found!`);
    });

    async function createAccount() {
        const response = await supertestApp
            .post("/accounts")
            .set("Accept", "application/json")
            .set("Content-Type", "application/json")
            .send({owner: OWNER});
        return response.body.accountId;
    }

    async function getAccount(accountId: string) {
        return supertestApp
            .get(`/accounts/${accountId}`)
            .set("Accept", "application/json");
    }

    async function getAccountInJPY(accountId: string) {
        return supertestApp
            .get(`/accounts/${accountId}?currency=JPY`)
            .set("Accept", "application/json")
            .set("Content-Type", "application/json")
            .send();
    }

    async function makeDeposit(accountId: string, amount: string) {
        return supertestApp
            .post(`/accounts/${accountId}/deposit`)
            .set("Accept", "application/json")
            .set("Content-Type", "application/json")
            .send({amount});
    }

    async function makeWithdraw(accountId: string, amount: string) {
        return supertestApp
            .post(`/accounts/${accountId}/withdraw`)
            .set("Accept", "application/json")
            .set("Content-Type", "application/json")
            .send({amount});
    }

    async function cleanDatabase() {
        const mongoClient = new MongoClient(MONGO_URL);
        await mongoClient.connect();
        await mongoClient.db(DATABASE_NAME).collection(ACCOUNTS_COLLECTION).drop();
    }
})