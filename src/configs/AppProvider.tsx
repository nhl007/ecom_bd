import { SessionProvider } from "next-auth/react";

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <main>
      <SessionProvider>{children}</SessionProvider>
    </main>
  );
};

export default AppProvider;
