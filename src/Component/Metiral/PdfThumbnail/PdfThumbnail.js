import { useEffect, useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import "pdfjs-dist/build/pdf.worker.min";

pdfjsLib.GlobalWorkerOptions.workerSrc =
  `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

function PdfThumbnail({ pdfUrl, onClick }) {
  const canvasRef = useRef(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const renderThumbnail = async () => {
      try {
        const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
        const page = await pdf.getPage(1);

        const viewport = page.getViewport({ scale: 0.7 });
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({
          canvasContext: context,
          viewport,
        }).promise;

        setLoading(false);
      } catch (error) {
        console.error("PDF thumbnail error:", error);
      }
    };

    renderThumbnail();
  }, [pdfUrl]);

  return (
    <div onClick={onClick} style={{ cursor: "pointer" }}>
      {loading && <p>Loading...</p>}
      <canvas ref={canvasRef} style={{ width: "100%" }} />
    </div>
  );
}

export default PdfThumbnail;
