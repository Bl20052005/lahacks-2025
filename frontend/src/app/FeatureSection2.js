const FeatureSection2 = ({
    title,
    description,
    demoClassName = "",
    imageFirst = false,
  }) => {
    const TextContent = () => (
      <div className="w-[45%] max-md:ml-0 max-md:w-full">
        <div className="flex flex-col mt-5 max-md:mt-10 max-md:max-w-full">
          <h2 className="self-start text-5xl font-bold text-white max-md:text-4xl whitespace-pre-line">
            {title}
          </h2>
          <p className="mt-14 text-2xl font-normal leading-10 text-stone-300 max-md:mt-10 max-md:max-w-full">
            {description}
          </p>
        </div>
      </div>
    );
  
    const DemoContent = () => (
      <div className="ml-5 w-[55%] max-md:ml-0 max-md:w-full">
        <img
    src="/resume.png"
    alt="Feature demonstration"
    className={`flex shrink-0 mx-auto max-w-full bg-zinc-300 h-[362px] w-[599px] max-md:mt-10 ${demoClassName}`}
  />
      </div>
    );
  
    return (
      <div className="flex gap-5 max-md:flex-col">
        {imageFirst ? (
          <>
            <DemoContent />
            <TextContent />
          </>
        ) : (
          <>
            <TextContent />
            <DemoContent />
          </>
        )}
      </div>
    );
  };
  
  export default FeatureSection2;
  