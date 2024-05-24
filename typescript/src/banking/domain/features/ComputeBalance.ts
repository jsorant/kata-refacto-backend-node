import {AccountsRepository} from "../ports/AccountsRepository";
import {RatesProvider} from "../ports/RatesProvider";

export enum Currency {
    EUR,
    JPY
}

export interface AccountBalance {
    owner: string;
    balance: number;
    currency: Currency;
}

export class ComputeBalance {
    private readonly accounts: AccountsRepository;
    private readonly ratesProvider: RatesProvider;

    constructor(accounts: AccountsRepository, ratesProvider: RatesProvider) {
        this.accounts = accounts;
        this.ratesProvider = ratesProvider;
    }

    async act(id: string, targetCurrency: Currency): Promise<AccountBalance> {
        const account = await this.accounts.getById(id);

        if (account === undefined) {
            throw new Error(`Account '${id}' not found!`);
        }

        let balance = account.balance();

        // Get JPY account value
        if (targetCurrency === Currency.JPY) {
            const rate = await this.ratesProvider.getRateFrom("EUR", "JPY");
            balance = balance * rate;
        }

        return {
            owner: account.owner,
            balance,
            currency: targetCurrency
        };
    }
}