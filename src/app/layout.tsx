import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'GoTrack — Multi-modal Consolidation',
  description: 'Track multi-modal shipments in one unified view',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
