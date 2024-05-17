import Image from "next/image";
import { Button } from "./ui/button";
import { X } from "lucide-react";

interface ICartItemProps {
  name: string;
  image: string;
  price: number;
  quantity: number;
  id: string;
  updateQuantity: (id: string, count: number) => void;
  removeFromCart: (id: string, amount: number) => void;
}

const CartItem = ({
  price,
  image,
  name,
  quantity,
  id,
  updateQuantity,
  removeFromCart,
}: ICartItemProps) => {
  return (
    <>
      <div className="col-span-3 flex gap-3 items-center justify-between md:justify-start">
        <Button
          className="order-3 md:order-[-1]"
          variant="ghost"
          onClick={() => removeFromCart(id, price)}
        >
          <X size={24} color="red" />
        </Button>
        <Image
          src={image}
          alt="prod"
          width={80}
          height={80}
          className=" max-w-[80px] h-auto object-cover rounded-md"
        />
        <p className="mr-auto">{name}</p>
      </div>
      <div className=" col-span-1">
        <p>
          <span className="md:hidden text-lg font-medium mr-4">Price :</span>
          {price}৳
        </p>
      </div>
      <div className="  col-span-1 flex items-center">
        <span className="md:hidden text-lg font-medium mr-4">Quantity :</span>

        <Button
          onClick={() => updateQuantity(id, quantity - 1)}
          variant="outline"
          className=" border-2 rounded-none"
        >
          -
        </Button>
        <p className="h-10 px-4 py-2 border-2">{quantity}</p>
        <Button
          onClick={() => updateQuantity(id, quantity + 1)}
          variant="outline"
          className=" border-2 rounded-none"
        >
          +
        </Button>
      </div>
      <div className="  col-span-1">
        <p>
          <span className="md:hidden text-lg font-medium mr-4">
            Sub Total :
          </span>
          {quantity * price}৳
        </p>
      </div>
      <div className="md:hidden h-[1px] bg-slate-200 w-full my-2" />
    </>
  );
};

export default CartItem;
