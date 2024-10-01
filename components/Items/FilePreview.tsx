"use client";

import { ItemFile } from "@/app/types/interface";
import Image from "next/image";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// @ts-expect-error This does not exist outside of polyfill which this is doing
if (typeof Promise.withResolvers === "undefined") {
  if (window)
    // @ts-expect-error This does not exist outside of polyfill which this is doing
    window.Promise.withResolvers = function () {
      let resolve, reject;
      const promise = new Promise((res, rej) => {
        resolve = res;
        reject = rej;
      });
      return { promise, resolve, reject };
    };
}

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/legacy/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

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
};

const FilePreview = ({ file, index }: Props) => {
  return (
    <div
      key={index}
      className={`absolute ${fileClasses[index]} transition-all size-16 border-white border-2 rounded-lg overflow-hidden origin-bottom-right cursor-pointer shadow-md`}
    >
      {file.type === "application/pdf" && (
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
        />
      )}
    </div>
  );
};

export default FilePreview;
