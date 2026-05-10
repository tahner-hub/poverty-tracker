import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Predictive Poverty Tracker',
  description:
    'A composite index of eight microeconomic stress signals, scored 0–100 across all fifty U.S. states. Higher scores indicate greater pressure toward entrenched poverty.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-body">{children}</body>
    </html>
  );
}
