import {GenericContainer, StartedTestContainer} from "testcontainers";
import {MongoClient} from "mongodb";

const DATABASE_NAME = 'Banking';
const MONGO_PORT = 27017;

export class MongoDbContainer {
    private container: StartedTestContainer;
    public readonly mongoUrl: string;

    static async startMongoContainer(): Promise<MongoDbContainer> {
        const container: StartedTestContainer = await new GenericContainer('mongo:7.0.6')
            .withExposedPorts(MONGO_PORT)
            .start();

        return new MongoDbContainer(container);
    }

    private constructor(container: StartedTestContainer) {
        this.container = container;
        this.mongoUrl = `mongodb://localhost:${this.container.getMappedPort(MONGO_PORT)}`;
    }

    async clearDatabase(): Promise<void> {
        const mongoClient = new MongoClient(this.mongoUrl);
        await mongoClient.connect();
        await mongoClient.db(DATABASE_NAME).dropDatabase();
    }

    async stop(): Promise<void> {
        await this.container.stop();
    }
}