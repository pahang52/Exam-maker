import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Document, Packer, Paragraph, TextRun } from "docx";

/* =======================
   SAFE CHECK
======================= */
const isNative = () =>
  typeof window !== "undefined" &&
  (window as any).Capacitor?.isNativePlatform?.();

/* =======================
   PDF EXPORT
======================= */
export const exportPDF = async (elementId: string) => {
  const element = document.getElementById(elementId);
  if (!element) {
    alert("عنصر پیدا نشد");
    return;
  }

  const canvas = await html2canvas(element);
  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF("p", "mm", "a4");

  const width = 210;
  const height = (canvas.height * width) / canvas.width;

  pdf.addImage(imgData, "PNG", 0, 0, width, height);

  const fileName = `exam_${Date.now()}.pdf`;

  // Web
  if (!isNative()) {
    pdf.save(fileName);
    return;
  }

  // Android (Capacitor safe)
  const { Filesystem, Directory, Encoding } = await import(
    "@capacitor/filesystem"
  );

  const base64 = pdf.output("datauristring").split(",")[1];

  await Filesystem.writeFile({
    path: `Exam/${fileName}`,
    data: base64,
    directory: Directory.Documents,
  });
};

/* =======================
   WORD EXPORT
======================= */
export const exportWord = async (exam: any) => {
  const doc = new Document({
    sections: [
      {
        children: exam.questions.map(
          (q: any, i: number) =>
            new Paragraph({
              children: [
                new TextRun(`${i + 1}) ${q.text || ""}`),
              ],
            })
        ),
      },
    ],
  });

  const blob = await Packer.toBlob(doc);

  const fileName = `exam_${Date.now()}.docx`;

  if (!isNative()) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    return;
  }

  const { Filesystem, Directory } = await import(
    "@capacitor/filesystem"
  );

  const base64 = await blobToBase64(blob);

  await Filesystem.writeFile({
    path: `Exam/${fileName}`,
    data: base64,
    directory: Directory.Documents,
  });
};

/* =======================
   BASE64
======================= */
const blobToBase64 = (blob: Blob) =>
  new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve((reader.result as string).split(",")[1]);
    };
    reader.readAsDataURL(blob);
  });
