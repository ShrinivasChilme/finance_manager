package com.example.moneymanager.controller;

import com.example.moneymanager.model.Transaction;
import com.example.moneymanager.model.TransactionType;
import com.example.moneymanager.model.User;
import com.example.moneymanager.service.TransactionService;
import com.example.moneymanager.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/dashboard")
public class DashboardController {

    @Autowired
    private TransactionService transactionService;
    @Autowired
    private UserService userService;

    @GetMapping("/summary")
    public ResponseEntity<?> getSummary(Authentication authentication) {
        User user = userService.findByUsername(authentication.getName()).orElse(null);
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        List<Transaction> transactions = transactionService.getTransactionsByUser(user);
        double totalIncome = transactions.stream().filter(t -> t.getType() == TransactionType.INCOME).mapToDouble(Transaction::getAmount).sum();
        double totalExpense = transactions.stream().filter(t -> t.getType() == TransactionType.EXPENSE).mapToDouble(Transaction::getAmount).sum();
        double balance = totalIncome - totalExpense;
        Map<String, Object> summary = new HashMap<>();
        summary.put("totalIncome", totalIncome);
        summary.put("totalExpense", totalExpense);
        summary.put("balance", balance);
        summary.put("recentTransactions", transactions.stream().limit(10).toList());
        return ResponseEntity.ok(summary);
    }
}
