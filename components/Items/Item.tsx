"use client";
import { Item as ItemType } from "@/app/types/interface";
import { isValidUrl } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { format } from "date-fns";
import { Copy, DownloadCloudIcon, Trash } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader } from "../ui/card";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import FilePreview from "./FilePreview";

import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

import Image from "next/image";
import { useResizeDetector } from "react-resize-detector";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const Item = ({ _id, createdAt, text, files }: ItemType) => {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { width, ref } = useResizeDetector();

  const openDialog = (index: number) => {
    setCurrentIndex(index);
    setIsOpen(true);
  };

  const mutation = useMutation({
    mutationFn: async (itemId: string) => {
      const { data } = await axios.delete<{
        message: string;
        items: ItemType[];
      }>("api/items/" + itemId);
      return data.items;
    },
    onSuccess: (items) => {
      queryClient.setQueryData(["items"], items);

      toast("Item deleted", {
        description: "The item was successfully deleted.",
      });
    },
    onError: (error: any) => {
      toast("Error", {
        description: error.message || "Failed to delete item",
      });
    },
  });

  const downloadFile = async (url: string, fileName: string) => {
    const response = await fetch(url);
    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const handleDownloadAll = async () => {
    for (const file of files!) {
      // If private, you can fetch pre-signed URLs by calling your backend API
      await downloadFile(file.url, file.name);
    }
  };

  if (mutation.isPending) {
    return null;
  }

  const filesLength = files?.length || 0;

  return (
    <>
      <Card className="relative flex flex-col">
        <CardHeader>
          <CardDescription className="flex justify-between items-center pt-0">
            {format(new Date(createdAt), "MMM d HH:mm")}
            {text ? (
              <Copy
                className="hover:scale-110 transition-all cursor-pointer hover:text-zinc-600"
                onClick={async () => {
                  await navigator.clipboard.writeText(text);
                  toast("Copied", {
                    description: "The item was copied to clipboard.",
                  });
                }}
              />
            ) : null}
            {filesLength ? (
              <DownloadCloudIcon
                onClick={handleDownloadAll}
                className="hover:scale-110 cursor-pointer hover:text-zinc-600"
              />
            ) : null}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col grow justify-between">
          {text ? (
            isValidUrl(text) ? (
              <a
                href={text}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline break-all"
              >
                {text}
              </a>
            ) : (
              <span className="text-gray-900 line-clamp-3 break-words">
                {text}
              </span>
            )
          ) : null}
          {filesLength ? (
            <div className="group relative w-full size-16 transition-all origin-left">
              <Dialog open={isOpen} onOpenChange={(value) => setIsOpen(value)}>
                <DialogTrigger>
                  {files?.map((file, index) => (
                    <FilePreview
                      file={file}
                      index={index}
                      key={index}
                      onClick={() => openDialog(index)}
                    />
                  ))}
                </DialogTrigger>
                <DialogContent>
                  {isOpen && (
                    <>
                      <DialogTitle>{files[currentIndex].name}</DialogTitle>
                      <div
                        className="relative p-4 bg-white rounded-md max-h-[80vh] max-w-lg"
                        ref={ref}
                      >
                        {files[currentIndex].type === "application/pdf" ? (
                          <Document
                            file={files[currentIndex].url}
                            className="[&canvas]:w-full &canvas]:h-auto"
                          >
                            <Page pageNumber={1} width={width} />
                          </Document>
                        ) : (
                          <Image
                            src={files[currentIndex].url}
                            alt={`Image ${currentIndex}`}
                            width={800}
                            height={600}
                            className="object-contain max-w-full max-h-full"
                          />
                        )}
                      </div>
                    </>
                  )}
                </DialogContent>
              </Dialog>
            </div>
          ) : null}
          <Trash
            onClick={() => mutation.mutate(_id)}
            className="ml-auto hover:scale-110 transition-all cursor-pointer self-end text-neutral-500 hover:text-zinc-600"
          />
        </CardContent>
      </Card>
    </>
  );
};

export default Item;
