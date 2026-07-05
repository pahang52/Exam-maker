import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

import {
  Question,
  QuestionType,
  HeaderInfo,
  ExamData,
} from "./types";

import { saveExam, getAllExams } from "./utils/storage";
import { exportPDF, exportWord } from "./utils/export";

import HeaderForm from "./components/HeaderForm";
import QuestionSection from "./components/QuestionSection";
import ExamList from "./components/ExamList";

const QUESTION_TYPES: { type: QuestionType; icon: string; bgColor: string; borderColor: string }[] = [
  { type: "true-false", icon: "✓✗", bgColor: "bg-green-50", borderColor: "border-green-200" },
  { type: "fill-blank", icon: "📝", bgColor: "bg-blue-50", borderColor: "border-blue-200" },
  { type: "matching", icon: "↔️", bgColor: "bg-purple-50", borderColor: "border-purple-200" },
  { type: "multiple-choice", icon: "⊙", bgColor: "bg-orange-50", borderColor: "border-orange-200" },
  { type: "short-answer", icon: "✏️", bgColor: "bg-yellow-50", borderColor: "border-yellow-200" },
  { type: "descriptive", icon: "📄", bgColor: "bg-red-50", borderColor: "border-red-200" },
];

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
  const [examId, setExamId] = useState<string>(uuidv4());
  const [savedExams, setSavedExams] = useState<ExamData[]>([]);
  const [tab, setTab] = useState<"designer" | "saved">("designer");

  useEffect(() => {
    setSavedExams(getAllExams());
  }, []);

  const totalScore = questions.reduce((s, q) => s + q.score, 0);

  const getExamData = (): ExamData => ({
    id: examId,
    header,
    questions,
    totalScore,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  const handleSave = () => {
    if (!questions.length) return alert("حداقل یک سوال اضافه کنید");
    saveExam(getExamData());
    setSavedExams(getAllExams());
  };

  const handlePDF = async () => {
    if (!questions.length) return;
    await exportPDF("exam-container");
  };

  const handleWord = async () => {
    if (!questions.length) return;
    await exportWord(getExamData());
  };

  const handleAdd = (q: Question) =>
    setQuestions((p) => [...p, q]);

  const handleUpdate = (q: Question) =>
    setQuestions((p) => p.map((x) => (x.id === q.id ? q : x)));

  const handleDelete = (id: string) =>
    setQuestions((p) => p.filter((x) => x.id !== id));

  const byType = Object.fromEntries(
    QUESTION_TYPES.map((t) => [
      t.type,
      questions.filter((q) => q.type === t.type),
    ])
  );

  return (
    <div dir="rtl" className="min-h-screen bg-gray-100">

      <header className="bg-blue-900 text-white p-4 font-bold">
        Exam Builder
      </header>

      <div className="p-4">

        {tab === "designer" ? (
          <>
            <HeaderForm header={header} onChange={setHeader} />

            <div id="exam-container">
              {QUESTION_TYPES.map((t) => (
                <QuestionSection
                  key={t.type}
                  type={t.type}
                  questions={byType[t.type] || []}
                  allQuestionsCount={questions.length}
                  startIndex={1}
                  onAdd={handleAdd}
                  onUpdate={handleUpdate}
                  onDelete={handleDelete}
                  icon={t.icon}
                  bgColor={t.bgColor}
                  borderColor={t.borderColor}
                />
              ))}
            </div>

            <div className="fixed bottom-3 left-0 right-0 flex justify-center gap-2">
              <button onClick={handleSave} className="bg-green-600 text-white px-3 py-2 rounded">
                Save
              </button>

              <button onClick={handlePDF} className="bg-red-600 text-white px-3 py-2 rounded">
                PDF
              </button>

              <button onClick={handleWord} className="bg-blue-600 text-white px-3 py-2 rounded">
                Word
              </button>

              <button
                onClick={() => {
                  setHeader(defaultHeader);
                  setQuestions([]);
                  setExamId(uuidv4());
                }}
                className="bg-gray-600 text-white px-3 py-2 rounded"
              >
                New
              </button>
            </div>
          </>
        ) : (
          <ExamList
            exams={savedExams}
            onEdit={(e) => {
              setHeader(e.header);
              setQuestions(e.questions);
              setExamId(e.id);
              setTab("designer");
            }}
            onRefresh={() => setSavedExams(getAllExams())}
          />
        )}

      </div>
    </div>
  );
};

export default App;
