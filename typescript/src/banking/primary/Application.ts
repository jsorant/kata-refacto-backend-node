import express, {Express, NextFunction, Request, Response} from "express";
import {CreateAccount} from "../domain/features/CreateAccount";
import {ComputeBalance, Currency} from "../domain/features/ComputeBalance";
import {MakeDeposit} from "../domain/features/MakeDeposit";
import {MakeWithdraw} from "../domain/features/MakeWithdraw";
import {AccountId} from "../domain/model/Account";
import {Amount} from "../domain/model/Amount";

export class Application {
    public expressApp: Express = express();

    private readonly createAccount: CreateAccount;
    private readonly computeBalance: ComputeBalance;
    private readonly makeDeposit: MakeDeposit;
    private readonly makeWithdraw: MakeWithdraw;

    constructor(createAccount: CreateAccount, computeBalance: ComputeBalance, makeDeposit: MakeDeposit, makeWithdraw: MakeWithdraw) {
        this.createAccount = createAccount;
        this.computeBalance = computeBalance;
        this.makeDeposit = makeDeposit;
        this.makeWithdraw = makeWithdraw;

        this.expressApp.use(express.json())

        this.expressApp.get("/accounts/:id", async (req: Request, res: Response, next: NextFunction) => {
            const id: AccountId = req.params.id;
            const currency: Currency = req.query.currency === "JPY" ? Currency.JPY : Currency.EUR;

            try {
                const accountBalance = await this.computeBalance.act(id, currency);

                res.send({
                    owner: accountBalance.owner,
                    balance: accountBalance.balance,
                    currency: accountBalance.currency === Currency.JPY ? "JPY" : "EUR"
                });
            } catch (e) {
                next(e);
            }
        });

        this.expressApp.post("/accounts", async (req: Request, res: Response) => {
            const owner = req.body.owner;

            const newAccount = await this.createAccount.act(owner);

            res.json({
                accountId: newAccount.id,
                message: "Account created."
            })
        });

        this.expressApp.post("/accounts/:id/deposit", async (req: Request, res: Response, next: NextFunction) => {
            const id = req.params.id;
            const amount: number = parseFloat(req.body.amount);

            try {
                await this.makeDeposit.act(id, new Amount(amount));

                res.json({
                    message: `Account ${id} updated.`
                })
            } catch (e) {
                next(e);
            }
        });

        this.expressApp.post("/accounts/:id/withdraw", async (req: Request, res: Response, next: NextFunction) => {
            const id = req.params.id;
            const amount: number = parseFloat(req.body.amount);

            try {
                await this.makeWithdraw.act(id, new Amount(amount));

                res.json({
                    message: `Account ${id} updated.`
                })
            } catch (e) {
                next(e);
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

