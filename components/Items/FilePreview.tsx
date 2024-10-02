"use client";

import { ItemFile } from "@/app/types/interface";
import Image from "next/image";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const fileClasses = [
  "rotate-0 hover:rotate-[10deg] left-0 z-50",
  "rotate-[12deg] hover:rotate-[20deg] left-2 z-40",
  "rotate-[24deg] hover:rotate-[32deg] left-4 z-30",
  "rotate-[36deg] hover:rotate-[44deg] left-6 z-20",
  "rotate-[48deg] hover:rotate-[56deg] left-8 z-10",
];
type Props = {
  file: ItemFile;
  index: number;
  onClick: () => void;
};

const FilePreview = ({ file, index, onClick }: Props) => {
  return (
    <div
      key={index}
      className={`absolute ${fileClasses[index]} hover:scale-110 transition-all size-16 border-white border-2 rounded-lg overflow-hidden origin-bottom-right cursor-pointer shadow-md`}
    >
      {file.type === "application/pdf" && (
        /*  <FileText size={60} /> */
        <Document file={file.url}>
          <Page pageNumber={1} width={150} />
        </Document>
      )}
      {file.type.startsWith("image/") && (
        <Image
          src={file.url}
          alt="Image 1"
          fill
          sizes={"64px"}
          objectFit="cover"
          quality={50}
          onClick={onClick}
        />
      )}
    </div>
  );
};

export default FilePreview;
