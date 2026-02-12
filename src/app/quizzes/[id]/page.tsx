/* eslint-disable @next/next/no-img-element */
import Footer from "@/components/main/footer";
import QuizRunner from "@/components/learning/QuizRunner";
import { getQuiz } from "@/content";
import { notFound } from "next/navigation";

export default function QuizPage({ params }: { params: { id: string } }) {
  const quiz = getQuiz(params.id);
  if (!quiz) notFound();

  return (
    <main className="min-h-screen">
      <section className="relative z-10 max-w-[1000px] mx-auto p-left p-right py-12">
        <QuizRunner quiz={quiz} />
      </section>

      <Footer />
    </main>
  );
}

