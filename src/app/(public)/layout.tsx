import { getPixelCode } from "@/actions/preference";
import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";
import { CartContextProvider } from "@/contexts/CartContext";
import Script from "next/script";
import { Suspense } from "react";

const publicLayout = async ({ children }: TOnlyReactChildren) => {
  const pixelCode = await getPixelCode();

  console.log(pixelCode);

  return (
    <main>
      {pixelCode && (
        <Suspense fallback={<p>...loading</p>}>
          <Script
            id="pixel_code"
            dangerouslySetInnerHTML={{
              __html: `${pixelCode}`,
            }}
            strategy="beforeInteractive"
          ></Script>
        </Suspense>
      )}
      <CartContextProvider>
        <NavBar />
        <div className=" min-h-svh">{children}</div>
        <Footer />
      </CartContextProvider>
    </main>
  );
};

export default publicLayout;
