import Items from "@/components/Items/Items";
import { MaxWidth } from "@/components/MaxWidth";
import UniversalInput from "@/components/UniversalInput";

export const Home = () => {
  return (
    <MaxWidth className="flex flex-col gap-4 items-center w-full">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-center prose">
        Save something for later
      </h1>
      <UniversalInput />
      <Items />
    </MaxWidth>
  );
};

export default Home;
