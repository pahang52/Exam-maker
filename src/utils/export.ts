import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { Filesystem, Directory } from "@capacitor/filesystem";
import { Share } from "@capacitor/share";
import { ExamData } from "../types";

/* =========================
   PLATFORM CHECK
========================= */
const isNative = () =>
  !!(window as any)?.Capacitor?.isNativePlatform?.();

/* =========================
   FOLDER NAME
========================= */
const FOLDER = "Exam";

/* =========================
   BASE64 CONVERT
========================= */
const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () =>
      resolve((reader.result as string).split(",")[1]);
    reader.readAsDataURL(blob);
  });
};

/* =========================
   SAVE TO ANDROID STORAGE
========================= */
const saveToDevice = async (fileName: string, blob: Blob, mime: string) => {
  const base64 = await blobToBase64(blob);

  return await Filesystem.writeFile({
    path: `${FOLDER}/${fileName}`,
    data: base64,
    directory: Directory.Documents,
    recursive: true,
  });
};

/* =========================
   SHARE FILE
========================= */
const shareFile = async (fileUri: string, title: string) => {
  try {
    await Share.share({
      title,
      url: fileUri,
      dialogTitle: "اشتراک گذاری فایل",
    });
  } catch (e) {
    console.log("Share error:", e);
  }
};

/* =========================
   WORD EXPORT
========================= */
export const exportWord = async (exam: ExamData) => {
  try {
    const doc = new Document({
      sections: [
        {
          children: exam.questions.map(
            (q, i) =>
              new Paragraph({
                children: [
                  new TextRun(`${i + 1}) ${q.text} (${q.score})`),
                ],
              })
          ),
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    const fileName = `exam_${Date.now()}.docx`;

    if (isNative()) {
      const saved = await saveToDevice(fileName, blob, "docx");
      await shareFile(saved.uri, "Word Exam");
    } else {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      a.click();
    }
  } catch (err) {
    console.error("WORD ERROR:", err);
    alert("خطا در ساخت Word");
  }
};

/* =========================
   PDF EXPORT (FIX + MULTI DEVICE)
========================= */
export const exportPDF = async (elementId: string) => {
  try {
    const el = document.getElementById(elementId);
    if (!el) {
      alert("بخش آزمون پیدا نشد");
      return;
    }

    const canvas = await html2canvas(el, {
      scale: 2,
      useCORS: true,
    });

    const img = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");

    const w = 210;
    const h = (canvas.height * w) / canvas.width;

    pdf.addImage(img, "PNG", 0, 0, w, h);

    const blob = pdf.output("blob");
    const fileName = `exam_${Date.now()}.pdf`;

    if (isNative()) {
      const saved = await saveToDevice(fileName, blob, "pdf");
      await shareFile(saved.uri, "PDF Exam");
    } else {
      pdf.save(fileName);
    }
  } catch (err) {
    console.error("PDF ERROR:", err);
    alert("خطا در ساخت PDF");
  }
};

/* =========================
   PRINT
========================= */
export const printExam = () => {
  window.print();
};
