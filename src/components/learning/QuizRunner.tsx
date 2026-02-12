"use client";

import React from "react";
import type { Quiz, QuizQuestion } from "@/content/types";
import { ToastContext } from "@/providers/toastProvider";

function normalize(s: string) {
  return s.trim().toLowerCase();
}

function isCorrect(q: QuizQuestion, userAnswer: string | number | undefined) {
  if (q.type === "mcq") {
    return typeof userAnswer === "number" && userAnswer === q.answerIndex;
  }
  return typeof userAnswer === "string" && normalize(userAnswer) === normalize(q.answer);
}

export default function QuizRunner({ quiz }: { quiz: Quiz }) {
  const toastCtx = React.useContext(ToastContext);

  const [answers, setAnswers] = React.useState<Record<string, string | number>>({});
  const [submitted, setSubmitted] = React.useState(false);

  const score = React.useMemo(() => {
    return quiz.questions.reduce((acc, q) => acc + (isCorrect(q, answers[q.id]) ? 1 : 0), 0);
  }, [quiz.questions, answers]);

  const onSubmit = () => {
    setSubmitted(true);
    toastCtx?.showToast("Quiz submitted!", "success");
  };

  const onReset = () => {
    setAnswers({});
    setSubmitted(false);
  };

  return (
    <div className="mars-content border-[5px] border-[#2D2D2D] rounded-[20px] overflow-hidden">
      <div className="space1 bg-[url('/img/mars-bg.png')] bg-cover bg-center">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h3 className="text-white text-2xl md:text-3xl">{quiz.title}</h3>
            <p className="text-white/90 mt-2 md:text-lg">{quiz.questions.length} questions</p>
          </div>
          <div className="bg-[#CB4913] text-white px-3 py-1 rounded-lg border-2 border-[#2D2D2D]">
            {quiz.level}
          </div>
        </div>

        <div className="space-y-4">
          {quiz.questions.map((q, idx) => {
            const userAnswer = answers[q.id];
            const correct = submitted ? isCorrect(q, userAnswer) : undefined;

            return (
              <div
                key={q.id}
                className={[
                  "bg-[#000237]/60 border-2 rounded-xl p-4 md:p-5",
                  submitted ? (correct ? "border-green-400" : "border-red-400") : "border-[#2D2D2D]",
                ].join(" ")}
              >
                <div className="text-white md:text-lg font-semibold">
                  {idx + 1}. {q.prompt}
                </div>

                {q.type === "mcq" ? (
                  <div className="mt-3 grid gap-2">
                    {q.choices.map((choice, cIdx) => (
                      <label key={cIdx} className="flex items-center gap-2 text-white/90 md:text-lg">
                        <input
                          type="radio"
                          name={q.id}
                          value={cIdx}
                          checked={userAnswer === cIdx}
                          onChange={() => setAnswers((prev) => ({ ...prev, [q.id]: cIdx }))}
                          disabled={submitted}
                        />
                        <span>{choice}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="mt-3">
                    <input
                      className="w-full md:text-lg px-3 py-2 rounded-lg border-2 border-[#2D2D2D] bg-[#000237]/60 text-white placeholder:text-white/60"
                      placeholder="Type your answer"
                      value={typeof userAnswer === "string" ? userAnswer : ""}
                      onChange={(e) => setAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))}
                      disabled={submitted}
                    />
                  </div>
                )}

                {submitted ? (
                  <div className="mt-3 text-white/90 md:text-lg">
                    <span className="text-white font-semibold">Correct answer:</span>{" "}
                    {q.type === "mcq" ? q.choices[q.answerIndex] : q.answer}
                    {q.explanation ? (
                      <div className="text-white/80 mt-2">
                        <span className="text-white font-semibold">Why:</span> {q.explanation}
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>

        <div className="flex flex-wrap gap-3 mt-8">
          {!submitted ? (
            <button onClick={onSubmit} className="btn-primary text-white border-2 border-[#2D2D2D]">
              Submit
            </button>
          ) : (
            <>
              <div className="text-white md:text-xl flex items-center">
                Score: <span className="font-semibold ml-2">{score}</span>/{quiz.questions.length}
              </div>
              <button onClick={onReset} className="btn-primary text-white border-2 border-[#2D2D2D]">
                Try again
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

