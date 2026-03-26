"use client";

import { useMemo, useState } from "react";

type Question = {
  id: number;
  text: string;
  options: string[];
  correctIndex: number;
};

type Answer = {
  questionId: number;
  selectedIndex: number;
  correct: boolean;
};

const questions: Question[] = [
  {
    id: 1,
    text: "Mis on Eesti pealinn?",
    options: ["Tallinn", "Tartu", "Narva"],
    correctIndex: 0,
  },
  {
    id: 2,
    text: "Kui palju maakondi on Eestis?",
    options: ["12", "15", "14"],
    correctIndex: 2,
  },
  {
    id: 3,
    text: "Mis on Eesti rahvustoit?",
    options: ["Sült", "Verivorst", "Hakklihakaste"],
    correctIndex: 0,
  },
];

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [feedback, setFeedback] = useState<string>("");

  const currentQuestion = questions[currentIndex];
  const finished = currentIndex >= questions.length;

  const score = useMemo(
    () => answers.filter((item) => item.correct).length,
    [answers]
  );

  const total = questions.length;
  const finalMessage = useMemo(() => {
    if (score === total) return "Suurepärane! Sa tead Eesti kohta kõike väga hästi!";
    if (score >= total - 1) return "Hea töö! Väike täiendus ja tulemus on täiuslik.";
    return "Jään veel harjutama. Statistikaameti ressursid aitavad!";
  }, [score, total]);

  const selectOption = (optionIndex: number) => {
    if (finished) return;

    setSelectedIndex(optionIndex);
    const isCorrect = optionIndex === currentQuestion.correctIndex;
    setFeedback(isCorrect ? "Õige vastus!" : "Vale vastus.");

    const newAnswer: Answer = {
      questionId: currentQuestion.id,
      selectedIndex: optionIndex,
      correct: isCorrect,
    };

    setAnswers((prev) => {
      const filtered = prev.filter((a) => a.questionId !== currentQuestion.id);
      return [...filtered, newAnswer];
    });
  };

  const nextQuestion = () => {
    if (selectedIndex === null) return;

    setSelectedIndex(null);
    setFeedback("");
    setCurrentIndex((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-[#f1f8ff] text-[#052358] px-4 py-8 sm:px-6 lg:px-12">
      <div className="mx-auto w-full max-w-3xl rounded-2xl border border-[#0d4ca4] bg-white p-6 shadow-lg">
        <h1 className="mb-4 text-3xl font-bold tracking-tight">Statistikaameti interaktiivne viktoriin</h1>

        {!finished ? (
          <div>
            <p className="mb-3 text-lg font-semibold">{`Küsimus ${currentIndex + 1} / ${total}`}</p>
            <p className="mb-6 text-xl">{currentQuestion.text}</p>

            <div className="flex flex-col gap-3">
              {currentQuestion.options.map((option, idx) => {
                const isSelected = selectedIndex === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => selectOption(idx)}
                    className={`rounded-lg border p-3 text-left transition ${
                      isSelected
                        ? "border-[#0d4ca4] bg-[#dfe8ff]"
                        : "border-[#9db8d6] bg-white hover:border-[#0d4ca4] hover:bg-[#eef6ff]"
                    }`}
                  >
                    {String.fromCharCode(97 + idx)}) {option}
                  </button>
                );
              })}
            </div>

            {selectedIndex !== null && (
              <p className={`mt-4 rounded px-3 py-2 font-semibold ${
                feedback === "Õige vastus!" ? "bg-[#ddf8e2] text-[#1c7b32]" : "bg-[#ffe2e1] text-[#a12f2f]"
              }`}>
                {feedback}
              </p>
            )}

            <button
              onClick={nextQuestion}
              disabled={selectedIndex === null}
              className="mt-5 inline-flex items-center rounded-lg border border-[#0d4ca4] bg-[#0d4ca4] px-5 py-2 font-semibold text-white disabled:cursor-not-allowed disabled:bg-[#a7bbd8]"
            >
              {currentIndex === total - 1 ? "Vaata tulemusi" : "Järgmine küsimus"}
            </button>
          </div>
        ) : (
          <div>
            <h2 className="mb-4 text-2xl font-bold">Tulemused</h2>
            <div className="mb-2 rounded border border-[#9db8d6] bg-[#f0f5ff] p-4">
              <p className="font-semibold">Skoor: {score} / {total}</p>
              <p>{finalMessage}</p>
            </div>

            <div className="overflow-auto rounded border border-[#9db8d6]">
              <table className="w-full border-collapse text-left">
                <thead className="bg-[#dbe9ff] text-sm font-semibold">
                  <tr>
                    <th className="border p-2">Küsimus</th>
                    <th className="border p-2">Sinu vastus</th>
                    <th className="border p-2">Oleekas õige</th>
                  </tr>
                </thead>
                <tbody>
                  {answers.map((ans) => {
                    const question = questions.find((q) => q.id === ans.questionId);
                    if (!question) return null;
                    return (
                      <tr key={ans.questionId} className="text-sm">
                        <td className="border p-2">{question.text}</td>
                        <td className="border p-2">{question.options[ans.selectedIndex]}</td>
                        <td className="border p-2">{ans.correct ? "Õige" : "Vale"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <button
              onClick={() => {
                setCurrentIndex(0);
                setSelectedIndex(null);
                setAnswers([]);
                setFeedback("");
              }}
              className="mt-5 rounded-lg border border-[#0d4ca4] bg-[#0d4ca4] px-5 py-2 font-semibold text-white"
            >
              Alusta uuesti
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
