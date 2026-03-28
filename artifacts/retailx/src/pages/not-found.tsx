import { AlertCircle } from "lucide-react";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background text-foreground">
      <div className="max-w-md w-full p-8 text-center bg-panel border border-border rounded-2xl shadow-2xl">
        <div className="flex mb-4 gap-2 justify-center">
          <AlertCircle className="h-12 w-12 text-bearish" />
        </div>
        <h1 className="text-3xl font-bold mb-2">404</h1>
        <p className="text-neutral mb-8 font-medium">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link href="/stock/RELIANCE.NS" className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}
