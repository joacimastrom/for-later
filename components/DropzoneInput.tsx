"use client";

import { useState } from "react";

import { Item } from "@/app/types/interface";
import { toast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { format } from "date-fns";
import { Cloud, File } from "lucide-react";
import Dropzone from "react-dropzone";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Progress } from "./ui/progress";
import { Separator } from "./ui/separator";

interface InputData {
  text: string;
  file: File | null;
}
export const DropzoneInput = () => {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [dragging, setDragging] = useState(false);
  const [inputData, setInputData] = useState<InputData>({
    text: "",
    file: null,
  });

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async ({ text, files }: Partial<Item>) => {
      const { data: newItems } = await axios.post("/api/items", {
        text,
        files,
      });
      return newItems;
    },
    onSuccess: (newData) => {
      queryClient.setQueryData(["items"], newData);
      toast({
        title: "Item saved",
        description: "The item was successfully saved.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save item",
      });
    },
  });

  const handleSubmit = async (): Promise<void> => {
    if (!inputData.text && !inputData.file) {
      return;
    }

    setIsUploading(true);
    const progressInterval = startSimulatedProgress();

    try {
      if (inputData.file) {
        await saveFileItem();
      }

      if (inputData.text) {
        await mutation.mutate({
          text: inputData.text,
        });
      }

      setInputData({ text: "", file: null });
      clearInterval(progressInterval);
      setUploadProgress(100);
      setTimeout(() => setIsUploading(false), 1000);
    } catch {
      toast({
        title: "Something went wrong",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  const saveFileItem = async () => {
    const file = inputData.file!;
    const { name: fileName, type: fileType } = file;

    const uniqueFilename = `${format(new Date(), "MMM-dd-HH-mm")}-${fileName}`;
    const { data: uploadUrl } = await axios.get(`/api/upload`, {
      params: { fileName: uniqueFilename, fileType },
    });

    await axios.put(uploadUrl, file, {
      headers: { "Content-Type": fileType },
    });

    const fileUrl = `https://${process.env.NEXT_PUBLIC_AWS_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${uniqueFilename}`;

    await mutation.mutate({
      files: [
        {
          url: fileUrl,
          size: file.size,
        },
      ],
    });
  };

  const startSimulatedProgress = () => {
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prevProgress) => {
        if (prevProgress >= 95) {
          clearInterval(interval);
          return prevProgress;
        }
        return prevProgress + 5;
      });
    }, 500);

    return interval;
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>): void => {
    const clipboardData = e.clipboardData;
    e.stopPropagation();
    e.preventDefault();
    console.log(clipboardData);
    const pastedFile = clipboardData.files?.[0] || null;

    console.log(pastedFile);

    if (pastedFile) {
      // If a file is pasted (e.g., image, document)
      setInputData({ ...inputData, file: pastedFile, text: "" });
    } else {
      const pastedText = clipboardData.getData("Text");
      // If text or URL is pasted
      setInputData({ ...inputData, text: pastedText, file: null });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    console.log(e.target.value);
    setInputData({ text: e.target.value, file: null });
  };

  return (
    <Dropzone
      multiple={false}
      onDragEnter={() => setDragging(true)}
      onDragLeave={() => setDragging(false)}
      onDrop={async (acceptedFile: File[]) => {
        setDragging(false);
        setInputData({ text: "", file: acceptedFile[0] });
      }}
    >
      {({ getRootProps, getInputProps }) => (
        <Card
          className="group text-center transition-all data-[dragging=true]:bg-sky-50 data-[dragging=true]:border-sky-500 w-full"
          data-dragging={dragging}
          {...getRootProps()}
        >
          <CardContent className="px-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
              className="mt-4 flex flex-col gap-4"
            >
              <div className="flex items-center justify-center h-full w-full">
                <label
                  htmlFor="dropzone-file"
                  className="flex flex-col items-center justify-center w-full h-full rounded-lg cursor-pointer gap-4"
                >
                  <div className="flex flex-col items-center justify-center">
                    <Cloud className="h-6 w-6 text-zinc-500 mb-2" />
                    <p className="mb-2 text-sm text-zinc-700">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-zinc-500">PDF (up to 4MB)</p>
                  </div>

                  {inputData.file ? (
                    <div className="max-w-xs bg-white flex items-center rounded-md overflow-hidden outline outline-[1px] outline-zinc-200 divide-x divide-zinc-200">
                      <div className="px-3 py-2 h-full grid place-items-center">
                        <File className="h-4 w-4 text-blue-500" />
                      </div>
                      <div className="px-3 py-2 h-full text-sm truncate">
                        {inputData.file.name}
                      </div>
                    </div>
                  ) : null}

                  {isUploading ? (
                    <div className="w-full mt-4 max-w-xs mx-auto">
                      <Progress
                        /*         indicatorColor={
                      uploadProgress === 100 ? "bg-green-500" : ""
                    } */
                        value={uploadProgress}
                        className="h-1 w-full bg-zinc-200"
                      />
                    </div>
                  ) : null}

                  <input
                    {...getInputProps()}
                    type="file"
                    id="dropzone-file"
                    className="hidden"
                  />
                </label>
              </div>
              <div className="flex items-center gap-4">
                <Separator className="flex-1" />
                <span className="text-muted-foreground text-zinc-500">or</span>
                <Separator className="flex-1" />
              </div>
              <Input
                type="text"
                className="w-full text-center bg-white"
                value={inputData.file ? "" : inputData.text} // Clear text input if a file is present
                onChange={handleChange}
                onPaste={handlePaste}
                placeholder="Type or Paste"
                onClick={(e) => e.stopPropagation()}
              />

              <Button
                className="w-full font-bold"
                type="submit"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                Save!
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </Dropzone>
  );
};
