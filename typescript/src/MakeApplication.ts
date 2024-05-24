import {FrankfurterRatesProvider} from "./rates/FrankfurterRatesProvider";
import {MongoDbAccounts} from "./persistence/MongoDbAccounts";
import {CreateAccount} from "./domain/CreateAccount";
import {ComputeBalance} from "./domain/ComputeBalance";
import {MakeDeposit} from "./domain/MakeDeposit";
import {MakeWithdraw} from "./domain/MakeWithdraw";
import {Application} from "./server/Application";

export function makeApplication() {
    const ratesProvider = new FrankfurterRatesProvider();
    const accounts = new MongoDbAccounts();

    const createAccount = new CreateAccount(accounts);
    const computeBalance = new ComputeBalance(accounts, ratesProvider);
    const makeDeposit = new MakeDeposit(accounts);
    const makeWithdraw = new MakeWithdraw(accounts);

    return new Application(createAccount, computeBalance, makeDeposit, makeWithdraw);
}