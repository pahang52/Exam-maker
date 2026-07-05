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

type Tab = "designer" | "saved";

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("designer");
  const [header, setHeader] = useState<HeaderInfo>(defaultHeader);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [examId, setExamId] = useState(uuidv4());
  const [savedExams, setSavedExams] = useState<ExamData[]>([]);

  useEffect(() => {
    setSavedExams(getAllExams());
    console.log("APP LOADED");
  }, []);

  const totalScore = questions.reduce((sum, q) => sum + q.score, 0);

  const getExamData = (): ExamData => ({
    id: examId,
    header,
    questions,
    totalScore,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  const handleSave = () => {
    saveExam(getExamData());
    setSavedExams(getAllExams());
  };

  const handlePDF = () => exportPDF(getExamData() as any);
  const handleWord = () => exportWord(getExamData());

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50">

      <HeaderForm header={header} onChange={setHeader} />

      {QUESTION_TYPES.map((qt) => (
        <QuestionSection
          key={qt.type}
          type={qt.type}
          questions={questions.filter(q => q.type === qt.type)}
          allQuestionsCount={questions.length}
          startIndex={1}
          onAdd={(q) => setQuestions([...questions, q])}
          onUpdate={() => {}}
          onDelete={(id) => setQuestions(questions.filter(q => q.id !== id))}
          icon={qt.icon}
          bgColor={qt.bgColor}
          borderColor={qt.borderColor}
        />
      ))}

      <div className="fixed bottom-0 left-0 right-0 bg-white p-3 flex gap-2 justify-center">
        <button onClick={handleSave}>ذخیره</button>
        <button onClick={handlePDF}>PDF</button>
        <button onClick={handleWord}>Word</button>
      </div>

      <ExamList exams={savedExams} onEdit={() => {}} />
    </div>
  );
}
