/* eslint-disable @next/next/no-img-element */
import Footer from "@/components/main/footer";
import { getLesson } from "@/content";
import { notFound } from "next/navigation";
import type { LessonSection } from "@/content/types";

function Section({ section }: { section: LessonSection }) {
  if (section.type === "explanation") {
    return (
      <div className="mb-8">
        <h3 className="text-white text-2xl md:text-3xl mb-3">{section.title}</h3>
        {section.paragraphs?.map((p, idx) => (
          <p key={idx} className="text-white/90 mb-2 md:text-lg">
            {p}
          </p>
        ))}
        {section.points?.length ? (
          <ul className="mt-3 space-y-2">
            {section.points.map((pt, idx) => (
              <li key={idx} className="text-white/90 md:text-lg flex gap-2">
                <span className="mt-2 inline-block w-2 h-2 rounded-full bg-white" />
                <span>{pt}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    );
  }

  if (section.type === "dialogue") {
    return (
      <div className="mb-8">
        <h3 className="text-white text-2xl md:text-3xl mb-3">{section.title}</h3>
        <div className="bg-[#000237]/60 border-2 border-[#2D2D2D] rounded-xl p-4 md:p-6 space-y-3">
          {section.lines.map((ln, idx) => (
            <div key={idx} className="text-white/90 md:text-lg">
              <span className="text-white font-semibold">{ln.speaker}:</span> {ln.text}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <h3 className="text-white text-2xl md:text-3xl mb-3">{section.title}</h3>
      <p className="text-white/90 md:text-lg mb-4">{section.instructions}</p>
      <div className="grid gap-3">
        {section.items.map((it, idx) => (
          <details
            key={idx}
            className="bg-[#000237]/60 border-2 border-[#2D2D2D] rounded-xl p-4 md:p-5"
          >
            <summary className="cursor-pointer text-white md:text-lg">{it.prompt}</summary>
            <div className="mt-3 text-white/90 md:text-lg">
              <span className="text-white font-semibold">Answer:</span> {it.answer}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}

export default function LessonDetailPage({ params }: { params: { slug: string } }) {
  const lesson = getLesson(params.slug);
  if (!lesson) notFound();

  return (
    <main className="min-h-screen">
      <section className="relative z-10 max-w-[1000px] mx-auto p-left p-right py-12">
        <div className="mars-content border-[5px] border-[#2D2D2D] rounded-[20px] overflow-hidden">
          <div className="space1 bg-[url('/img/mars-bg.png')] bg-cover bg-center">
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <span className="bg-[#CB4913] text-white px-3 py-1 rounded-lg border-2 border-[#2D2D2D]">
                {lesson.level}
              </span>
              {lesson.tags.map((t) => (
                <span
                  key={t}
                  className="text-white text-xs md:text-sm px-2 py-1 rounded-md bg-[#000237]/60 border border-[#2D2D2D]"
                >
                  {t}
                </span>
              ))}
            </div>

            <p className="text-white/90 md:text-lg mb-8">{lesson.summary}</p>

            {lesson.sections.map((section, idx) => (
              <Section key={idx} section={section} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

