import Footer from "@/components/main/footer";
import RegisterWizard from "@/components/learning/RegisterWizard";

export default function RegisterPage() {
  return (
    <main className="min-h-screen">
      <section className="relative z-10 p-left p-right py-12 md:py-16">
        <RegisterWizard />
      </section>

      <Footer />
    </main>
  );
}

