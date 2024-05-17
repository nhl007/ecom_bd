import AdminTopNavBar from "@/components/AdminTopNavBar";
import InventoryLeftMenuBar from "@/components/InventoryLeftMenuBar";
import { SessionProvider } from "next-auth/react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex w-full h-full">
      <AdminTopNavBar />
      <InventoryLeftMenuBar />
      <div className=" w-[85%] mt-[5%] ml-[15%] h-full px-6 py-4 mb-[2%]">
        <SessionProvider>{children}</SessionProvider>
      </div>
      <p className=" fixed bottom-0 w-full text-center font-semibold text-xs py-1 bg-slate-100">
        © 2024 All Rights Reserved. Developed By Visual Craft Studios
      </p>
    </div>
  );
};

export default layout;
