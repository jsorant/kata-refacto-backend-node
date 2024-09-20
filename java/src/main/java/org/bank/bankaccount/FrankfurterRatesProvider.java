package org.bank.bankaccount;

import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

@Component
public class FrankfurterRatesProvider implements RatesProvider {

    public static final String FRANKFURTER_APP = "api.frankfurter.app";

    @Override
    public Double get(String from, String to) {
        String uri = "/latest?amount=1&from=" + from + "&to=" + to;
        var data = RestClient.builder().baseUrl("https://" + FRANKFURTER_APP).build().get().uri(uri).retrieve().body(FrankFurterJson.class);
        return data.rates().get(to);
    }
}
