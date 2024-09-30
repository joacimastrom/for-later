"use client";

import { Item, ItemType } from "@/app/types/interface";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import React, { useState } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";

interface InputData {
  text: string;
  file: File | null;
}

const UniversalInput = () => {
  const [inputData, setInputData] = useState<InputData>({
    text: "",
    file: null,
  });

  const [dragging, setDragging] = useState(false);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ type, data }: Partial<Item>) => {
      const { data: newItems } = await axios.post("/api/items", {
        type,
        data,
      });
      return newItems;
    },
    onSuccess: (newData) => {
      queryClient.setQueryData(["items"], newData);
      toast("Item saved", {
        description: "The item was successfully saved.",
      });
    },
    onError: (error: any) => {
      toast("Error", {
        description: error.message || "Failed to save item",
      });
    },
  });

  // Submit handler (for demonstration purposes)
  const handleSubmit = async (): Promise<void> => {
    if (!inputData.text && !inputData.file) {
      return;
    }

    let dataToSave = inputData.text;

    try {
      if (inputData.file) {
        const { name: fileName, type: fileType } = inputData.file;
        const { data: uploadUrl } = await axios.get(`/api/upload`, {
          params: { fileName, fileType },
        });

        const uniqueFilename = `${uuidv4()}-${inputData.file.name}`;

        // Upload the file directly to S3
        await axios.put(
          uploadUrl,
          { ...inputData.file, fileName: uniqueFilename },
          {
            headers: { "Content-Type": fileType },
          }
        );

        const fileUrl = `https://${process.env.NEXT_PUBLIC_AWS_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${uniqueFilename}`;
        dataToSave = fileUrl;
      }

      mutation.mutate({
        type: inputData.text ? ItemType.TEXT : ItemType.FILE,
        data: dataToSave,
      });

      setInputData({ text: "", file: null });
    } catch (error) {
      toast.error("Failed to save data");
    }
  };

  // Handle normal text input (typed)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setInputData({ text: e.target.value, file: null });
  };

  // Handle pasted content (text, URL, image, document)
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>): void => {
    const clipboardData = e.clipboardData;
    const pastedFile = clipboardData.files?.[0] || null;

    if (pastedFile) {
      // If a file is pasted (e.g., image, document)
      setInputData({ ...inputData, file: pastedFile, text: "" });
    } else {
      const pastedText = clipboardData.getData("Text");
      // If text or URL is pasted
      setInputData({ ...inputData, text: pastedText, file: null });
    }
  };

  // Handle drag over event (prevent default behavior)
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setDragging(true);
  };

  // Handle drag leave event
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setDragging(false);
  };

  // Handle file drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setDragging(false);

    const droppedFile = e.dataTransfer.files?.[0] || null;
    if (droppedFile) {
      setInputData({ ...inputData, file: droppedFile, text: "" });
    }
  };

  return (
    <Card
      className="text-center transition-all data-[dragging=true]:bg-sky-50 data-[dragging=true]:border-sky-500 w-full"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      data-dragging={dragging}
    >
      <CardContent className="p-4">
        {/*  <div className="text-sm text-neutral-500 dark:text-neutral-400">
        Add a text or a link
        <span className="flex items-center gap-4">
          <Separator className="flex-1" />
          <span className="text-muted-foreground">or</span>
          <Separator className="flex-1" />
        </span>
        Drop an image/document
      </div> */}
        <form
          onSubmit={(e) => e.preventDefault()}
          className="mt-4 flex flex-col gap-4"
        >
          <Input
            type="text"
            className="w-full text-center"
            value={inputData.file ? "" : inputData.text} // Clear text input if a file is present
            onChange={handleChange}
            onPaste={handlePaste}
            placeholder="Type, paste or drop a file"
          />
          <Button className="w-full" type="submit" onClick={handleSubmit}>
            Save!
          </Button>
        </form>
        <div>{inputData.file && inputData.file.name}</div>
      </CardContent>
    </Card>
  );
};

export default UniversalInput;
