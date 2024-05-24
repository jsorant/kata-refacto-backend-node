import {describe, expect, it} from "vitest";
import {Application} from "../src/Application";
import {RatesProvider} from "../src/RatesProvider";
import {InMemoryAccounts} from "../src/InMemoryAccounts";
import supertest from "supertest";
import {mock} from "vitest-mock-extended";

const OWNER = "John Doe";
const NON_EXISTING_ACCOUNT_ID = "non-existing-id";

//TODO handle account id with wrong format

describe("Accounts", () => {
    const ratesProvider = mock<RatesProvider>();
    const accounts = new InMemoryAccounts();
    const app = new Application(ratesProvider, accounts);
    const supertestApp = supertest(app.expressApp);

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
        ratesProvider.getRateFrom.mockResolvedValue(10);
        const accountId = await createAccount();
        await makeDeposit(accountId, "3.50");
        await makeWithdraw(accountId, "1.10");

        const response = await getAccountInJPY(accountId);

        expect(response.status).toEqual(200);
        expect(response.body.owner).toEqual(OWNER);
        expect(response.body.balance).toEqual(24);
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
})