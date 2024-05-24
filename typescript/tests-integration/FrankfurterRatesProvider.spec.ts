import {describe, expect, it} from "vitest";
import {FrankfurterRatesProvider} from "../src/banking/secondary/FrankfurterRatesProvider";

describe("FrankfurterRatesProvider", () => {
    it("should get rate from EUR to JPY", async () => {
        const ratesProvider = new FrankfurterRatesProvider();

        const rate = await ratesProvider.getRateFrom("EUR", "JPY");

        expect(rate).toBeGreaterThan(0);
    })
})