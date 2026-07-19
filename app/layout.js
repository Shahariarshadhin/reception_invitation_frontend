import "./globals.css";

export const metadata = {
  title: "Turjo & Benazir | Reception Invite",
  description: "Join us as we begin our forever — Wedding & Reception.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#6E1E2A",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[#33251f]">{children}</body>
    </html>
  );
}
