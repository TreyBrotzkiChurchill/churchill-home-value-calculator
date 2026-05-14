import "./globals.css";

export const metadata = {
  title: "Churchill Mortgage Home Value Calculator",
  description: "Project your home's future value based on average appreciation.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
