"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";

const HeroSection = () => {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push("/create");
  };

  return (
    <section className="text-center">
      <h1 className="relative mt-60 text-7xl font-bold max-md:mt-10 max-md:text-4xl">
        Loom
      </h1>
      <p className="relative mt-12 text-2xl font-light text-stone-300 max-md:mt-10">
        From <em>resume</em> to <em className="font-semibold">roadmap</em>.
        <br />
        Weaving your life path.
      </p>
      <Link href="/create">
        <button
          onClick={handleGetStarted}
          className="relative px-5 py-6 mt-12 mb-0 max-w-full rounded-md bg-blue-950 w-[170px] max-md:mt-10 max-md:mb-2.5 hover:bg-blue-900 transition-colors"
          aria-label="Get Started"
        >
          Get Started
        </button>
      </Link>
    </section>
  );
};

export default HeroSection;
