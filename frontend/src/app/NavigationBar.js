import Link from "next/link";

const NavigationBar = () => {
  return (
    <nav className="flex flex-wrap gap-5 justify-between self-stretch w-[90vw]">
      <Link href="/">
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/f889e319d79bf5e19de58793acb908f20457fb63?placeholderIfAbsent=true&apiKey=290f4fffa0494176920e5dddabb4296c"
          className="object-contain shrink-0 max-w-full aspect-[2.95] w-[177px]"
          alt="Logo"
        />
      </Link>
      <div className="flex gap-10 items-start my-auto">
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/c5586b64e133ede7f47c86a12bda4f008444326c?placeholderIfAbsent=true&apiKey=290f4fffa0494176920e5dddabb4296c"
          className="object-contain shrink-0 mt-5 w-6 aspect-square"
          alt="Menu icon"
        />
        <div className="flex gap-9">
          <Link href="/login">
            <button className="text-xl font-medium">Sign In</button>
          </Link>
          <Link href="/create">
            <button className="text-xl font-medium basis-auto">
              Create Account
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;
