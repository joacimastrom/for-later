"use client";

import { Item as ItemType } from "@/app/types/interface";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import Item from "./Item";

const Items = () => {
  const { status } = useSession();

  // Queries
  const { data: items, isLoading } = useQuery({
    queryKey: ["items"],
    queryFn: async () => {
      const { data } = await axios.get("/api/items");
      return data as ItemType[];
    },
    enabled: status === "authenticated",
  });

  if (status == "unauthenticated")
    return (
      <div className="prose prose-slate">
        <p className="lead">Login to see your saved items</p>
      </div>
    );
  if (isLoading || status == "loading")
    return <Loader2 className="animate-spin" />;

  if (!items?.length) return null;

  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
      {items.map((item) => (
        <Item key={item._id} {...item} />
      ))}
    </div>
  );
};

export default Items;
