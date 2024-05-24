import {RatesProvider} from "../domain/ports/RatesProvider";

const HOST = 'https://api.frankfurter.dev';

export class FrankfurterRatesProvider implements RatesProvider {
    async getRateFrom(fromCurrency: string, toCurrency: string) {
        const response = await fetch(`${HOST}/v1/latest?amount=1&from=${fromCurrency}&to=${toCurrency}`);

        const body = await response.json();

        return body.rates[toCurrency];
    }
}