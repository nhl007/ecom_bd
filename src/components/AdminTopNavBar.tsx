import Image from "next/image";
import Link from "next/link";

import { auth } from "@/configs/auth";
import AdminProfileDropdown from "./AdminProfileDropdown";
import { getPreferences } from "@/actions/preference";

const AdminTopNavBar = async () => {
  const session = await auth();
  const pref = await getPreferences();
  return (
    <div className=" w-full fixed inset-0 bg-gray-100 text-black h-[12%] z-[999] px-4 flex justify-between items-center">
      <Link href="/">
        <Image
          src={pref?.logo.url ?? "/logo.png"}
          alt="logo"
          height="100"
          width="100"
          className=" w-[100px] max-h-[80px] rounded-full"
        />
      </Link>
      <AdminProfileDropdown session={session} />
    </div>
  );
};

export default AdminTopNavBar;
