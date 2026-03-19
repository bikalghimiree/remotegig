import Link from "next/link";

export default function Footer() {
  return (
    <footer className="py-4 mt-auto">
      <div className="mx-auto max-w-[1350px] px-4 sm:px-6 flex items-center justify-between text-[14px] text-muted-foreground">
        <span>&copy; 2026 RemoteGig</span>
        <div className="flex items-center gap-4">
          <Link href="/privacy" className="hover:text-foreground transition-colors no-underline text-muted-foreground">Privacy</Link>
          <Link href="/terms" className="hover:text-foreground transition-colors no-underline text-muted-foreground">Terms</Link>
          <Link href="/contact" className="hover:text-foreground transition-colors no-underline text-muted-foreground">Contact</Link>
        </div>
      </div>
    </footer>
  );
}
