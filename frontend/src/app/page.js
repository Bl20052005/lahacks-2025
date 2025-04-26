"use client";
import NavigationBar from "./NavigationBar";
import HeroSection from "./HeroSection";
import FeatureSection from "./FeatureSection";
import BackgroundImage from "./BackgroundImage";
import Layer from "@/components/layer";
import Skew from "@/components/Skew";
import { App } from "@/components/nodes";

function HomePage() {
  return (
    <main className="overflow-hidden bg-white">
      {/* Top background image */}
      <BackgroundImage
        src="/w1.png"
        style={{ objectFit: "cover" }}
        className="flex flex-col items-center pt-11 pr-20 pb-72 pl-9 w-full text-xl font-normal text-center text-white min-h-[898px] max-md:px-5 max-md:pb-24 max-md:max-w-full"
      >
        <NavigationBar />
        <HeroSection />
      </BackgroundImage>

      {/* Second background image */}
      <BackgroundImage
        src="/w2.png"
        style={{ objectFit: "cover" }}
        className="flex flex-col items-center pt-11 pr-20 pb-72 pl-9 w-full text-xl font-normal text-center text-white min-h-[898px] max-md:px-5 max-md:pb-24 max-md:max-w-full"
      >
        {/* Section containing all FeatureSections */}
        <section className="flex flex-col items-start px-8 pt-80 pb-60 w-full text-white gap-y-80 max-md:px-5 max-md:py-24 max-md:max-w-full">
          {/* Feature 1 */}
          <div className="relative max-md:max-w-full text-left">
            <FeatureSection
              title={
                <>
                  Smart Input, <br /> Smarter Insight
                </>
              }
              description="Upload your resume or tell us what you're into. Our system takes it from there, simplifying your info into something actionable."
              demoClassName="Demo - Resume Upload Page"
            />
          </div>

          {/* Feature 2 */}
          <div className="relative max-md:max-w-full text-left">
            <FeatureSection
              title={
                <>
                  Real Alumni, <br /> Real Journeys
                </>
              }
              description={`See how verified grads from top schools like Columbia, UCLA, and Berkeley navigated their own "what now?" moments. We match you with stories and paths from people a few steps ahead of you.`}
              demoClassName="Demo - linkd website? / schools"
            />
          </div>

          {/* Feature 3 */}
          <div className="relative max-md:max-w-full text-left">
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
        </section>

        {/* Little circle button at the bottom */}
        <div className="flex relative shrink-0 self-end mt-56 mr-44 rounded-full bg-slate-100 h-[71px] w-[71px] max-md:mt-10 max-md:mr-2.5" />
      </BackgroundImage>
    </main>
  );
}

export default HomePage;
