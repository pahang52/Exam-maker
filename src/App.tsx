import React, { useEffect, useState } from "react";
import HeaderForm from "./components/HeaderForm";
import QuestionSection from "./components/QuestionSection";
import ExamList from "./components/ExamList";
import { saveExam, getAllExams } from "./utils/storage";
import { exportPDF, exportWord } from "./utils/export";
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

  const safeExportPDF = async () => {
    try {
      await exportPDF("exam-container");
    } catch (e) {
      console.log(e);
      alert("خطا در PDF");
    }
  };

  const safeExportWord = async () => {
    try {
      await exportWord({
        header,
        questions,
        id: examId,
      } as any);
    } catch (e) {
      console.log(e);
      alert("خطا در Word");
    }
  };

  return (
    <div style={{ padding: 10 }}>

      <h2>Exam Maker</h2>

      <HeaderForm header={header} onChange={setHeader} />

      <QuestionSection
        type="multiple-choice"
        questions={questions}
        onAdd={(q: any) => setQuestions([...questions, q])}
        onUpdate={() => {}}
        onDelete={() => {}}
        allQuestionsCount={questions.length}
        startIndex={1}
        icon=""
        bgColor=""
        borderColor=""
      />

      <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
        <button onClick={safeExportPDF}>PDF</button>
        <button onClick={safeExportWord}>Word</button>
      </div>

      <div id="exam-container" style={{ marginTop: 20 }}>
        {questions.map((q, i) => (
          <div key={i}>
            {i + 1}. {q.text}
          </div>
        ))}
      </div>

      <ExamList exams={exams} />
    </div>
  );
}
