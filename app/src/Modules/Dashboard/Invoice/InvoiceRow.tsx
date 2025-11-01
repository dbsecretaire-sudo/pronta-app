// app/components/InvoiceRow.tsx
import Link from "next/link";
import { Invoice } from "@/app/src/Types/Invoices/index";

interface InvoiceRowProps {
  invoice: Invoice;
}

export const InvoiceRow = ({ invoice }: InvoiceRowProps) => {
  const getStatusBadge = (status: string) => {
    const statusMap = {
      paid: { label: "Payée", color: "bg-green-100 text-green-800" },
      overdue: { label: "En retard", color: "bg-red-100 text-red-800" },
      sent: { label: "Envoyée", color: "bg-yellow-100 text-yellow-800" },
      draft: { label: "Brouillon", color: "bg-yellow-100 text-yellow-800" },
    };
    const { label, color } = statusMap[status as keyof typeof statusMap] || { label: status, color: "bg-gray-100 text-gray-800" };
    return (
      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${color}`}>
        {label}
      </span>
    );
  };

  return (
    <tr key={invoice.id}>
      <td className="px-6 py-4 whitespace-nowrap">{invoice.client_name}</td>
      <td className="px-6 py-4 whitespace-nowrap">FACT-{invoice.id}</td>
      <td className="px-6 py-4 whitespace-nowrap">{invoice.amount}€</td>
      <td className="px-6 py-4 whitespace-nowrap">
        {getStatusBadge(invoice.status)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {new Date(invoice.due_date).toLocaleDateString()}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <Link href={`/dashboard/Services/prontaInvoices/invoices/${invoice.id}`} className="text-blue-600 hover:text-blue-900 mr-2">
          Voir
        </Link>
        <Link href={`/dashboard/Services/prontaInvoices/invoices/${invoice.id}/edit`} className="text-green-600 hover:text-green-900">
          Modifier
        </Link>
      </td>
    </tr>
  );
};
