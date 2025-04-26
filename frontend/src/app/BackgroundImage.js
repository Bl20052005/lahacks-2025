const BackgroundImage = ({ src, children, className = "" }) => {
  return (
    <section className={`relative ${className}`}>
      <img
        src={src}
        className="object-cover absolute inset-0 size-full"
        alt="Section background"
        loading="lazy"
      />
      <div className="relative z-10">{children}</div>
    </section>
  );
};

export default BackgroundImage;
