"use client";

import { useState } from "react";

import { Item } from "@/app/types/interface";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { format } from "date-fns";
import { Cloud, File } from "lucide-react";
import { useSession } from "next-auth/react";
import { useDropzone } from "react-dropzone";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Progress } from "./ui/progress";
import { Separator } from "./ui/separator";

interface InputData {
  text: string;
  files: File[];
}

const MAX_SIZE_MB = 5;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

const ALLOWED_NUMBER_OF_FILES = 5;

export const DropzoneInput = () => {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [inputData, setInputData] = useState<InputData>({
    text: "",
    files: [],
  });
  const { toast } = useToast();
  const { getInputProps, getRootProps, isDragActive, open } = useDropzone({
    noClick: true,
    onDrop: async (acceptedFiles: File[]) => {
      if (acceptedFiles.length > ALLOWED_NUMBER_OF_FILES) {
        toast({
          title: "Too many files",
          description: `You can only upload up to ${ALLOWED_NUMBER_OF_FILES} files`,
          variant: "destructive",
        });
        return;
      }

      const filesWithinSizeLimit = acceptedFiles.filter(
        ({ size }) => size <= MAX_SIZE_BYTES
      );

      if (filesWithinSizeLimit.length !== acceptedFiles.length) {
        toast({
          title: "File size limit exceeded",
          description: `Files must be less than ${MAX_SIZE_MB}MB`,
          variant: "destructive",
        });
      }

      setInputData((inputData) => ({
        text: "",
        files: [...inputData.files, ...acceptedFiles],
      }));
    },
  });

  const { status } = useSession();

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
    if (!inputData.text && !inputData.files.length) {
      return;
    }

    if (status !== "authenticated") {
      toast({
        title: "Sign in required",
        description: "You need to Sign in before saving items",
      });
      return;
    }

    setIsUploading(true);
    const progressInterval = startSimulatedProgress();

    try {
      if (inputData.files.length) {
        const filePromises = [];
        for (const file of inputData.files) {
          filePromises.push(saveFileItem(file));
        }
        const files = await Promise.all(filePromises);
        await mutation.mutate({
          files,
        });
      } else if (inputData.text) {
        await mutation.mutate({
          text: inputData.text,
        });
      }

      clearInterval(progressInterval);
      setUploadProgress(100);
      setTimeout(() => {
        setInputData({ text: "", files: [] });
        setIsUploading(false);
      }, 1000);
    } catch {
      toast({
        title: "Something went wrong",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  const saveFileItem = async (file: File) => {
    const { name: fileName, type: fileType } = file;

    const uniqueFilename = `${format(new Date(), "MMM-dd-HH-mm")}-${fileName}`;
    const { data: uploadUrl } = await axios.get(`/api/upload`, {
      params: { fileName: uniqueFilename, fileType },
    });

    await axios.put(uploadUrl, file, {
      headers: { "Content-Type": fileType },
    });

    const fileUrl = `https://${process.env.NEXT_PUBLIC_AWS_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${uniqueFilename}`;

    return { url: fileUrl, size: file.size, type: fileType, name: fileName };
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
    const pastedFiles = clipboardData.files?.length || null;

    if (pastedFiles) {
      setInputData({
        ...inputData,
        files: Array.prototype.slice.call(clipboardData.files),
        text: "",
      });
    } else {
      const pastedText = clipboardData.getData("Text");
      // If text or URL is pasted
      setInputData({ ...inputData, text: pastedText, files: [] });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setInputData({ text: e.target.value, files: [] });
  };

  return (
    <Card
      className="group text-center transition-all data-[dragging=true]:bg-sky-50 data-[dragging=true]:border-sky-500 w-full pt-4 cursor-pointer"
      data-dragging={isDragActive}
      {...getRootProps()}
      onClick={open}
    >
      <CardContent className="px-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="flex flex-col gap-4"
        >
          <div className="flex items-center justify-center h-full w-full">
            <label
              htmlFor="dropzone-file"
              className="flex flex-col items-center justify-center w-full h-full rounded-lg cursor-pointer gap-4"
            >
              <div className="flex flex-col items-center justify-center">
                <Cloud className="h-6 w-6 text-zinc-500 mb-2" />
                <p className="text-sm text-zinc-700">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                {/* <p className="text-xs text-zinc-500">Up to 5 files</p> */}
              </div>

              {inputData.files.map((file) => (
                <div
                  key={file.name}
                  className="max-w-xs bg-white flex items-center rounded-md overflow-hidden outline outline-[1px] outline-zinc-200 divide-x divide-zinc-200"
                >
                  <div className="px-3 py-2 h-full grid place-items-center">
                    <File className="h-4 w-4 text-blue-500" />
                  </div>
                  <div className="px-3 py-2 h-full text-sm truncate">
                    {file.name}
                  </div>
                </div>
              ))}

              {isUploading ? (
                <div className="w-full mt-4 max-w-xs mx-auto">
                  <Progress
                    indicatorColor={
                      uploadProgress === 100 ? "bg-green-500" : ""
                    }
                    value={uploadProgress}
                    className="h-1 w-full bg-zinc-200"
                  />
                </div>
              ) : null}

              <input type="file" {...getInputProps()} />
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
            value={inputData.files.length ? "" : inputData.text} // Clear text input if a file is present
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
  );
};
