package org.bank.bankaccount;

import com.mongodb.BasicDBObject;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.model.Updates;
import org.bson.Document;
import org.bson.json.JsonWriterSettings;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestClient;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.stream.Collectors;

import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

@RestController
@RequestMapping(consumes = APPLICATION_JSON_VALUE, produces = APPLICATION_JSON_VALUE)
public class ApplicationController {

    private final MongoTemplate mongoTemplate;

    public ApplicationController(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    /**
     * For tests/debug
     */
    @GetMapping("/")
    public String getAllAccounts() {
        Collection<Document> findResult = new ArrayList<>();
        this.accountsCollection().find().into(findResult);
        var json = documentListToJson(findResult);
        System.out.println("Found documents =>" + json);

        return "{\"accounts\": " + json + "}";
    }

    @GetMapping(value = "/accounts/{id}")
    public String getAnAccount(@PathVariable String id, @RequestParam(name = "currency", required = false) String requestCurrency) {
        // Find the account
        var query = new BasicDBObject();
        query.put("_id", new ObjectId(id));
        var findResult = this.accountsCollection().find(query).first();
        var json = documentToJson(findResult);
        System.out.println("Found documents =>" + json);

        if (json == null) {
            throw new RuntimeException("Account '" + id+ "' not found!");
        } else {
            var list = findResult.getList("transactions", Document.class);
            var balance = list.stream().reduce(0.0, (acc, val) -> {
                if (val.get("type").equals("deposit")){
                    return acc + val.getDouble("amount");
                }
                if(val.get("type").equals("withdraw")) {
                    return acc - val.getDouble("amount");
                }
                return 0.0;
            }, (left, _unused) -> left);
            var currency = "EUR";

            // Get JPY account value
            if (requestCurrency != null && requestCurrency.equals("JPY")) {
                var host = "api.frankfurter.app";
                var data = RestClient.builder().baseUrl("https://" + host).build().get().uri("/latest?amount=1&from=EUR&to=JPY").retrieve().body(FrankFurterJson.class);
                balance = balance * data.rates().get("JPY");
                currency = "JPY";
            }

            return "{\"owner\": \"Jérémy Sorant\", \"balance\": " + balance + ", \"currency\": \"" + currency + "\"}";
        }
    }

    @PostMapping(value = "/accounts")
    public String createANewAccount(@RequestBody JsonCreateAccount requestbody) {
        // TODO cannot have Two accounts for the same user
        var collection = this.accountsCollection();
        // Create the new account
        var insertResult = collection.insertOne(Document.parse("{\"owner\": \"" + requestbody.owner() + "\", \"transactions\": []}"));
        System.out.println("Inserted documents => " + insertResult);

        return "{\"accountId\": \"" + insertResult.getInsertedId().asObjectId().getValue() + "\", \"message\": \"Account created.\"}";
    }

    @PostMapping(value = "/accounts/{id}/deposit")
    public String deposit(@PathVariable String id, @RequestBody JsonAmount requestBody) {
        var query = new BasicDBObject();
        query.put("_id", new ObjectId(id));
        var collection = this.accountsCollection();
        var findResult = collection.find(query).first();

        if (findResult == null) {
            throw new RuntimeException("Account '" + id + "' not found!");
        } else {
            System.out.println("Found documents documents => " + documentToJson(findResult));
            //TODO amount must be > 0
            var newTransactions = new ArrayList<>(findResult.getList("transactions", Document.class));
            newTransactions.add(Document.parse("{\"date\": \"" + new Date().getTime() + "\", \"type\": \"deposit\", \"amount\": " + requestBody.amount() + "}"));
            //Update the account
            var updateResult = collection.updateOne(query, Updates.set("transactions", newTransactions));
            System.out.println("Update documents => " + updateResult);
            return "{\"message\": \"Account " + id + " updated.\"}";
        }
    }

    @PostMapping(value = "/accounts/{id}/withdraw")
    public String withdraw(@PathVariable String id, @RequestBody JsonAmount requestBody) {
        var query = new BasicDBObject();
        query.put("_id", new ObjectId(id));
        var collection = this.accountsCollection();
        var findResult = collection.find(query).first();

        if (findResult == null) {
            throw new RuntimeException("Account '" + id + "' not found!");
        } else {
            System.out.println("Found documents documents => " + documentToJson(findResult));
            //TODO amount must be > 0
            //TODO balance must be > 0
            var newTransactions = new ArrayList<>(findResult.getList("transactions", Document.class));
            newTransactions.add(Document.parse("{\"date\": \"" + new Date().getTime() + "\", \"type\": \"withdraw\", \"amount\": " + requestBody.amount() + "}"));
            //Update the account
            var updateResult = collection.updateOne(query, Updates.set("transactions", newTransactions));
            System.out.println("Update documents => " + updateResult);
            return "{\"message\": \"Account " + id + " updated.\"}";
        }
    }

    private MongoCollection<Document> accountsCollection() {
        return this.mongoTemplate.getCollection("accounts");
    }

    private static String documentToJson(Document document) {
        if(document == null) {
            return null;
        }
        document.put("_id", document.getObjectId("_id").toString());
        return document.toJson(JsonWriterSettings.builder().build());
    }

    private static String documentListToJson(Collection<Document> results) {
        return "[" + results.stream().map(ApplicationController::documentToJson).collect(Collectors.joining(", ")) + "]";
    }
}
