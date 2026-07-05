import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Document, Packer, Paragraph, TextRun } from "docx";

/* =========================
   SAFE CHECK
========================= */
const isNative = () =>
  typeof window !== "undefined" &&
  (window as any).Capacitor?.isNativePlatform?.();

/* =========================
   SHARE HELPER
========================= */
const shareFile = async (filePath: string, title: string) => {
  if (!isNative()) return;

  try {
    const { Share } = await import("@capacitor/share");

    await Share.share({
      title,
      url: filePath,
    });
  } catch (e) {
    console.log("Share error:", e);
  }
};

/* =========================
   CREATE EXAM FOLDER
========================= */
const getFilesystem = async () => {
  const cap = await import("@capacitor/filesystem");
  return {
    Filesystem: cap.Filesystem,
    Directory: cap.Directory,
  };
};

/* =========================
   PDF EXPORT
========================= */
export const exportPDF = async (elementId: string) => {
  const el = document.getElementById(elementId);

  if (!el) {
    alert("عنصر پیدا نشد");
    return;
  }

  const canvas = await html2canvas(el, {
    scale: 2,
    useCORS: true,
  });

  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF("p", "mm", "a4");

  const width = 210;
  const height = (canvas.height * width) / canvas.width;

  pdf.addImage(imgData, "PNG", 0, 0, width, height);

  const fileName = `exam_${Date.now()}.pdf`;

  /* ================= WEB ================= */
  if (!isNative()) {
    pdf.save(fileName);
    return;
  }

  /* ================= ANDROID ================= */
  const { Filesystem, Directory } = await getFilesystem();

  const base64 = pdf.output("datauristring").split(",")[1];

  const result = await Filesystem.writeFile({
    path: `Exam/${fileName}`,
    data: base64,
    directory: Directory.Documents,
  });

  await shareFile(result.uri, "PDF Exam");
};

/* =========================
   WORD EXPORT
========================= */
export const exportWord = async (exam: any) => {
  const doc = new Document({
    sections: [
      {
        children: exam.questions.map(
          (q: any, i: number) =>
            new Paragraph({
              children: [
                new TextRun(`${i + 1}) ${q.text}`),
              ],
            })
        ),
      },
    ],
  });

  const blob = await Packer.toBlob(doc);

  const fileName = `exam_${Date.now()}.docx`;

  /* ================= WEB ================= */
  if (!isNative()) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    return;
  }

  /* ================= ANDROID ================= */
  const { Filesystem, Directory } = await getFilesystem();

  const base64 = await blobToBase64(blob);

  const result = await Filesystem.writeFile({
    path: `Exam/${fileName}`,
    data: base64,
    directory: Directory.Documents,
  });

  await shareFile(result.uri, "Word Exam");
};

/* =========================
   BASE64 CONVERT
========================= */
const blobToBase64 = (blob: Blob): Promise<string> =>
  new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve((reader.result as string).split(",")[1]);
    };
    reader.readAsDataURL(blob);
  });
