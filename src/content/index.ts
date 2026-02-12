import type { Lesson, Quiz, VocabList } from "./types";

import lessonGreetings from "./lessons/greetings.json";
import lessonPastSimple from "./lessons/past-simple.json";

import vocabSpaceBasics from "./vocab/space-basics.json";

import quizBasics001 from "./quizzes/basics-001.json";

const lessons: Lesson[] = [lessonGreetings, lessonPastSimple] as Lesson[];
const vocabLists: VocabList[] = [vocabSpaceBasics] as VocabList[];
const quizzes: Quiz[] = [quizBasics001] as Quiz[];

export function getLessons() {
  return lessons;
}

export function getLesson(slug: string) {
  return lessons.find((l) => l.slug === slug);
}

export function getVocabLists() {
  return vocabLists;
}

export function getVocabList(id: string) {
  return vocabLists.find((v) => v.id === id);
}

export function getQuizzes() {
  return quizzes;
}

export function getQuiz(id: string) {
  return quizzes.find((q) => q.id === id);
}

