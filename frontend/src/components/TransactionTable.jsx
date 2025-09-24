import React from 'react';

export default function TransactionTable({ transactions }) {
  return (
    <table className="min-w-full bg-white border rounded shadow mt-4">
      <thead>
        <tr>
          <th className="px-4 py-2">Date</th>
          <th className="px-4 py-2">Type</th>
          <th className="px-4 py-2">Category</th>
          <th className="px-4 py-2">Amount</th>
          <th className="px-4 py-2">Notes</th>
        </tr>
      </thead>
      <tbody>
        {transactions.map((tx) => (
          <tr key={tx.id}>
            <td className="border px-4 py-2">{tx.date}</td>
            <td className="border px-4 py-2">{tx.type}</td>
            <td className="border px-4 py-2">{tx.category}</td>
            <td className="border px-4 py-2">{tx.amount}</td>
            <td className="border px-4 py-2">{tx.notes}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
