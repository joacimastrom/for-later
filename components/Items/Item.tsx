import { Item as ItemType } from "@/app/types/interface";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { format } from "date-fns";
import { Loader2, Trash } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "../ui/card";

const Item = ({ _id, createdAt, data }: ItemType) => {
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
          <Button variant="ghost">
            <Trash
              size={16}
              strokeWidth={2}
              onClick={() => mutation.mutate(_id)}
            />
          </Button>
        </CardDescription>
      </CardHeader>
      <CardContent>{data}</CardContent>
    </Card>
  );
};

export default Item;
