import {Application} from "./Application";
import {FrankfurterRatesProvider} from "./FrankfurterRatesProvider";
import {MongoDbAccounts} from "./MongoDbAccounts";

const ratesProvider = new FrankfurterRatesProvider();
const accounts = new MongoDbAccounts();
const application = new Application(ratesProvider, accounts);
application.start(3000);