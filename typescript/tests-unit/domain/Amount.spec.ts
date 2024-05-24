import {describe, expect, it} from "vitest";
import {Amount} from "../../src/domain/Amount";

describe("Amount", () => {
    it('should create an amount', async () => {
        const amount = new Amount(1);
        expect(amount.value).toBe(1);
    });

    it('should not create an amount with a negative value', async () => {
        expect(() => new Amount(-1)).toThrowError("Amount must be positive!");
    });
});