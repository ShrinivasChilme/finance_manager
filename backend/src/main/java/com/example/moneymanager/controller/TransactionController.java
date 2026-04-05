package com.example.moneymanager.controller;

import java.io.ByteArrayOutputStream;
import java.io.StringWriter;
import java.security.Principal;
import java.time.LocalDate;
import java.time.YearMonth;
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
import com.example.moneymanager.model.TransactionType;
import com.example.moneymanager.model.User;
import com.example.moneymanager.service.TransactionService;
import com.example.moneymanager.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.itextpdf.text.BaseColor;
import com.itextpdf.text.Document;
import com.itextpdf.text.Element;
import com.itextpdf.text.Font;
import com.itextpdf.text.FontFactory;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.Phrase;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;

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
                        transaction.getType().name(), // FIXED: Use .name() for enum
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

    // MONTHLY DOWNLOAD ENDPOINTS
    @GetMapping("/export/csv/monthly")
    public ResponseEntity<byte[]> exportMonthlyTransactionsAsCSV(Principal principal) {
        try {
            String username = principal.getName();
            User user = userService.findByUsername(username).orElse(null);
            if (user == null) {
                return ResponseEntity.status(401).build();
            }

            // Get current month and year
            YearMonth currentMonth = YearMonth.now();
            LocalDate startDate = currentMonth.atDay(1);
            LocalDate endDate = currentMonth.atEndOfMonth();

            List<Transaction> transactions = transactionService.getTransactionsByUserAndDateRange(user, startDate, endDate);

            // Create CSV content
            StringWriter writer = new StringWriter();
            writer.append("Date,Type,Category,Amount,Notes\n");

            for (Transaction transaction : transactions) {
                writer.append(String.format("%s,%s,%s,%.2f,%s\n",
                        transaction.getDate().toString(),
                        transaction.getType().name(), // FIXED: Use .name() for enum
                        transaction.getCategory(),
                        transaction.getAmount(),
                        transaction.getNotes() != null ? transaction.getNotes().replace("\"", "\"\"") : ""));
            }

            byte[] csvBytes = writer.toString().getBytes();

            String filename = String.format("transactions_%s_%d.csv",
                    currentMonth.getMonth().toString().toLowerCase(),
                    currentMonth.getYear());

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + filename)
                    .header(HttpHeaders.CONTENT_TYPE, MediaType.TEXT_PLAIN_VALUE)
                    .body(csvBytes);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/export/json/monthly")
    public ResponseEntity<String> exportMonthlyTransactionsAsJSON(Principal principal) {
        try {
            String username = principal.getName();
            User user = userService.findByUsername(username).orElse(null);
            if (user == null) {
                return ResponseEntity.status(401).build();
            }

            // Get current month and year
            YearMonth currentMonth = YearMonth.now();
            LocalDate startDate = currentMonth.atDay(1);
            LocalDate endDate = currentMonth.atEndOfMonth();

            List<Transaction> transactions = transactionService.getTransactionsByUserAndDateRange(user, startDate, endDate);

            // Create JSON response
            ObjectMapper mapper = new ObjectMapper();
            String json = mapper.writerWithDefaultPrettyPrinter().writeValueAsString(transactions);

            String filename = String.format("transactions_%s_%d.json",
                    currentMonth.getMonth().toString().toLowerCase(),
                    currentMonth.getYear());

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + filename)
                    .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                    .body(json);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/export/pdf/monthly")
    public ResponseEntity<byte[]> exportMonthlyTransactionsAsPDF(Principal principal) {
        try {
            String username = principal.getName();
            User user = userService.findByUsername(username).orElse(null);
            if (user == null) {
                return ResponseEntity.status(401).build();
            }

            // Get current month and year
            YearMonth currentMonth = YearMonth.now();
            LocalDate startDate = currentMonth.atDay(1);
            LocalDate endDate = currentMonth.atEndOfMonth();

            List<Transaction> transactions = transactionService.getTransactionsByUserAndDateRange(user, startDate, endDate);

            // Create PDF document
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            Document document = new Document();
            PdfWriter.getInstance(document, baos);

            document.open();

            // Add title
            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18);
            Paragraph title = new Paragraph("Monthly Transactions Report", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            title.setSpacingAfter(20);
            document.add(title);

            // Add period info
            Font infoFont = FontFactory.getFont(FontFactory.HELVETICA, 12);
            Paragraph periodInfo = new Paragraph(
                    String.format("Period: %s %d", currentMonth.getMonth().toString(), currentMonth.getYear()),
                    infoFont
            );
            periodInfo.setSpacingAfter(10);
            document.add(periodInfo);

            Paragraph userInfo = new Paragraph(
                    String.format("User: %s", user.getUsername()),
                    infoFont
            );
            userInfo.setSpacingAfter(20);
            document.add(userInfo);

            // Add summary
            double totalIncome = transactions.stream()
                    .filter(t -> TransactionType.INCOME.equals(t.getType()))
                    .mapToDouble(Transaction::getAmount)
                    .sum();

            double totalExpense = transactions.stream()
                    .filter(t -> TransactionType.EXPENSE.equals(t.getType()))
                    .mapToDouble(Transaction::getAmount)
                    .sum();

            double netBalance = totalIncome - totalExpense;

            Paragraph summary = new Paragraph(
                    String.format("Summary: Income: $%.2f | Expenses: $%.2f | Net: $%.2f",
                            totalIncome, totalExpense, netBalance),
                    infoFont
            );
            summary.setSpacingAfter(20);
            document.add(summary);

            // Create transactions table
            if (!transactions.isEmpty()) {
                PdfPTable table = new PdfPTable(5);
                table.setWidthPercentage(100);

                // Table headers
                String[] headers = {"Date", "Type", "Category", "Amount", "Notes"};
                for (String header : headers) {
                    PdfPCell cell = new PdfPCell(new Phrase(header));
                    cell.setBackgroundColor(BaseColor.LIGHT_GRAY);
                    table.addCell(cell);
                }

                // Table data - FIXED: Use .name() for enum
                for (Transaction transaction : transactions) {
                    table.addCell(transaction.getDate().toString());
                    table.addCell(transaction.getType().name()); // FIXED: Use .name() for enum
                    table.addCell(transaction.getCategory());
                    table.addCell(String.format("$%.2f", transaction.getAmount()));
                    table.addCell(transaction.getNotes() != null ? transaction.getNotes() : "");
                }

                document.add(table);
            } else {
                Paragraph noData = new Paragraph("No transactions found for this period.", infoFont);
                document.add(noData);
            }

            document.close();

            byte[] pdfBytes = baos.toByteArray();

            String filename = String.format("transactions_%s_%d.pdf",
                    currentMonth.getMonth().toString().toLowerCase(),
                    currentMonth.getYear());

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + filename)
                    .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_PDF_VALUE)
                    .body(pdfBytes);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}