package com.example.moneymanager.service;

import com.example.moneymanager.model.Transaction;
import com.example.moneymanager.model.User;
import com.example.moneymanager.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;

    public List<Transaction> getTransactionsByUser(User user) {
        return transactionRepository.findByUser(user);
    }

    public Transaction saveTransaction(Transaction transaction) {
        return transactionRepository.save(transaction);
    }

    public Optional<Transaction> getTransactionById(Long id) {
        return transactionRepository.findById(id);
    }

    public void deleteTransaction(Long id) {
        transactionRepository.deleteById(id);
    }

    public List<Transaction> findByUsername(String username) {
        return transactionRepository.findByUserUsername(username);
    }

    // Monthly transactions method
    public List<Transaction> getTransactionsByUserAndDateRange(User user, LocalDate startDate, LocalDate endDate) {
        return transactionRepository.findByUserAndDateBetween(user, startDate, endDate);
    }
}