import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Document, Packer, Paragraph, TextRun } from "docx";

/* =========================
   CHECK PLATFORM
========================= */
const isNative = () =>
  typeof window !== "undefined" &&
  (window as any).Capacitor?.isNativePlatform?.();

/* =========================
   SHARE
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
   SAVE TO ANDROID
========================= */
const saveToAndroid = async (base64: string, fileName: string) => {
  const { Filesystem, Directory } = await import("@capacitor/filesystem");

  const path = `ExamMaker/${fileName}`;

  const result = await Filesystem.writeFile({
    path,
    data: base64,
    directory: Directory.Documents,
    recursive: true,
  });

  return result.uri;
};

/* =========================
   PDF EXPORT
========================= */
export const exportPDF = async (elementId: string) => {
  const el = document.getElementById(elementId);
  if (!el) return;

  const canvas = await html2canvas(el, {
    scale: 2,
    useCORS: true,
  });

  const img = canvas.toDataURL("image/png");

  const pdf = new jsPDF("p", "mm", "a4");

  const width = 210;
  const height = (canvas.height * width) / canvas.width;

  pdf.addImage(img, "PNG", 0, 0, width, height);

  const fileName = `exam_${Date.now()}.pdf`;

  /* WEB */
  if (!isNative()) {
    pdf.save(fileName);
    return;
  }

  /* ANDROID */
  const base64 = pdf.output("datauristring").split(",")[1];

  const uri = await saveToAndroid(base64, fileName);

  await shareFile(uri, "PDF Exam");
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
              children: [new TextRun(`${i + 1}) ${q.text}`)],
            })
        ),
      },
    ],
  });

  const blob = await Packer.toBlob(doc);

  const fileName = `exam_${Date.now()}.docx`;

  /* WEB */
  if (!isNative()) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    return;
  }

  /* ANDROID */
  const base64 = await blobToBase64(blob);

  const uri = await saveToAndroid(base64, fileName);

  await shareFile(uri, "Word Exam");
};

/* =========================
   PRINT
========================= */
export const printExam = async (elementId: string) => {
  const el = document.getElementById(elementId);
  if (!el) return;

  const canvas = await html2canvas(el, { scale: 2 });

  const img = canvas.toDataURL("image/png");

  const win = window.open("", "_blank");
  if (!win) return;

  win.document.write(`
    <html>
      <head><title>Print</title></head>
      <body style="text-align:center;">
        <img src="${img}" style="width:100%" />
        <script>
          window.onload = () => window.print();
        </script>
      </body>
    </html>
  `);

  win.document.close();
};

/* =========================
   BASE64
========================= */
const blobToBase64 = (blob: Blob): Promise<string> =>
  new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve((reader.result as string).split(",")[1]);
    };
    reader.readAsDataURL(blob);
  });
