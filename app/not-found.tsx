import "./globals.css";

export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body className="grid min-h-screen place-items-center bg-[#0c0a07] p-6 text-center text-[#f6efe3]">
        <div>
          <p className="text-6xl font-bold text-[#d4af37]">404</p>
          <p className="mt-4">Page not found.</p>
          <a href="/" className="mt-6 inline-block underline">
            Go home
          </a>
        </div>
      </body>
    </html>
  );
}
