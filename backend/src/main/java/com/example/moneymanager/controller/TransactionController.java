package com.example.moneymanager.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.moneymanager.model.Transaction;
import com.example.moneymanager.model.User;
import com.example.moneymanager.service.TransactionService;
import com.example.moneymanager.service.UserService;

@RestController
@RequestMapping("/transactions")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;
    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<List<Transaction>> getTransactions(Authentication authentication) {
        User user = userService.findByUsername(authentication.getName()).orElse(null);
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(transactionService.getTransactionsByUser(user));
    }

    @PostMapping
    public ResponseEntity<Transaction> addTransaction(@RequestBody Transaction transaction, Authentication authentication) {
        User user = userService.findByUsername(authentication.getName()).orElse(null);
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        transaction.setUser(user);
        return ResponseEntity.ok(transactionService.saveTransaction(transaction));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Transaction> updateTransaction(@PathVariable Long id, @RequestBody Transaction transaction, Authentication authentication) {
        User user = userService.findByUsername(authentication.getName()).orElse(null);
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        Transaction existing = transactionService.getTransactionById(id).orElse(null);
        if (existing == null || !existing.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(404).build();
        }
        transaction.setId(id);
        transaction.setUser(user);
        return ResponseEntity.ok(transactionService.saveTransaction(transaction));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTransaction(@PathVariable Long id, Authentication authentication) {
        User user = userService.findByUsername(authentication.getName()).orElse(null);
        Transaction existing = transactionService.getTransactionById(id).orElse(null);
        if (existing == null || !existing.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(404).build();
        }
        transactionService.deleteTransaction(id);
        return ResponseEntity.ok().build();
    }
}
