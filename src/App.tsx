import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

import {
  Question,
  QuestionType,
  HeaderInfo,
  ExamData,
} from "./types";

import { saveExam, getAllExams } from "./utils/storage";

// export ها (اگر هنوز مشکل داری چک کن مسیر درست باشه)
import { exportPDF, exportWord } from "./utils/export";

import HeaderForm from "./components/HeaderForm";
import QuestionSection from "./components/QuestionSection";
import ExamList from "./components/ExamList";

const QUESTION_TYPES: {
  type: QuestionType;
  icon: string;
  bgColor: string;
  borderColor: string;
}[] = [
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

const App: React.FC = () => {
  console.log("APP LOADED"); // ✅ اینو گفتی خواستی

  const [activeTab, setActiveTab] = useState<Tab>("designer");
  const [header, setHeader] = useState<HeaderInfo>(defaultHeader);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [examId, setExamId] = useState<string>(uuidv4());
  const [savedExams, setSavedExams] = useState<ExamData[]>([]);

  const [notification, setNotification] = useState<{
    msg: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    console.log("LOAD SAVED EXAMS");
    setSavedExams(getAllExams());
  }, []);

  const showNotification = (msg: string, type: "success" | "error" = "success") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

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
    if (!questions.length) {
      showNotification("حداقل یک سوال اضافه کنید", "error");
      return;
    }

    saveExam(getExamData());
    setSavedExams(getAllExams());
    showNotification("ذخیره شد ✅");
  };

  const handlePrintPDF = async () => {
    try {
      await exportPDF("exam-container"); // مهم
      showNotification("PDF ساخته شد");
    } catch (e) {
      console.error(e);
      showNotification("خطا در PDF", "error");
    }
  };

  const handleExportWord = async () => {
    try {
      await exportWord(getExamData());
      showNotification("Word ساخته شد");
    } catch (e) {
      console.error(e);
      showNotification("خطا در Word", "error");
    }
  };

  const handleNew = () => {
    setHeader(defaultHeader);
    setQuestions([]);
    setExamId(uuidv4());
  };

  return (
    <div className="min-h-screen bg-gray-100" dir="rtl">

      {notification && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-2 rounded">
          {notification.msg}
        </div>
      )}

      <header className="bg-blue-900 text-white p-4">
        <h1>طراح سوالات آزمون</h1>
      </header>

      <main className="p-4">

        {activeTab === "designer" ? (
          <>
            <HeaderForm header={header} onChange={setHeader} />

            <div id="exam-container">
              {QUESTION_TYPES.map((qt) => (
                <QuestionSection
                  key={qt.type}
                  type={qt.type}
                  questions={questions.filter(q => q.type === qt.type)}
                  allQuestionsCount={questions.length}
                  startIndex={1}
                  onAdd={(q) => setQuestions([...questions, q])}
                  onUpdate={(q) =>
                    setQuestions(questions.map(x => x.id === q.id ? q : x))
                  }
                 
