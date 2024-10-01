import { Item as ItemType } from "@/app/types/interface";
import { isValidUrl } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { format } from "date-fns";
import { Copy, DownloadCloudIcon, Trash } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader } from "../ui/card";
import FilePreview from "./FilePreview";

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

  if (mutation.isPending) {
    return null;
  }

  const filesLength = files?.length || 0;

  return (
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
          <div className="group relative w-full size-16 transition-all origin-left">
            {files?.map((file, index) => (
              <FilePreview file={file} index={index} key={index} />
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
