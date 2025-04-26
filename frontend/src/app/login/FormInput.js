export function FormInput({ label, type = "text", value, onChange }) {
  return (
    <div className="mb-8 w-[367px] max-md:w-4/5 max-sm:w-[90%]">
      <label className="block mb-2.5 text-lg text-black">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-2.5 py-0 w-full text-base rounded-md border border-solid bg-zinc-300 bg-opacity-0 border-neutral-400 h-[47px]"
      />
    </div>
  );
}
