import "./globals.css";
import Gaurd from "./guard";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="EN">
      <body>
        <Gaurd>{children}</Gaurd>
      </body>
    </html>
  );
}
