"use client";
import * as React from "react";
import { LoginForm } from "./LoginForm";
import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="flex relative justify-center items-center mx-auto w-full max-w-none h-screen bg-cover bg-[url('https://cdn.builder.io/api/v1/image/assets/TEMP/c96a8df7614fe791248010feee8ff2c8f1a8b7d8?placeholderIfAbsent=true')] max-md:max-w-[991px] max-sm:max-w-screen-sm">
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />
      <Link href="/">
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/c0b5f620c505a6895b2c6461013531d7cbdf3268?placeholderIfAbsent=true"
          className="absolute h-[60px] left-[29px] top-[26px] w-[177px] max-sm:h-10 max-sm:w-[120px]"
          alt="Logo"
        />
      </Link>
      <LoginForm />
    </main>
  );
}
