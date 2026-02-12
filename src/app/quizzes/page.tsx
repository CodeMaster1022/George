/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import Footer from "@/components/main/footer";
import { getQuizzes } from "@/content";

export default function QuizzesPage() {
  const quizzes = getQuizzes();

  return (
    <main className="min-h-screen">
      <section className="relative z-10 max-w-[1300px] mx-auto p-left p-right py-12">
        <div className="grid gap-4 md:grid-cols-2">
          {quizzes.map((q) => (
            <Link
              key={q.id}
              href={`/quizzes/${q.id}`}
              className="block mars-content border-[5px] border-[#2D2D2D] rounded-[20px] overflow-hidden hover:opacity-95"
            >
              <div className="space1 bg-[url('/img/mars-bg.png')] bg-cover bg-center">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-white text-2xl md:text-3xl">{q.title}</h3>
                    <p className="text-white/90 mt-2">{q.questions.length} questions</p>
                  </div>
                  <div className="bg-[#CB4913] text-white px-3 py-1 rounded-lg border-2 border-[#2D2D2D]">
                    {q.level}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}

