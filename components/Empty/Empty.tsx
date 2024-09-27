import { InboxIcon } from "lucide-react";

type Props = {
  title: string;
  description: string;
};

const Empty = ({ title, description }: Props) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-6">
      <div className="flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full dark:bg-gray-800">
        <InboxIcon className="w-10 h-10 text-gray-500 dark:text-gray-400" />
      </div>
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        <p className="text-gray-500 dark:text-gray-400">{description}</p>
      </div>
    </div>
  );
};

export default Empty;
