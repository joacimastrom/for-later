"use client";

import { ItemFile } from "@/app/types/interface";
import { FileText } from "lucide-react";
import Image from "next/image";

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
      {file.type === "application/pdf" && <FileText size={60} />}
      {/* <Document file={file.url}>
          <Page pageNumber={1} width={150} />
        </Document> */}
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
