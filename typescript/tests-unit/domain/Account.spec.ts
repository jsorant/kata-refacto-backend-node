import {describe, expect, it} from "vitest";
import {Amount} from "../../src/domain/Amount";
import {Account} from "../../src/domain/Account";

describe("Account", () => {
    it('should not withdraw if balance becomes negative', async () => {
        const account = new Account("an_id", "an_owner");
        account.addDeposit(new Amount(2));

        expect(() => account.addWithdraw(new Amount(5)))
            .toThrowError("Balance cannot become negative!");
    });
});