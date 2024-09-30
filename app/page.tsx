import { DropzoneInput } from "@/components/DropzoneInput";
import Items from "@/components/Items/Items";
import { MaxWidth } from "@/components/MaxWidth";

export const Home = () => {
  return (
    <MaxWidth className="flex flex-col gap-2 md:gap-4 items-center w-full">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-center prose">
        Save something for later
      </h1>
      <DropzoneInput />
      <Items />
    </MaxWidth>
  );
};

export default Home;
