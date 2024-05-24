export interface RatesProvider {
    getRateFrom(fromCurrency: string, toCurrency: string): Promise<number>;
}