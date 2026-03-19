import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-border py-4">
      <div className="mx-auto max-w-[1350px] px-4 sm:px-6 flex items-center justify-between">
        <p className="text-[14px] text-foreground">
          &copy; {new Date().getFullYear()} Reputo
        </p>
        <div className="flex items-center gap-4">
          <Link href="/about" className="text-[14px] text-foreground no-underline hover:underline">About</Link>
          <Link href="/privacy" className="text-[14px] text-foreground no-underline hover:underline">Privacy</Link>
          <Link href="/terms" className="text-[14px] text-foreground no-underline hover:underline">Terms</Link>
          <Link href="/contact" className="text-[14px] text-foreground no-underline hover:underline">Contact</Link>
        </div>
      </div>
    </footer>
  );
}
