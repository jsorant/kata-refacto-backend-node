import {FrankfurterRatesProvider} from "./banking/secondary/FrankfurterRatesProvider";
import {MongoDbAccounts} from "./banking/secondary/MongoDbAccounts";
import {CreateAccount} from "./banking/domain/features/CreateAccount";
import {ComputeBalance} from "./banking/domain/features/ComputeBalance";
import {MakeDeposit} from "./banking/domain/features/MakeDeposit";
import {MakeWithdraw} from "./banking/domain/features/MakeWithdraw";
import {Application} from "./banking/primary/Application";

const MONGO_URL = 'mongodb://localhost:27017';

export function makeApplication() {
    const ratesProvider = new FrankfurterRatesProvider();
    const accounts = new MongoDbAccounts(MONGO_URL);

    const createAccount = new CreateAccount(accounts);
    const computeBalance = new ComputeBalance(accounts, ratesProvider);
    const makeDeposit = new MakeDeposit(accounts);
    const makeWithdraw = new MakeWithdraw(accounts);

    return new Application(createAccount, computeBalance, makeDeposit, makeWithdraw);
}