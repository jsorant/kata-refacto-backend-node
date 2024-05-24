import {describe, expect, it} from "vitest";
import {Account} from "../../src/domain/Account";

describe("Account", () => {
    it('should not withdraw if balance becomes negative', async () => {
        const account = new Account("an_id", "an_owner");
        // make a deposit into the account

        expect(() => {
            // make a withdraw that would make the balance negative
        }).toThrowError("Balance cannot become negative!");
    });
});