import {RatesProvider} from "./RatesProvider";

export class FrankfurterRatesProvider implements RatesProvider {
    async getRateFrom(fromCurrency: string, toCurrency: string) {
        const host = 'api.frankfurter.dev';
        const resp = await fetch(`https://${host}/v1/latest?amount=1&from=${fromCurrency}&to=${toCurrency}`);
        const data = await resp.json();
        return data.rates[toCurrency];
    }
}