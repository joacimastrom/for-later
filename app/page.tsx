"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
interface InputData {
  text: string;
  file: File | null;
}
export default function Home() {
  const [inputData, setInputData] = useState<InputData>({
    text: "",
    file: null,
  });

  const [dragging, setDragging] = useState(false);

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

  // Submit handler (for demonstration purposes)
  const handleSubmit = (): void => {
    console.log("Submitted Data:", inputData);
    // Handle the form submission logic here
  };

  return (
    <div className="flex flex-col gap-4 items-center text-center">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Save something for later
      </h1>
      <Card
        className="text-center transition-all data-[dragging=true]:bg-sky-50 data-[dragging=true]:border-sky-500 w-full max-w-screen-sm"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        data-dragging={dragging}
      >
        <CardContent className="p-4">
          <div className="text-sm text-neutral-500 dark:text-neutral-400">
            Add a text or a link
            <span className="flex items-center gap-4">
              <Separator className="flex-1" />
              <span className="text-muted-foreground">or</span>
              <Separator className="flex-1" />
            </span>
            Drop an image/document
          </div>
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
              placeholder="Type, paste, or drop file here"
              /* style={{
                  width: "100%",
                  padding: "10px",
                  border: "none",
                  outline: "none",
                }} */
            />

            <Button className="w-full" type="submit" onClick={handleSubmit}>
              Save!
            </Button>
          </form>

          <div>{inputData.file && inputData.file.name}</div>
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
    </div>
  );
}
