"use client";

import { Answer, Question } from "./types";

type ResultTableProps = {
  answers: Answer[];
  questions: Question[];
};

export function ResultTable({ answers, questions }: ResultTableProps) {
  return (
    <div className="quiz-table-container">
      <table className="quiz-table">
        <thead>
          <tr>
            <th>Küsimus</th>
            <th>Sinu vastus</th>
            <th>Õige vastus</th>
          </tr>
        </thead>
        <tbody>
          {answers.map((ans) => {
            const question = questions.find((q) => q.id === ans.questionId);
            if (!question) return null;

            return (
              <tr key={ans.questionId}>
                <td>{question.text}</td>
                <td>{question.options[ans.selectedIndex]}</td>
                <td>{ans.correct ? "Õige" : "Vale"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
