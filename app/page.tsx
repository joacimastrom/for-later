import { DropzoneInput } from "@/components/DropzoneInput";
import Items from "@/components/Items/Items";
import { MaxWidth } from "@/components/MaxWidth";

if (typeof Promise.withResolvers === "undefined") {
  if (typeof window !== "undefined") {
    // @ts-expect-error This does not exist outside of polyfill which this is doing
    window.Promise.withResolvers = function () {
      let resolve, reject;
      const promise = new Promise((res, rej) => {
        resolve = res;
        reject = rej;
      });
      return { promise, resolve, reject };
    };
  } else {
    // @ts-expect-error This does not exist outside of polyfill which this is doing
    global.Promise.withResolvers = function () {
      let resolve, reject;
      const promise = new Promise((res, rej) => {
        resolve = res;
        reject = rej;
      });
      return { promise, resolve, reject };
    };
  }
}

const Home = () => {
  return (
    <MaxWidth className="flex flex-col gap-2 md:gap-4 items-center w-full">
      <div className="prose prose-slate text-center">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl m-0">
          Save stuff for later
        </h1>
        <p className="lead mt-0">Access your saved items from any device</p>
      </div>
      <DropzoneInput />
      <Items />
    </MaxWidth>
  );
};

export default Home;
