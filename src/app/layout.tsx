import "./globals.css";
import ReduxProvider from "./ReduxProvider";

export const metadata = {
  title: "News App",
  description: "News editing and filtering",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}