import { Animated404 } from '@/components/404/animated-404';
import { MosqueSilhouette } from '@/components/404/mosque-silhoutette';

export default function NotFound() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center bg-background px-6 py-16">
      <div className="flex flex-col items-center gap-6 text-center">
        <MosqueSilhouette />

        <Animated404 />

        <div className="flex flex-col items-center gap-2 max-w-sm">
          <h1 className="text-xl md:text-2xl font-medium tracking-tight text-foreground text-balance font-sans">
            Page not found
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed text-pretty font-sans">
            {
              "The page you're looking for doesn't found. Please try again later."
            }
          </p>
        </div>

        <div className="flex items-center gap-3 mt-4">
          {/* <Link
            href="/"
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 font-sans"
          >
            Return home
          </Link>
          <GoBackButton /> */}
        </div>
      </div>
    </main>
  );
}
