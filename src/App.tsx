import React, { useEffect, useState } from "react";

import HeaderForm from "./components/HeaderForm";
import QuestionSection from "./components/QuestionSection";
import ExamList from "./components/ExamList";

import { saveExam, getAllExams } from "./utils/storage";
import { exportPDF, exportWord } from "./utils/export";
import { v4 as uuidv4 } from "uuid";

/* =========================
   SAFE DEFAULT DATA
========================= */
const defaultHeader = {
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

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [tab, setTab] = useState<"designer" | "saved">("designer");

  const [header, setHeader] = useState<any>(defaultHeader);
  const [questions, setQuestions] = useState<any[]>([]);
  const [exams, setExams] = useState<any[]>([]);
  const [examId, setExamId] = useState(uuidv4());

  /* =========================
     INIT SAFE (NO WHITE SCREEN)
  ========================= */
  useEffect(() => {
    console.log("APP LOADED ✔");

    try {
      const data = getAllExams();
      setExams(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log("storage error", err);
      setExams([]);
    }

    setLoaded(true);
  }, []);

  /* =========================
     SAFE LOADING
  ========================= */
  if (!loaded) {
    return (
      <div style={{ padding: 20 }}>
        Loading...
      </div>
    );
  }

  /* =========================
     CALC SCORE
  ========================= */
  const totalScore = questions.reduce(
    (sum, q) => sum + (q?.score || 0),
    0
  );

  const getExamData = () => ({
    id: examId,
    header,
    questions,
    totalScore,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  /* =========================
     QUESTION HANDLERS
  ========================= */
  const addQuestion = (q: any) => {
    setQuestions((prev) => [...prev, q]);
  };

  const deleteQuestion = (id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  /* =========================
     SAVE EXAM
  ========================= */
  const handleSave = () => {
    try {
      saveExam(getExamData());
      setExams(getAllExams());
      alert("آزمون ذخیره شد ✔");
    } catch (e) {
      alert("خطا در ذخیره");
    }
  };

  /* =========================
     EXPORT SAFE
  ========================= */
  const handlePDF = async () => {
    try {
      await exportPDF("exam-container");
    } catch (e) {
      console.log(e);
      alert("خطا در PDF");
    }
  };

  const handleWord = async () => {
    try {
      await exportWord(getExamData());
    } catch (e) {
      console.log(e);
      alert("خطا در Word");
    }
  };

  /* =========================
     UI
  ========================= */
  return (
    <div style={{ padding: 16 }}>

      <h2>Exam Designer</h2>

      {/* Tabs */}
      <div style={{ marginBottom: 10 }}>
        <button onClick={() => setTab("designer")}>
          طراحی
        </button>

        <button onClick={() => setTab("saved")}>
          ذخیره شده
        </button>
      </div>

      {/* DESIGNER */}
      {tab === "designer" && (
        <>
          <HeaderForm header={header} onChange={setHeader} />

          {/* Exam Preview */}
          <div id="exam-container">
            {questions.map((q, i) => (
              <div key={q.id || i} style={{ marginBottom: 6 }}>
                {i + 1}) {q.text} ({q.score})
                <button onClick={() => deleteQuestion(q.id)}>
                  حذف
                </button>
              </div>
            ))}
          </div>

          {/* ACTIONS */}
          <div style={{ marginTop: 20 }}>
            <button onClick={handleSave}>
              ذخیره
            </button>

            <button onClick={handlePDF}>
              PDF
            </button>

            <button onClick={handleWord}>
              Word
            </button>
          </div>
        </>
      )}

      {/* SAVED EXAMS */}
      {tab === "saved" && (
        <ExamList
          exams={exams}
          onRefresh={() => setExams(getAllExams())}
          onEdit={(exam: any) => {
            setHeader(exam.header);
            setQuestions(exam.questions);
            setExamId(exam.id);
            setTab("designer");
          }}
        />
      )}

    </div>
  );
}
