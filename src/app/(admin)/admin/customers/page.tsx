import { getAllCustomers } from "@/actions/products";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const page = async () => {
  const customers = await getAllCustomers();
  if (!customers) return <p>No customers yet!</p>;
  return (
    <div>
      <Table>
        <TableCaption>A list of the customers.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Name</TableHead>
            <TableHead className="w-[100px]">Phone</TableHead>

            <TableHead colSpan={2} className="w-[100px]">
              Address
            </TableHead>
            <TableHead className="w-[100px]" colSpan={2}>
              Note
            </TableHead>
            <TableHead className="w-[100px]">Creation Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((cus, i) => (
            <TableRow key={i}>
              <TableCell className="font-medium">{cus.customer.name}</TableCell>
              <TableCell className="font-medium">
                {cus.customer.phone}
              </TableCell>
              <TableCell colSpan={2} className="font-medium">
                {cus.customer.address}
              </TableCell>

              <TableCell colSpan={2} className="font-medium">
                {cus.note}
              </TableCell>
              <TableCell className="text-right">
                {new Date(cus.createdAt!).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default page;
