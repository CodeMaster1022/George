/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import Footer from "@/components/main/footer";
import { getLessons } from "@/content";

export default function LessonsPage() {
  const lessons = getLessons();

  return (
    <main className="min-h-screen">
      <section className="relative z-10 max-w-[1300px] mx-auto p-left p-right py-12">
        <div className="grid gap-4 md:grid-cols-2">
          {lessons.map((lesson) => (
            <Link
              key={lesson.slug}
              href={`/lessons/${lesson.slug}`}
              className="block mars-content border-[5px] border-[#2D2D2D] rounded-[20px] overflow-hidden hover:opacity-95"
            >
              <div className="space1 bg-[url('/img/mars-bg.png')] bg-cover bg-center">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-white text-2xl md:text-3xl">{lesson.title}</h3>
                    <p className="text-white/90 mt-2">{lesson.summary}</p>
                  </div>
                  <div className="bg-[#CB4913] text-white px-3 py-1 rounded-lg border-2 border-[#2D2D2D]">
                    {lesson.level}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  {lesson.tags.map((t) => (
                    <span
                      key={t}
                      className="text-white text-xs md:text-sm px-2 py-1 rounded-md bg-[#000237]/60 border border-[#2D2D2D]"
                    >
                      {t}
                    </span>
                  ))}
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

