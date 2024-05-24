import express, {Express, NextFunction, Request, Response} from "express";
import {RatesProvider} from "./RatesProvider";
import {Accounts} from "./Accounts";
import {Account} from "./Account";
import {randomUUID} from "node:crypto";

export class Application {
    public expressApp: Express = express();

    private ratesProvider;
    private accounts;

    constructor(ratesProvider: RatesProvider, accounts: Accounts) {
        this.ratesProvider = ratesProvider;
        this.accounts = accounts;
        this.expressApp.use(express.json())

        // Get an account
        this.expressApp.get("/accounts/:id", async (req: Request, res: Response, next: NextFunction) => {
            const id = req.params.id;

            const account = await this.accounts.getById(id);

            if (account === undefined) {
                next(new Error(`Account '${id}' not found!`));
            } else {

                let balance = account.transactions.reduce((acc: number, val: any) => {
                    if (val.type === "deposit") return acc + val.amount;
                    if (val.type === "withdraw") return acc - val.amount;
                }, 0);
                let currency = "EUR";

                // Get JPY account value
                if (req.query.currency && req.query.currency === "JPY") {
                    const rate = await this.ratesProvider.getRateFrom("EUR", "JPY");
                    balance = balance * rate;
                    currency = "JPY"
                }

                res.send({
                    owner: account.owner,
                    balance,
                    currency
                });
            }
        });

        // Create a new account
        this.expressApp.post("/accounts", async (req: Request, res: Response) => {
            // TODO cannot have Two accounts for the same user
            const owner = req.body.owner;

            const accountId = `account-${randomUUID()}`;
            const newAccount = new Account(accountId, owner);
            await this.accounts.save(newAccount);

            res.json({
                accountId: newAccount.id,
                message: "Account created."
            })
        });

        // Deposit
        this.expressApp.post("/accounts/:id/deposit", async (req: Request, res: Response, next: NextFunction) => {
            const id = req.params.id;

            const account = await this.accounts.getById(id);

            if (account === undefined) {
                next(new Error(`Account '${id}' not found!`));
            } else {
                //TODO amount must be > 0
                const newTransactions = [...account.transactions, {
                    date: Date.now(),
                    type: "deposit",
                    amount: parseFloat(req.body.amount)
                }];

                await this.accounts.updateTransactionsOf(id, newTransactions);

                res.json({
                    message: `Account ${id} updated.`
                })
            }
        });

        // Withdraw
        this.expressApp.post("/accounts/:id/withdraw", async (req: Request, res: Response, next: NextFunction) => {
            const id = req.params.id;

            const account = await this.accounts.getById(id);

            if (account === undefined) {
                next(new Error(`Account '${id}' not found!`));
            } else {
                //TODO amount must be > 0
                //TODO balance must be > 0
                const newTransactions = [...account.transactions, {
                    date: Date.now(),
                    type: "withdraw",
                    amount: parseFloat(req.body.amount)
                }];

                await this.accounts.updateTransactionsOf(id, newTransactions);

                res.json({
                    message: `Account ${id} updated.`
                })
            }
        });

        this.expressApp.use(this.handleError)
    }

    private handleError(err: Error, req: Request, res: Response, next: NextFunction): void {
        res.status(500).json({error: err.message});
    }

    start(port: number): void {
        this.expressApp.listen(port, () => {
            console.log(`[server]: Server is running at http://localhost:${port}`);
        });
    }
}


