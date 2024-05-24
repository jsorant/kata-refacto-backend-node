import {describe, expect, it} from "vitest";
import {Amount} from "../../src/banking/domain/model/Amount";
import {Account} from "../../src/banking/domain/model/Account";

describe("Account", () => {
    it('should not withdraw if balance becomes negative', async () => {
        const account = new Account("an_id", "an_owner");
        account.addDeposit(new Amount(2));

        expect(() => account.addWithdraw(new Amount(5)))
            .toThrowError("Balance cannot become negative!");
    });
});