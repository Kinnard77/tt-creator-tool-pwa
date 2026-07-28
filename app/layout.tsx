import type { Metadata } from "next";
import "./globals.css";
import LimpiarServiceWorkers from "@/components/LimpiarServiceWorkers";
import AuthGate from "@/components/AuthGate";

export const metadata: Metadata = {
  title: "UMBRA Creator Tool",
  description: "Walking is Writing - Create spatial experiences in cathedrals",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="bg-black text-slate-200">
        <LimpiarServiceWorkers />
        <AuthGate>{children}</AuthGate>
      </body>
    </html>
  );
}