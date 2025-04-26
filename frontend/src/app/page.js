"use client";
import NavigationBar from "./NavigationBar";
import HeroSection from "./HeroSection";
import FeatureSection from "./FeatureSection";
import BackgroundImage from "./BackgroundImage";
import Link from "next/link";

function HomePage() {
  return (
    <main className="overflow-hidden bg-white">
      <BackgroundImage
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/7a73509fb8a43c9f2a1dd64067f4693f63cef23e?placeholderIfAbsent=true&apiKey=290f4fffa0494176920e5dddabb4296c"
        className="flex flex-col items-center pt-11 pr-20 pb-72 pl-9 w-full text-xl font-medium text-center text-white min-h-[898px] max-md:px-5 max-md:pb-24 max-md:max-w-full"
      >
        <Link href="/">
          <NavigationBar />
          <HeroSection />
        </Link>
      </BackgroundImage>

      <section className="flex flex-col items-start px-16 pt-28 pb-60 mt-0 w-full bg-black text-white max-md:px-5 max-md:py-24 max-md:max-w-full">
        <div className="ml-3 max-md:max-w-full">
          <FeatureSection
            title={
              <>
                Smart Input, <br />
                Smarter Insight
              </>
            }
            description="Upload your resume or tell us what you're into. Our system takes it from there, simplifying your info into something actionable."
            demoClassName="Demo - Resume Upload Page"
          />
        </div>

        <div className="mt-96 -mb-12 max-md:mt-10 max-md:mb-2.5 max-md:max-w-full">
          <FeatureSection
            title={
              <>
                Real Alumni,
                <br />
                Real Journeys
              </>
            }
            description={`See how verified grads from top schools like Columbia, UCLA, and Berkeley navigated their own "what now?" moments. We match you with stories and paths from people a few steps ahead of you.`}
            demoClassName="Demo - linkd website? / schools"
          />
        </div>
      </section>

      <BackgroundImage
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/026deb1493d80034c014b9f9a562fd4e7cefad1e?placeholderIfAbsent=true&apiKey=290f4fffa0494176920e5dddabb4296c"
        className="flex flex-col px-20 pt-56 pb-24 w-full min-h-[976px] max-md:px-5 max-md:pt-24 max-md:max-w-full"
      >
        <div className="relative max-md:max-w-full">
          <FeatureSection
            title={
              <>
                Your Path, <br />
                Visualized
              </>
            }
            description="We turn your interests, skills, and confusion into a clean, personalized flowchart. Watch your potential pathways unfold - no more staring at a blank future."
            demoClassName="Demo - RoadMap mt-3"
          />
        </div>
        <div className="flex relative shrink-0 self-end mt-56 mr-44 rounded-full bg-slate-100 h-[71px] w-[71px] max-md:mt-10 max-md:mr-2.5" />
      </BackgroundImage>
    </main>
  );
}

export default HomePage;
