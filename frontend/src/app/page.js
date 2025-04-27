"use client";
import NavigationBar from "./NavigationBar";
import HeroSection from "./HeroSection";
import FeatureSection from "./FeatureSection";
import BackgroundImage from "./BackgroundImage";
import { motion } from "framer-motion";
import { Link as ScrollLink } from "react-scroll"; 

function HomePage() {
  return (
    <main className="overflow-hidden bg-white">
      <BackgroundImage
        src="/w1.png"
        style={{ objectFit: "cover" }}
        className="flex flex-col items-center pt-11 pr-20 pb-72 pl-9 w-full text-xl font-normal text-center text-white min-h-[898px] max-md:px-5 max-md:pb-24 max-md:max-w-full"
      >
        <NavigationBar />
        <HeroSection />

      <div className="flex justify-center mt-10">
        <ScrollLink
          to="features-section"
          smooth={true}
          duration={500}
          className="cursor-pointer animate-bounce"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-8 h-8 text-blue-500"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </ScrollLink>
      </div>
      </BackgroundImage>


      <BackgroundImage
        src="/w2.png"
        style={{ objectFit: "cover" }}
        className="flex flex-col items-center pt-11 pr-20 pb-72 pl-9 w-full text-xl font-normal text-center text-white min-h-[898px] max-md:px-5 max-md:pb-24 max-md:max-w-full"
      >

        <section id="features-section" className="flex flex-col items-start px-8 pt-80 pb-60 w-full text-white gap-y-80 max-md:px-5 max-md:py-24 max-md:max-w-full">
          <motion.div
            className="relative max-md:max-w-full text-left"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <FeatureSection
              title={
                <>
                  Smart Input, <br /> Smarter Insight
                </>
              }
              description="Upload your resume or tell us what you're into. Our system takes it from there, simplifying your info into something actionable."
              demoClassName="Demo - Resume Upload Page"
            />
          </motion.div>

          <motion.div
            className="relative max-md:max-w-full text-left"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <FeatureSection
              title={
                <>
                  Real Alumni, <br /> Real Journeys
                </>
              }
              description={`See how verified grads from top schools like Columbia, UCLA, and Berkeley navigated their own "what now?" moments. We match you with stories and paths from people a few steps ahead of you.`}
              demoClassName="Demo - linkd website? / schools"
            />
          </motion.div>

          <motion.div
            className="relative max-md:max-w-full text-left"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
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
          </motion.div>
        </section>

        <motion.div
          className="flex relative shrink-0 self-end mt-56 mr-44 rounded-full bg-slate-100 h-[71px] w-[71px] max-md:mt-10 max-md:mr-2.5"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
        />
      </BackgroundImage>


    </main>
  );
}

export default HomePage;
