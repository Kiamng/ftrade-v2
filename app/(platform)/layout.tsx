import Header from "@/components/landing-page/header";
import { Toaster } from "@/components/ui/toaster";

export const metadata = {
  title: "Ftrade",
  description: "Good-trading service",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Header />
      {children}
      <Toaster />
    </div>
  );
}
