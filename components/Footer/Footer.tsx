"use client";

export const Footer = () => {
  return (
    <footer className=" rounded-lg shadow dark:bg-gray-900 text-gray-500">
      <div className="w-full max-w-screen-xl ml-auto flex justify-end">
        <span className="bg-white p-4 ">
          Har du feedback?
          <a
            href="mailto:joacim.astrom@gmail.com"
            className="hover:underline ml-1 underline"
          >
            Skicka ett mail
          </a>
        </span>
      </div>
    </footer>
  );
};
