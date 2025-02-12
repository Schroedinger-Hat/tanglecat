export default function StudioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

// This is important - it tells Next.js that this layout should be the root
export const metadata = {
  title: 'Studio',
  description: 'Sanity Studio',
} 