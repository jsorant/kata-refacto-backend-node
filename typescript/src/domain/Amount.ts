export class Amount {
    readonly value: number;

    constructor(value: number) {
        this.ensureValueIsPositive(value);
        this.value = value;
    }

    private ensureValueIsPositive(value: number) {
        if (value < 0) throw new Error("Amount must be positive!");
    }
}