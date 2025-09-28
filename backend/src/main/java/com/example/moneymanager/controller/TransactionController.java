// package com.example.moneymanager.controller;

// import java.util.List;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.http.ResponseEntity;
// import org.springframework.security.core.Authentication;
// import org.springframework.web.bind.annotation.DeleteMapping;
// import org.springframework.web.bind.annotation.GetMapping;
// import org.springframework.web.bind.annotation.PathVariable;
// import org.springframework.web.bind.annotation.PostMapping;
// import org.springframework.web.bind.annotation.PutMapping;
// import org.springframework.web.bind.annotation.RequestBody;
// import org.springframework.web.bind.annotation.RequestMapping;
// import org.springframework.web.bind.annotation.RestController;

// import com.example.moneymanager.model.Transaction;
// import com.example.moneymanager.model.User;
// import com.example.moneymanager.service.TransactionService;
// import com.example.moneymanager.service.UserService;
// import org.springframework.http.HttpStatus;
// import java.security.Principal;
// import com.fasterxml.jackson.databind.ObjectMapper;

// @RestController
// @RequestMapping("/transactions")
// public class TransactionController {

//     @Autowired
//     private TransactionService transactionService;
//     @Autowired
//     private UserService userService;

//     @GetMapping
//     public ResponseEntity<List<Transaction>> getTransactions(Authentication authentication) {
//         User user = userService.findByUsername(authentication.getName()).orElse(null);
//         if (user == null) {
//             return ResponseEntity.status(401).build();
//         }
//         return ResponseEntity.ok(transactionService.getTransactionsByUser(user));
//     }

//     @PostMapping
//     public ResponseEntity<Transaction> addTransaction(@RequestBody Transaction transaction, Authentication authentication) {
//         User user = userService.findByUsername(authentication.getName()).orElse(null);
//         if (user == null) {
//             return ResponseEntity.status(401).build();
//         }
//         transaction.setUser(user);
//         return ResponseEntity.ok(transactionService.saveTransaction(transaction));
//     }

//     @PutMapping("/{id}")
//     public ResponseEntity<Transaction> updateTransaction(@PathVariable Long id, @RequestBody Transaction transaction, Authentication authentication) {
//         User user = userService.findByUsername(authentication.getName()).orElse(null);
//         if (user == null) {
//             return ResponseEntity.status(401).build();
//         }
//         Transaction existing = transactionService.getTransactionById(id).orElse(null);
//         if (existing == null || !existing.getUser().getId().equals(user.getId())) {
//             return ResponseEntity.status(404).build();
//         }
//         transaction.setId(id);
//         transaction.setUser(user);
//         return ResponseEntity.ok(transactionService.saveTransaction(transaction));
//     }

//     @DeleteMapping("/{id}")
//     public ResponseEntity<?> deleteTransaction(@PathVariable Long id, Authentication authentication) {
//         User user = userService.findByUsername(authentication.getName()).orElse(null);
//         Transaction existing = transactionService.getTransactionById(id).orElse(null);
//         if (existing == null || !existing.getUser().getId().equals(user.getId())) {
//             return ResponseEntity.status(404).build();
//         }
//         transactionService.deleteTransaction(id);
//         return ResponseEntity.ok().build();
//     }
    
// // Add this method to your existing TransactionController
// @GetMapping("/export/csv")
// public ResponseEntity<byte[]> exportTransactionsAsCSV(Principal principal) {
//     try {
//         String username = principal.getName();
//         List<Transaction> transactions = transactionService.findByUsername(username);
        
//         // Create CSV content
//         StringWriter writer = new StringWriter();
//         writer.append("Date,Type,Category,Amount,Notes\n");
        
//         for (Transaction transaction : transactions) {
//             writer.append(String.format("%s,%s,%s,%.2f,%s\n",
//                 transaction.getDate().toString(),
//                 transaction.getType(),
//                 transaction.getCategory(),
//                 transaction.getAmount(),
//                 transaction.getNotes() != null ? transaction.getNotes().replace("\"", "\"\"") : ""));
//         }
        
//         byte[] csvBytes = writer.toString().getBytes();
        
//         return ResponseEntity.ok()
//             .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=transactions.csv")
//             .header(HttpHeaders.CONTENT_TYPE, MediaType.TEXT_PLAIN_VALUE)
//             .body(csvBytes);
            
//     } catch (Exception e) {
//         return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
//     }
// }

// // Add JSON export endpoint
// @GetMapping("/export/json")
// public ResponseEntity<String> exportTransactionsAsJSON(Principal principal) {
//     try {
//         String username = principal.getName();
//         List<Transaction> transactions = transactionService.findByUsername(username);
        
//         // Create JSON response
//         ObjectMapper mapper = new ObjectMapper();
//         String json = mapper.writerWithDefaultPrettyPrinter().writeValueAsString(transactions);
        
//         return ResponseEntity.ok()
//             .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=transactions.json")
//             .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
//             .body(json);
            
//     } catch (Exception e) {
//         return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
//     }
// }
// }




package com.example.moneymanager.controller;

import java.io.StringWriter;
import java.security.Principal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
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
import com.fasterxml.jackson.databind.ObjectMapper;

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
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        Transaction existing = transactionService.getTransactionById(id).orElse(null);
        if (existing == null || !existing.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(404).build();
        }
        transactionService.deleteTransaction(id);
        return ResponseEntity.ok().build();
    }
    
    @GetMapping("/export/csv")
    public ResponseEntity<byte[]> exportTransactionsAsCSV(Principal principal) {
        try {
            String username = principal.getName();
            User user = userService.findByUsername(username).orElse(null);
            if (user == null) {
                return ResponseEntity.status(401).build();
            }
            
            List<Transaction> transactions = transactionService.getTransactionsByUser(user);
            
            // Create CSV content
            StringWriter writer = new StringWriter();
            writer.append("Date,Type,Category,Amount,Notes\n");
            
            for (Transaction transaction : transactions) {
                writer.append(String.format("%s,%s,%s,%.2f,%s\n",
                    transaction.getDate().toString(),
                    transaction.getType(),
                    transaction.getCategory(),
                    transaction.getAmount(),
                    transaction.getNotes() != null ? transaction.getNotes().replace("\"", "\"\"") : ""));
            }
            
            byte[] csvBytes = writer.toString().getBytes();
            
            return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=transactions.csv")
                .header(HttpHeaders.CONTENT_TYPE, MediaType.TEXT_PLAIN_VALUE)
                .body(csvBytes);
                
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/export/json")
    public ResponseEntity<String> exportTransactionsAsJSON(Principal principal) {
        try {
            String username = principal.getName();
            User user = userService.findByUsername(username).orElse(null);
            if (user == null) {
                return ResponseEntity.status(401).build();
            }
            
            List<Transaction> transactions = transactionService.getTransactionsByUser(user);
            
            // Create JSON response
            ObjectMapper mapper = new ObjectMapper();
            String json = mapper.writerWithDefaultPrettyPrinter().writeValueAsString(transactions);
            
            return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=transactions.json")
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .body(json);
                
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
