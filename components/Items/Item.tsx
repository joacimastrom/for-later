import { Item as ItemType } from "@/app/types/interface";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { format } from "date-fns";
import { Copy, Loader2, Trash } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "../ui/card";

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

  return (
    <Card className="relative">
      {mutation.isPending && (
        <div className="absolute inset-0 bg-white/80 flex justify-center items-center z-10">
          <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
        </div>
      )}
      <CardHeader className="pt-3 pr-3">
        <CardDescription className="flex justify-between items-center pt-0">
          {format(new Date(createdAt), "MMM dd HH:mm")}
          {text ? (
            <Button
              variant="ghost"
              onClick={async () => {
                await navigator.clipboard.writeText(text);
                toast("Copied", {
                  description: "The item was copied to clipboard.",
                });
              }}
            >
              <Copy size={16} strokeWidth={2} />
            </Button>
          ) : null}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {text ? text : null}
        {files?.map((file) => (
          <img
            key={file.url}
            src={file.url}
            alt="file"
            className="object-cover w-full h-48"
          />
        ))}
      </CardContent>
      <CardFooter className="pr-0 pb-0">
        <Button
          variant="ghost"
          className="ml-auto pb-2"
          onClick={() => mutation.mutate(_id)}
        >
          <Trash size={16} strokeWidth={2} />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Item;
