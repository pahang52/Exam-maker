import React, { useEffect, useState } from "react";
import HeaderForm from "./components/HeaderForm";
import QuestionSection from "./components/QuestionSection";
import ExamList from "./components/ExamList";
import { getAllExams, saveExam } from "./utils/storage";
import { v4 as uuidv4 } from "uuid";

export default function App() {
  const [header, setHeader] = useState<any>({});
  const [questions, setQuestions] = useState<any[]>([]);
  const [exams, setExams] = useState<any[]>([]);
  const [examId] = useState(uuidv4());

  useEffect(() => {
    console.log("APP LOADED");
    setExams(getAllExams());
  }, []);

  const addExam = () => {
    const exam = {
      id: examId,
      header,
      questions,
      totalScore: questions.reduce((a, b) => a + (b.score || 1), 0),
    };

    saveExam(exam);
    setExams(getAllExams());
  };

  return (
    <div style={{ padding: 10 }}>

      <h2>Exam Maker</h2>

      <HeaderForm header={header} onChange={setHeader} />

      <QuestionSection
        questions={questions}
        onAdd={(q: any) => setQuestions([...questions, q])}
      />

      <button onClick={addExam}>
        ذخیره آزمون
      </button>

      <div id="exam-container">
        {questions.map((q, i) => (
          <div key={i}>
            {i + 1}) {q.text}
          </div>
        ))}
      </div>

      <ExamList exams={exams} />
    </div>
  );
}
