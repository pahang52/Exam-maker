import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { ExamData, HeaderInfo, Question } from "./types";
import { saveExam, getAllExams } from "./utils/storage";

import HeaderForm from "./components/HeaderForm";
import QuestionSection from "./components/QuestionSection";
import ExamList from "./components/ExamList";

console.log("APP LOADED");

const defaultHeader: HeaderInfo = {
  schoolName: "",
  studentName: "",
  fatherName: "",
  subject: "",
  grade: "",
  academicYear: "",
  date: "",
  teacherName: "",
  examTitle: "",
};

const App: React.FC = () => {
  const [header, setHeader] = useState<HeaderInfo>(defaultHeader);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [examId, setExamId] = useState(uuidv4());
  const [savedExams, setSavedExams] = useState<ExamData[]>([]);
  const [tab, setTab] = useState<"designer" | "saved">("designer");

  useEffect(() => {
    setSavedExams(getAllExams());
  }, []);

  const totalScore = questions.reduce((a, b) => a + b.score, 0);

  const handleSave = () => {
    const exam: ExamData = {
      id: examId,
      header,
      questions,
      totalScore,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveExam(exam);
    setSavedExams(getAllExams());
  };

  return (
    <div className="min-h-screen bg-gray-100" dir="rtl">

      <header className="bg-blue-900 text-white p-4">
        <h1>Exam Builder</h1>
      </header>

      <div className="p-3 flex gap-2">
        <button onClick={() => setTab("designer")}>طراحی</button>
        <button onClick={() => setTab("saved")}>ذخیره شده</button>
      </div>

      {tab === "designer" ? (
        <>
          <HeaderForm header={header} onChange={setHeader} />

          <QuestionSection
            questions={questions}
            onAdd={(q) => setQuestions([...questions, q])}
            onUpdate={(q) =>
              setQuestions(questions.map((x) => (x.id === q.id ? q : x)))
            }
            onDelete={(id) =>
              setQuestions(questions.filter((q) => q.id !== id))
            }
          />

          <button
            className="bg-green-600 text-white p-2 m-3"
            onClick={handleSave}
          >
            ذخیره
          </button>
        </>
      ) : (
        <ExamList exams={savedExams} />
      )}
    </div>
  );
};

export default App;
