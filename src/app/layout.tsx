import Head from "next/head";
import Logo from "../../public/favicon.ico";
import Navbar from "../components/NavBar/page";
import { ReactNode } from "react";

export const metadata = {
  title: "Crew CRM",
  description: "Customer Relation Management",
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const connecté = true;

  return (
    <html lang="en">
      <Head>
        <link rel="icon" href={Logo} type="image/x-icon" />
      </Head>
      <body>
        {connecté && <Navbar />}
        {children}
      </body>
    </html>
  );
}
