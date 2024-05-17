import Image from "next/image";
import Link from "next/link";

import { auth } from "@/configs/auth";
import AdminProfileDropdown from "./AdminProfileDropdown";

const AdminTopNavBar = async () => {
  const session = await auth();
  return (
    <div className=" w-full fixed inset-0 bg-gray-100 text-black h-[12%] z-[999] px-4 flex justify-between items-center">
      <Link href="/">
        <Image
          src="/logo.jpg"
          alt="logo"
          height="60"
          width="60"
          className=" w-[60px] max-h-[60px] rounded-full"
        />
      </Link>
      <AdminProfileDropdown session={session} />
    </div>
  );
};

export default AdminTopNavBar;
