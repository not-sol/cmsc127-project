// export default function BackgroundPattern() {
//   return (
//     <div className="fixed inset-0 -z-10 bg-[#6b0f1a]">
//       <svg
//         className="absolute inset-0 w-full h-full opacity-10"
//         xmlns="http://www.w3.org/2000/svg"
//         style={{ pointerEvents: "none" }}
//       >
//         <defs>
//           <pattern id="geo" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
//             <polygon points="40,4 76,40 40,76 4,40" fill="none" stroke="#fff" strokeWidth="1.2" />
//             <polygon points="40,18 62,40 40,62 18,40" fill="none" stroke="#fff" strokeWidth="0.7" />
//             <circle cx="40" cy="4" r="2" fill="#fff" />
//             <circle cx="76" cy="40" r="2" fill="#fff" />
//             <circle cx="40" cy="76" r="2" fill="#fff" />
//             <circle cx="4" cy="40" r="2" fill="#fff" />
//           </pattern>
//         </defs>
//         <rect width="100%" height="100%" fill="url(#geo)" />
//       </svg>
//     </div>
//   );
// }

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

