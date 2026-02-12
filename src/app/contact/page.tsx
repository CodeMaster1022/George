import BlockTitle from "@/components/learning/BlockTitle";
import ContactForm from "@/components/learning/ContactForm";
import Footer from "@/components/main/footer";

export default function ContactPage() {
  return (
    <main className="min-h-screen">
      {/* Full-width hero banner (no border) */}
      <section className="relative z-10">
        <div className="relative left-1/2 right-1/2 -mx-[50vw] w-screen overflow-hidden">
          {/* background texture */}
          <div
            className="pointer-events-none absolute inset-0 opacity-60"
            style={{
              background:
                "radial-gradient(800px 280px at 50% 35%, rgba(255,255,255,0.18), rgba(255,255,255,0) 60%), radial-gradient(500px 180px at 15% 40%, rgba(255,255,255,0.10), rgba(255,255,255,0) 70%), radial-gradient(500px 180px at 85% 40%, rgba(255,255,255,0.10), rgba(255,255,255,0) 70%)",
            }}
          />

          <div className="relative max-w-[1700px] mx-auto p-left p-right px-6 md:px-12 py-16 md:py-24 min-h-[240px] md:min-h-[320px] flex items-center justify-center">
            <div className="text-center">
              <BlockTitle
                text="Contact Us"
                className="mx-auto"
              />
            </div>

            {/* decorative characters (placeholders using existing assets) */}
            <img
              src="/img/martian.png"
              alt=""
              className="pointer-events-none absolute left-4 md:left-10 bottom-0 w-[110px] md:w-[160px] opacity-95 drop-shadow-[0_12px_0_rgba(0,0,0,0.18)]"
            />
            <img
              src="/img/ufo.png"
              alt=""
              className="pointer-events-none absolute right-4 md:right-10 bottom-2 w-[120px] md:w-[180px] opacity-95 drop-shadow-[0_12px_0_rgba(0,0,0,0.18)]"
            />
          </div>
        </div>
      </section>

      {/* Contact section (like screenshot) */}
      <section className="relative z-10 max-w-[1300px] mx-auto p-left p-right py-12 md:py-16">
        <div className="mars-content border-[5px] border-[#2D2D2D] rounded-[26px] overflow-hidden">
          <div className="space1 bg-[url('/img/mars-bg.png')] bg-cover bg-center px-6 md:px-12 py-10 md:py-14">
            <div className="grid gap-10 md:grid-cols-2">
              {/* Left info */}
              <div>
                <h2 className="text-white text-2xl md:text-4xl font-extrabold">
                  Get in touch with us!
                </h2>
                <p className="text-white/80 text-sm md:text-base mt-2">
                  We are working on offering you the best learning experience.
                </p>

                <ul className="mt-5 space-y-2 text-white/85 text-sm md:text-base leading-7">
                  {[
                    "If you want to get a free trial class",
                    "If you want to receive information about our methods and programs",
                    "If you want to be updated",
                  ].map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="mt-2.5 inline-block w-2 h-2 rounded-full bg-white/50" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <p className="mt-5 text-white/80 text-sm md:text-base">
                  If you would like more information, please contact us at{" "}
                  <a
                    href="mailto:hola@kidsclubspanishschool.com"
                    className="text-white underline font-semibold"
                  >
                    hola@kidsclubspanishschool.com
                  </a>
                </p>

                <div className="mt-8 rounded-[22px] border-[5px] border-[#2D2D2D] overflow-hidden bg-[#000237]/35">
                  <div className="relative h-[210px] md:h-[260px] flex items-end justify-center">
                    {/* Placeholder illustration: swap with your contact artwork later */}
                    <img
                      src="/img/martian.png"
                      alt=""
                      className="w-[220px] md:w-[290px] object-contain translate-y-4"
                    />
                  </div>
                </div>
              </div>

              {/* Right form */}
              <div>
                <h2 className="text-white text-2xl md:text-4xl font-extrabold">
                  Send us a message
                </h2>
                <p className="text-white/75 text-sm md:text-base mt-2">
                  Your email address will not be published. Required fields are marked.
                </p>

                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

