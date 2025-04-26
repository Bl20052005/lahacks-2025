"use client";
import React from "react";
import CreateAccountForm from "./CreateAccountForm";
import Link from "next/link";

const CreateAccount = () => {
  return (
    <main className="flex relative justify-center items-center mx-auto w-full max-w-none h-screen bg-cover bg-[url('https://cdn.builder.io/api/v1/image/assets/TEMP/c96a8df7614fe791248010feee8ff2c8f1a8b7d8?placeholderIfAbsent=true')] max-md:max-w-[991px] max-sm:max-w-screen-sm">
      <img
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/fda8db44a0fd07faa662bd26b66a597d72968c57?placeholderIfAbsent=true&apiKey=290f4fffa0494176920e5dddabb4296c"
        alt="Background pattern"
        className="object-cover absolute inset-0 size-full"
      />
      <img
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/f889e319d79bf5e19de58793acb908f20457fb63?placeholderIfAbsent=true&apiKey=290f4fffa0494176920e5dddabb4296c"
        alt="Logo"
        className="object-contain max-w-full aspect-[2.95] w-[177px]"
      />
      <Link href="/">
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/c0b5f620c505a6895b2c6461013531d7cbdf3268?placeholderIfAbsent=true"
          className="absolute h-[60px] left-[29px] top-[26px] w-[177px] max-sm:h-10 max-sm:w-[120px]"
          alt="Logo"
        />
      </Link>
      <CreateAccountForm />
    </main>
  );
};

export default CreateAccount;
