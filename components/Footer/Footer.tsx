export const Footer = () => {
  return (
    <footer className=" rounded-lg shadow dark:bg-gray-900 text-gray-500">
      <div className="w-full max-w-screen-xl flex">
        <span className="bg-white p-4 ">
          Got feedback?
          <a
            href="mailto:joacim.astrom@gmail.com"
            className="hover:underline ml-1 underline"
          >
            Send me an email
          </a>
        </span>
      </div>
    </footer>
  );
};
