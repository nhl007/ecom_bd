import { cn } from "@/lib/utils";

const MaxWidthWrapper = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div className={cn("mx-auto max-w-screen-xl px-3 lg:px-5", className)}>
      {children}
    </div>
  );
};

export default MaxWidthWrapper;
