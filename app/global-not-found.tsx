import "./globals.css";
import Link from "next/link";

export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body>
        <main className="localeChooser">
          <h1>Page not found</h1>
          <p>The requested language or page is not available.</p>
          <nav className="localeChooser__links" aria-label="Recovery navigation">
            <Link href="/en" lang="en">View the English portfolio</Link>
          </nav>
        </main>
      </body>
    </html>
  );
}
