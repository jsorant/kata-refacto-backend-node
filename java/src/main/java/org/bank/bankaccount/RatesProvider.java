package org.bank.bankaccount;

public interface RatesProvider {
    Double get(String from, String to);
}
