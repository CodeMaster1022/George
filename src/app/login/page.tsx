import Footer from "@/components/main/footer";
import Link from "next/link";
import LoginClient from "@/components/learning/LoginClient";

export default function LoginPage() {
  return (
    <main className="min-h-screen">
      <section className="relative z-10 max-w-[1000px] mx-auto p-left p-right py-12">
        <LoginClient />
        <div className="mt-4 text-center text-white/80 text-sm">
          New here?{" "}
          <Link href="/register" className="underline text-white">
            Register
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}

