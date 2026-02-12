/* eslint-disable @next/next/no-img-element */
import Footer from "@/components/main/footer";
import { getVocabLists } from "@/content";

export default function VocabPage() {
  const lists = getVocabLists();

  return (
    <main className="min-h-screen">
      <section className="relative z-10 max-w-[1300px] mx-auto p-left p-right py-12 space-y-6">
        {lists.map((list) => (
          <div
            key={list.id}
            className="mars-content border-[5px] border-[#2D2D2D] rounded-[20px] overflow-hidden"
          >
            <div className="space1 bg-[url('/img/mars-bg.png')] bg-cover bg-center">
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-white text-2xl md:text-3xl">{list.title}</h3>
                  <p className="text-white/90 mt-2 md:text-lg">
                    Learn these words, then try a quiz to test yourself.
                  </p>
                </div>
                <div className="bg-[#CB4913] text-white px-3 py-1 rounded-lg border-2 border-[#2D2D2D]">
                  {list.level}
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                {list.words.map((w) => (
                  <div
                    key={w.term}
                    className="bg-[#000237]/60 border-2 border-[#2D2D2D] rounded-xl p-4 md:p-5"
                  >
                    <div className="text-white text-xl md:text-2xl font-semibold">{w.term}</div>
                    <div className="text-white/90 mt-2 md:text-lg">{w.meaning}</div>
                    {w.example ? (
                      <div className="text-white/80 mt-3 md:text-lg">
                        <span className="text-white font-semibold">Example:</span> {w.example}
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </section>

      <Footer />
    </main>
  );
}

