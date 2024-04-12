/**
 * @file Invoice.tsx
 * @description Component with mock data
 */

import React from "react";

export type InvoiceProps = {
  id: number;
  amount: number;
  dueDate: string;
};

export const Invoice = ({ id, amount, dueDate }: InvoiceProps) => {
  // Mock data
  const invoice_id = id || 123;
  const invoice_amount = amount || 100;
  const invoice_date = dueDate.toString() || "18-10-1987";

  return (
    <div className="flex items-center justify-center w-full p-16 min-h-svh bg-indigo-50">
      <div className="border border-indigo-200 p-4 w-[600px] mt-4 m-auto bg-white rouned-xl">
        <h2>Invoice</h2>
        <p>Invoice ID: {invoice_id}</p>
        <p>Amount: {invoice_amount}</p>
        <p>Due Date: {invoice_date}</p>
      </div>
    </div>
  );
};

export default Invoice;
