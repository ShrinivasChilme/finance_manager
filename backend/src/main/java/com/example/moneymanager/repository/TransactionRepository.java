package com.example.moneymanager.repository;

import com.example.moneymanager.model.Transaction;
import com.example.moneymanager.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findByUser(User user);
}
