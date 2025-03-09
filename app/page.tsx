export default function Page() {
  return (
    <main className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Beautiful gradient background with animated effect using the specified colors */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/60 via-primary-light/40 to-secondary/90 animate-gradient-slow">
        {/* Decorative circles with the new colors */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 right-1/3 w-72 h-72 bg-secondary/20 rounded-full blur-3xl"></div>
      </div>

      {/* Subtle grid pattern overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>

      <div className="w-full max-w-md relative z-10">
        <Login />
      </div>
    </main>
  );
}

// Import this at the top of the file
import Login from "@/app/login";
