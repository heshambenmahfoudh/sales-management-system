// import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ContextProvider from "@/contexts/ContextProvider";
import { Toaster } from "react-hot-toast";
import Provider from "@/provider/provider";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata = {
  title: "Sales system",
  description: "sales system software to manage car parts",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        // className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <main className="w-full">
            <Toaster position="top-center" reverseOrder={false} />
            <ContextProvider>
              <Provider >
             {children}
              </Provider>
              </ContextProvider>
        </main>
        
      </body>
    </html>
  );
}
