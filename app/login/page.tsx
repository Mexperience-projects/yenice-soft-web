import Login from "@/app/login/login";

export default function Page() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary to-secondary p-4">
      <div className="w-full max-w-md">
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary opacity-90"></div>
        <div className="relative z-10">
          <Login />
        </div>
      </div>
    </main>
  );
}
