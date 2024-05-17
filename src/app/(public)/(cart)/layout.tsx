import CartNavigation from "@/components/CartNavigation";

const layout = ({ children }: TOnlyReactChildren) => {
  return (
    <main>
      <CartNavigation />
      {children}
    </main>
  );
};

export default layout;
