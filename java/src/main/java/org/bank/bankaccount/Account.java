package org.bank.bankaccount;

import java.util.List;

public record Account(List<Transaction> transations, String owner) {
}
