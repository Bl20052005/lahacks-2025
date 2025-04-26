export function Button({ children, type = "button", onClick }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="mt-5 text-xl font-medium text-white rounded-md cursor-pointer bg-blue-950 border-[none] h-[53px] w-[109px] max-sm:text-lg max-sm:h-[45px] max-sm:w-[100px]"
    >
      {children}
    </button>
  );
}
