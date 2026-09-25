// The real <html> layouts live in app/[locale]/layout.tsx (website)
// and app/admin/layout.tsx (dashboard). This one just passes through.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
