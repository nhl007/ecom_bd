import {
  ImagesIcon,
  Layers3Icon,
  LayoutDashboardIcon,
  LucideDollarSign,
  PenToolIcon,
  SettingsIcon,
  ShirtIcon,
  TruckIcon,
  User2Icon,
  UserSquare2Icon,
} from "lucide-react";
import InventoryLeftMenuOptions from "./InventoryLeftMenuOptions";

const InventoryLeftMenuBar = () => {
  return (
    <div className="bg-main_accent  w-[15%] min-h-screen mt-[5.8%] fixed top-0 flex flex-col pt-3">
      <InventoryLeftMenuOptions href="/admin">
        <LayoutDashboardIcon size={18} />
        DashBoard
      </InventoryLeftMenuOptions>

      <InventoryLeftMenuOptions href="/admin/create">
        <PenToolIcon size={18} />
        Create New
      </InventoryLeftMenuOptions>

      <InventoryLeftMenuOptions href="/admin/products">
        <ShirtIcon size={18} />
        Products
      </InventoryLeftMenuOptions>
      <InventoryLeftMenuOptions href="/admin/customers">
        <User2Icon size={18} />
        Customers
      </InventoryLeftMenuOptions>

      <InventoryLeftMenuOptions href="/admin/orders">
        <LucideDollarSign size={18} />
        Orders
      </InventoryLeftMenuOptions>
      <InventoryLeftMenuOptions href="/admin/category">
        <Layers3Icon size={18} />
        Category
      </InventoryLeftMenuOptions>
      <InventoryLeftMenuOptions href="/admin/sliders">
        <ImagesIcon size={18} />
        Sliders
      </InventoryLeftMenuOptions>
      <InventoryLeftMenuOptions href="/admin/courier">
        <TruckIcon size={18} />
        Courier
      </InventoryLeftMenuOptions>
      <InventoryLeftMenuOptions href="/admin/shipping">
        <SettingsIcon size={18} />
        Shipping
      </InventoryLeftMenuOptions>
      <InventoryLeftMenuOptions href="/admin/user">
        <UserSquare2Icon size={18} />
        User
      </InventoryLeftMenuOptions>
      <InventoryLeftMenuOptions className=" border-none" href="/admin/settings">
        <SettingsIcon size={18} />
        Settings
      </InventoryLeftMenuOptions>
    </div>
  );
};

export default InventoryLeftMenuBar;
