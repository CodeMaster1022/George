import Footer from "@/components/main/footer";

export default function TermsAndConditionsPage() {
  return (
    <main className="min-h-screen">
      <section className="relative z-10 max-w-[1000px] mx-auto p-left p-right py-12">
        <div className="mars-content border-[5px] border-[#2D2D2D] rounded-[20px] overflow-hidden">
          <div className="space1 bg-[url('/img/mars-bg.png')] bg-cover bg-center">
            <p className="text-white/90 md:text-lg">
              Placeholder page. Replace this text with your Terms and Conditions.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

