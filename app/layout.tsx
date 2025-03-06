import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="EN">
      <body>{children}</body>
    </html>
  );
}
