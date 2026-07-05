import React, { useEffect, useState } from "react";
import { exportPDF, exportWord, printExam } from "./utils/export";

export default function App() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    console.log("APP LOADED");
    setLoaded(true);
  }, []);

  if (!loaded) return <div>Loading...</div>;

  return (
    <div style={{ padding: 20 }}>
      <h1>Exam App</h1>

      <div id="exam-container">
        <p>نمونه سوال</p>
      </div>

      <button onClick={() => exportPDF("exam-container")}>
        دانلود PDF
      </button>

      <button onClick={() => exportWord({ questions: [{ text: "سوال 1" }] })}>
        دانلود Word
      </button>

      <button onClick={() => printExam("exam-container")}>
        چاپ
      </button>
    </div>
  );
}
