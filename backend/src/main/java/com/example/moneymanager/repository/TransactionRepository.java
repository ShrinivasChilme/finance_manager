package com.example.moneymanager.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.moneymanager.model.Transaction;
import com.example.moneymanager.model.User;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findByUser(User user);
    List<Transaction> findByUserUsername(String username);
}
