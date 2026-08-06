import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'FOCUS VAULT | Discipline Execution Engine',
  description: 'An execution prison for hyper-focused builders and SMC algorithmic traders.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'FOCUS VAULT',
  },
};

export const viewport: Viewport = {
  themeColor: '#0A0A0A',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#0A0A0A] text-[#E5E5E5] antialiased selection:bg-red-900 selection:text-white">
        {children}
      </body>
    </html>
  );
}
