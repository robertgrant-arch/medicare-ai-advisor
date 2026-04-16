import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Medicare AI Advisor | Find Your Perfect Medicare Advantage Plan',
  description: 'AI-powered Medicare Advantage plan comparison and enrollment. Get personalized recommendations based on your doctors, drugs, and budget.',
  keywords: 'Medicare Advantage, Medicare plans, health insurance, plan comparison, enrollment',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  );
}
