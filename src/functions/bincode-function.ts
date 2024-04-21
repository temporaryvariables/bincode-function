import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { CosmosClient } from "@azure/cosmos";

const endpoint = process.env.COSMOS_DB_ENDPOINT;
const key = process.env.COSMOS_DB_KEY;
const databaseId = "Items";
const containerId = "Items";

const client = new CosmosClient({ endpoint, key });
const database = client.database(databaseId);
const container = database.container(containerId);

export async function bincodefunction(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log('JavaScript HTTP trigger function processed a request.');
    context.log(request);

    if (request.body) {
        try {
            const { resource: createdItem } = await container.items.create(request.body);
            return {
                status: 201,
                body: createdItem
            };
        } catch (err) {
            context.log(err)
            return {
                status: 500,
                body: `Failed to create item. Error: ${err.message}`
            };
        }
    } else {
        return {
            status: 400,
            body: "Please pass a document in the request body"
        };
    }
};

app.http('bincode-function', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: bincodefunction
});
