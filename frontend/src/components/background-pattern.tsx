export default function BackgroundPattern() {
  return (
    <div className="fixed inset-0 -z-10 bg-linear-to-r from-[#7b1113] to-[#360404]">
      <div
        className="absolute inset-0"
        style={{
          mixBlendMode: "soft-light",
          backgroundColor: "white",
          maskImage: "url('../../public/pattern.png')",
          maskRepeat: "repeat",
          maskSize: "2000px",
          WebkitMaskImage: "url('../../public/pattern.png')",
          WebkitMaskRepeat: "repeat",
          WebkitMaskSize: "1900px",
          opacity: 0.3,
        }}
      />
    </div>
  );
}

