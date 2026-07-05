import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Filesystem, Directory, Encoding } from "@capacitor/filesystem";
import { Share } from "@capacitor/share";
import { ExamData } from "../types";

const isNative = () => !!(window as any).Capacitor?.isNativePlatform();

export const exportPDF = async (elementId: string, exam?: ExamData) => {
  try {
    const element = document.getElementById(elementId);

    if (!element) {
      throw new Error("Element not found");
    }

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");

    const pageWidth = 210;
    const pageHeight = (canvas.height * pageWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pageHeight);

    const pdfBlob = pdf.output("blob");

    const fileName = `exam_${exam?.header?.subject || "file"}_${Date.now()}.pdf`;

    // 🔥 Android APK
    if (isNative()) {
      const base64 = await blobToBase64(pdfBlob);

      const saved = await Filesystem.writeFile({
        path: fileName,
        data: base64,
        directory: Directory.Documents,
      });

      await Share.share({
        title: "PDF Exam",
        url: saved.uri,
      });
    } else {
      // 🌐 Web
      pdf.save(fileName);
    }
  } catch (err) {
    console.error("PDF ERROR:", err);
    alert("خطا در ساخت PDF");
  }
};

// helper
const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve((reader.result as string).split(",")[1]);
    };
    reader.readAsDataURL(blob);
  });
};
