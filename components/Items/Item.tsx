import { Item as ItemType } from "@/app/types/interface";
import { isValidUrl } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { format } from "date-fns";
import { Copy, DownloadCloudIcon, Loader2, Trash } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader } from "../ui/card";

const fileClasses = [
  "rotate-0 hover:rotate-[10deg] left-0 ",
  "rotate-[12deg] hover:rotate-[20deg] left-2",
  "rotate-[24deg] hover:rotate-[32deg] left-4",
  "rotate-[36deg] hover:rotate-[44deg] left-6",
  "rotate-[48deg] hover:rotate-[56deg] left-8",
];

const Item = ({ _id, createdAt, text, files }: ItemType) => {
  const queryClient = useQueryClient();

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

  const filesLength = files?.length || 0;

  return (
    <Card className="relative flex flex-col">
      {mutation.isPending && (
        <div className="absolute inset-0 bg-white/80 flex justify-center items-center z-10">
          <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
        </div>
      )}
      <CardHeader>
        <CardDescription className="flex justify-between items-center pt-0">
          {format(new Date(createdAt), "MMM dd HH:mm")}
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
              className="hover:scale-110 transition-all cursor-pointer hover:text-zinc-600"
            />
          ) : null}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-row grow">
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
            <span className="text-gray-900 line-clamp-3">{text}</span>
          )
        ) : null}
        {filesLength ? (
          <div className="group relative w-full size-16 hover:scale-105 transition-all origin-left">
            {files?.map((file, index) => (
              <div
                key={index}
                className={`absolute ${
                  fileClasses[filesLength - index - 1]
                } transition-all size-16 border-white border-2 rounded-lg overflow-hidden origin-bottom-right cursor-pointer shadow-md`}
              >
                <Image
                  src={file.url}
                  alt="Image 1"
                  fill
                  objectFit="cover"
                  quality={50}
                />
              </div>
            ))}
          </div>
        ) : null}
        <Trash
          onClick={() => mutation.mutate(_id)}
          className="ml-auto hover:scale-110 transition-all cursor-pointer self-end text-neutral-500 hover:text-zinc-600"
        />
      </CardContent>
    </Card>
  );
};

export default Item;
