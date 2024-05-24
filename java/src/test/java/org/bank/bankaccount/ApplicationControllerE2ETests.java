package org.bank.bankaccount;

import org.json.JSONException;
import org.json.JSONObject;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.http.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class ApplicationControllerE2ETests {
    private static final String OWNER = "Anthony Rey";
    private static final String NON_EXISTING_ACCOUNT_ID = "1635fb7d8b1a07dd83cafa31";

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private MongoTemplate mongoTemplate;

    @AfterEach
    void clearDataBase() {
        mongoTemplate.getDb().getCollection("accounts").drop();
    }

	@Test
	void shouldCreateANewAccount() throws JSONException {
        ResponseEntity<String> response = createAccountResponse();

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        JSONObject json = toJsonBody(response);
        assertThat(json.getString("accountId")).isNotBlank();
        assertThat(json.getString("message")).isEqualTo("Account created.");
	}

    @Test
    void shouldGetAnExistingAccount() throws JSONException {
        String accountId = createAccount();

        ResponseEntity<String> response = getAccountResponse(accountId);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        JSONObject json = toJsonBody(response);
        assertThat(json.getString("owner")).isEqualTo(OWNER);
        assertThat(json.getDouble("balance")).isEqualTo(0.0);
        assertThat(json.getString("currency")).isEqualTo("EUR");
    }

    @Test
    void shouldMakeADeposit() throws JSONException {
        String accountId = createAccount();

        ResponseEntity<String> response = makeDepositResponse(accountId, "1.50");

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        JSONObject result = toJsonBody(response);
        assertThat(result.getString("message")).isEqualTo("Account "  + accountId +" updated.");
    }

    @Test
    void shouldMakeAWithdrawal() throws JSONException {
        String accountId = createAccount();
        makeDepositResponse(accountId, "3.50");

        ResponseEntity<String> response = makeWithdrawalResponse(accountId, "1.10");

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        JSONObject result = toJsonBody(response);
        assertThat(result.getString("message")).isEqualTo("Account "  + accountId +" updated.");
    }

    @Test
    void shouldGetTheBalanceOfTheAccount() throws JSONException {
        String accountId = createAccount();
        makeDepositResponse(accountId, "3.50");
        makeWithdrawalResponse(accountId, "1.10");

        ResponseEntity<String> response = getAccountResponse(accountId);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        JSONObject body = toJsonBody(response);
        assertThat(body.getString("owner")).isEqualTo(OWNER);
        assertThat(body.getDouble("balance")).isEqualTo(2.4);
        assertThat(body.getString("currency")).isEqualTo("EUR");
    }

    @Test
    void shouldGetBalanceOfTheAccountInJPY() throws JSONException {
        String accountId = createAccount();
        makeDepositResponse(accountId, "3.50");
        makeWithdrawalResponse(accountId, "1.10");

        ResponseEntity<String> response = getAccountInJPYResponse(accountId);

        JSONObject body = toJsonBody(response);
        assertThat(body.getDouble("balance")).isGreaterThan(2.4);
        assertThat(body.getString("currency")).isEqualTo("JPY");
    }

    @Test
    void shouldNotGetANonExistingAccount() throws JSONException {
        ResponseEntity<String> response = getAccountResponse(NON_EXISTING_ACCOUNT_ID);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR);
        JSONObject body = toJsonBody(response);
        assertThat(body.getString("message")).isEqualTo("Account '" + NON_EXISTING_ACCOUNT_ID + "' not found!");
    }

    @Test
    void shouldNotMakeADepositIntoANonExistingAccount() throws JSONException {
        ResponseEntity<String> response = makeDepositResponse(NON_EXISTING_ACCOUNT_ID, "1");

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR);
        JSONObject body = toJsonBody(response);
        assertThat(body.getString("message")).isEqualTo("Account '" + NON_EXISTING_ACCOUNT_ID + "' not found!");
    }

    @Test
    void shouldNotWithdrawFromANonExistingAccount() throws JSONException {
        ResponseEntity<String> response = makeWithdrawalResponse(NON_EXISTING_ACCOUNT_ID, "1");

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR);
        JSONObject body = toJsonBody(response);
        assertThat(body.getString("message")).isEqualTo("Account '" + NON_EXISTING_ACCOUNT_ID + "' not found!");
    }

    private ResponseEntity<String> createAccountResponse() throws JSONException {
        JSONObject json = new JSONObject();
        json.put("owner", OWNER);
        HttpEntity<String> body = new HttpEntity<>(json.toString(), httpHeaders());
        return restTemplate.postForEntity("/accounts", body, String.class);
    }

    private String createAccount() throws JSONException {
        return new JSONObject(createAccountResponse().getBody()).getString("accountId");
    }

    private ResponseEntity<String> getAccountResponse(String accountId) {
        HttpEntity<Void> headers = new HttpEntity<>(httpHeaders());
        return restTemplate.exchange("/accounts/" + accountId, HttpMethod.GET, headers, String.class);
    }

    private ResponseEntity<String> getAccountInJPYResponse(String accountId) {
        HttpEntity<Void> headers = new HttpEntity<>(httpHeaders());
        String uri = UriComponentsBuilder.fromPath("/accounts/{accountId}").queryParam("currency", "{currency}").encode().toUriString();

        return restTemplate.exchange(
                uri,
                HttpMethod.GET,
                headers,
                String.class,
                Map.of("accountId", accountId,"currency", "JPY")
        );
    }

    private ResponseEntity<String> makeDepositResponse(String accountId, String amount) throws JSONException {
        JSONObject json = new JSONObject().put("amount", amount);
        HttpEntity<String> body = new HttpEntity<>(json.toString(), httpHeaders());
        return restTemplate.postForEntity("/accounts/" + accountId + "/deposit", body, String.class);
    }

    private ResponseEntity<String> makeWithdrawalResponse(String accountId, String amount) throws JSONException {
        JSONObject json = new JSONObject().put("amount", amount);
        HttpEntity<String> body = new HttpEntity<>(json.toString(), httpHeaders());
        return restTemplate.postForEntity("/accounts/" + accountId + "/withdraw", body, String.class);
    }

    private static JSONObject toJsonBody(ResponseEntity<String> response) throws JSONException {
        return new JSONObject(response.getBody());
    }

    private static HttpHeaders httpHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setAccept(List.of(MediaType.APPLICATION_JSON));
        headers.setContentType(MediaType.APPLICATION_JSON);
        return headers;
    }
}
