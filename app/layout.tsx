import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'MTG MCP Server',
  description: 'Magic: The Gathering Model Context Protocol Server',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}