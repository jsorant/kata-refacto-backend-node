import {Accounts} from "../persistence/Accounts";
import {RatesProvider} from "../rates/RatesProvider";

export interface AccountBalance {
    owner: string;
    balance: number;
    currency: string;
}

export class ComputeBalance {
    private readonly accounts: Accounts;
    private readonly ratesProvider: RatesProvider;

    constructor(accounts: Accounts, ratesProvider: RatesProvider) {
        this.accounts = accounts;
        this.ratesProvider = ratesProvider;
    }

    async act(id: string, targetCurrency: string): Promise<AccountBalance> {
        const account = await this.accounts.getById(id);

        if (account === undefined) {
            throw new Error(`Account '${id}' not found!`);
        }

        let balance = account.transactions.reduce((acc: number, val: any) => {
            if (val.type === "deposit") return acc + val.amount;
            if (val.type === "withdraw") return acc - val.amount;
        }, 0);
        let currency = "EUR";

        // Get JPY account value
        if (targetCurrency === "JPY") {
            const rate = await this.ratesProvider.getRateFrom("EUR", "JPY");
            balance = balance * rate;
            currency = "JPY"
        }

        return {
            owner: account.owner,
            balance,
            currency
        };
    }
}