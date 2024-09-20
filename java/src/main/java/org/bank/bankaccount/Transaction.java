package org.bank.bankaccount;

import java.util.Date;

public record Transaction(Date date, String type, Double amount) {
}
