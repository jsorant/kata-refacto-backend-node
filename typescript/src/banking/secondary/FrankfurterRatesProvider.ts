import {RatesProvider} from "../domain/ports/RatesProvider";

export class FrankfurterRatesProvider implements RatesProvider {
    async getRateFrom(fromCurrency: string, toCurrency: string) {
        const host = 'api.frankfurter.app';
        const resp = await fetch(`https://${host}/latest?amount=1&from=${fromCurrency}&to=${toCurrency}`);
        const data = await resp.json();
        return data.rates[toCurrency];
    }
}