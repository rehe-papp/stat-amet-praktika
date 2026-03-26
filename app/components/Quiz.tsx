"use client";

import { useMemo, useState } from "react";
import { questions } from "./quizData";
import { Answer, Question } from "./types";
import { ResultTable } from "./ResultTable";

type QuizProps = {
  initialQuestions?: Question[];
};

export function Quiz({ initialQuestions = questions }: QuizProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const currentQuestion = initialQuestions[currentIndex];
  const finished = currentIndex >= initialQuestions.length;

  const score = useMemo(() => answers.filter((item) => item.correct).length, [answers]);

  const total = initialQuestions.length;
  const finalMessage = useMemo(() => {
    if (score === total) return "Suurepärane!";
    if (score >= total - 1) return "Hea töö! Natuke on veel vaja vaeva näha.";
    return "Pead veel harjutama";
  }, [score, total]);

  const selectOption = (optionIndex: number) => {
    if (finished || !currentQuestion || submitted) return;
    setSelectedIndex(optionIndex);
  };

  const submitAnswer = () => {
    if (selectedIndex < 0 || submitted) return;

    const isCorrect = selectedIndex === currentQuestion.correctIndex;
    setFeedback(isCorrect ? "Õige vastus!" : "Vale vastus.");
    setSubmitted(true);

    const newAnswer: Answer = {
      questionId: currentQuestion.id,
      selectedIndex: selectedIndex,
      correct: isCorrect,
    };

    setAnswers((prev) => {
      const filtered = prev.filter((a) => a.questionId !== currentQuestion.id);
      return [...filtered, newAnswer];
    });
  };

  const nextQuestion = () => {
    if (!submitted) return;

    setSelectedIndex(-1);
    setFeedback("");
    setSubmitted(false);
    setCurrentIndex((prev) => prev + 1);
  };

  const restartQuiz = () => {
    setCurrentIndex(0);
    setSelectedIndex(-1);
    setAnswers([]);
    setFeedback("");
    setSubmitted(false);
  };

  return (
    <div className="quiz-page">
      <div className="quiz-card">
        <h1 className="quiz-title">Statistikaameti interaktiivne viktoriin</h1>

        {!finished && currentQuestion ? (
          <div>
            <p className="quiz-question">{`Küsimus ${currentIndex + 1} / ${total}`}</p>
            <p className="quiz-subquestion">{currentQuestion.text}</p>

            <div className="quiz-options">
              {currentQuestion.options.map((option, idx) => {
                const isSelected = selectedIndex === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => selectOption(idx)}
                    disabled={submitted}
                    className={`quiz-option ${isSelected ? "quiz-option--selected" : ""}`}
                  >
                    {String.fromCharCode(97 + idx)}) {option}
                  </button>
                );
              })}
            </div>

            {submitted && (
              <p className={`quiz-feedback ${feedback === "Õige vastus!" ? "quiz-feedback--correct" : "quiz-feedback--wrong"}`}>
                {feedback}
              </p>
            )}

            {selectedIndex >= 0 && !submitted ? (
              <button
                onClick={submitAnswer}
                className="quiz-button"
              >
                Esita vastus
              </button>
            ) : submitted ? (
              <button
                onClick={nextQuestion}
                className="quiz-button"
              >
                {currentIndex === total - 1 ? "Vaata tulemusi" : "Järgmine küsimus"}
              </button>
            ) : null}
          </div>
        ) : (
          <div>
            <h2 className="quiz-title" style={{ fontSize: "1.5rem" }}>Tulemused</h2>
            <div className="quiz-results-box">
              <p className="font-semibold">Skoor: {score} / {total}</p>
              <p>{finalMessage}</p>
            </div>

            <ResultTable answers={answers} questions={initialQuestions} />

            <button onClick={restartQuiz} className="quiz-button">
              Alusta uuesti
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
