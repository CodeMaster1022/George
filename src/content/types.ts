export type CEFRLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export type LessonSection =
  | {
      type: "explanation";
      title: string;
      paragraphs?: string[];
      points?: string[];
    }
  | {
      type: "dialogue";
      title: string;
      lines: { speaker: string; text: string }[];
    }
  | {
      type: "practice";
      title: string;
      instructions: string;
      items: { prompt: string; answer: string }[];
    };

export type Lesson = {
  slug: string;
  title: string;
  level: CEFRLevel;
  tags: string[];
  summary: string;
  sections: LessonSection[];
};

export type VocabWord = {
  term: string;
  meaning: string;
  example?: string;
};

export type VocabList = {
  id: string;
  title: string;
  level: CEFRLevel;
  words: VocabWord[];
};

export type QuizQuestion =
  | {
      id: string;
      type: "mcq";
      prompt: string;
      choices: string[];
      answerIndex: number;
      explanation?: string;
    }
  | {
      id: string;
      type: "fill";
      prompt: string;
      answer: string;
      explanation?: string;
    };

export type Quiz = {
  id: string;
  title: string;
  level: CEFRLevel;
  questions: QuizQuestion[];
};

