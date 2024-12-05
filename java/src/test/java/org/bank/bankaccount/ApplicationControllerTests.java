package org.bank.bankaccount;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class ApplicationControllerTests {

    @Autowired
    private TestRestTemplate restTemplate;


	@Test
	void shouldCreateANewAccount() {
        HttpHeaders headers = new HttpHeaders();
        headers.setAccept(List.of(MediaType.APPLICATION_JSON));
        headers.setContentType(MediaType.APPLICATION_JSON);
        // use headers.set(…) to add headers to the request
        String requestJson = "{}"; // Request body
        HttpEntity<String> body = new HttpEntity<>(requestJson, headers);
        ResponseEntity<String> response = restTemplate.postForEntity("/accounts", body,String.class);

        // Make assertions on 'response.getStatusCode()' and 'response.getBody()'
        // Response body example:
        // {
        //     "accountId": "6645b7ae2d4e3ffe018f0ba2",
        //     "message": "Account created."
        // }
        assertThat(true).isFalse();
	}

    @Test
    @Disabled
    void shouldGetAnExistingAccount() {
        // Implement this test
        // Response body example:
        // {
        //     "owner": "John Doe",
        //     "balance": 2.5,
        //     "currency": "EUR"
        // }
    }

}
