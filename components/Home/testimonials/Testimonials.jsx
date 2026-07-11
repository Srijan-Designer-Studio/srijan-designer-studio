import Image from "next/image";

// Review data array to manage the cards easily
const reviews = [
  {
    id: 1,
    name: "Elena Rodriguez",
    role: "Creative director, Los Angeles",
    review: `"I stopped looking for the next miracle product and started seeing actual change in my skin. That's the difference AURAE made."`,
    imageSrc: "/images/amit.png", 
    placeholderBg: "bg-[#d4a373]", 
    offsetClass: "lg:-translate-y-16", // Floats up
  },
  {
    id: 2,
    name: "Elena Rodriguez",
    role: "Creative director, Los Angeles",
    review: `"I stopped looking for the next miracle product and started seeing actual change in my skin. That's the difference AURAE made."`,
    imageSrc: "/images/ananya.png", 
    placeholderBg: "bg-[#d4a373]",
    offsetClass: "lg:translate-y-16", // Floats down
  },
  {
    id: 3,
    name: "Elena Rodriguez",
    role: "Creative director, Los Angeles",
    review: `"I stopped looking for the next miracle product and started seeing actual change in my skin. That's the difference AURAE made."`,
    imageSrc: "/images/rahul.png", 
    placeholderBg: "bg-[#d4a373]",
    offsetClass: "lg:-translate-y-4", // Slightly up
  },
  {
    id: 4,
    name: "Elena Rodriguez",
    role: "Creative director, Los Angeles",
    review: `"I stopped looking for the next miracle product and started seeing actual change in my skin. That's the difference AURAE made."`,
    imageSrc: "/images/amit.png", 
    placeholderBg: "bg-[#d4a373]",
    offsetClass: "lg:translate-y-28", // Floats down lowest
  },
];

// Simple Star SVG Component
const StarIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-4 h-4 text-[#ff8c00]"
  >
    <path
      fillRule="evenodd"
      d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
      clipRule="evenodd"
    />
  </svg>
);

export default function Testimonials() {
  return (
    <section className="relative w-full py-24 lg:py-40 bg-white overflow-hidden flex items-center justify-center min-h-[700px]">
      
      {/* Background Giant Text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none z-0 overflow-hidden px-4">
        <h2 className="text-[clamp(3rem,10vw,12rem)] font-bold text-gray-500 tracking-tighter leading-[0.85] whitespace-nowrap opacity-90">
          What customers
        </h2>
        <h2 className="text-[clamp(3rem,10vw,12rem)] font-bold text-black tracking-tighter leading-[0.85] whitespace-nowrap">
          are saying
        </h2>
      </div>

      {/* Floating Cards Container */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 items-start">
          
          {reviews.map((item) => (
            <div
              key={item.id}
              className={`bg-[#f9fafb] p-6 lg:p-7 rounded-[24px] shadow-sm border border-gray-100 transition-transform duration-500 hover:-translate-y-2 ${item.offsetClass}`}
            >
              
              {/* User Info Header */}
              <div className="flex items-center gap-3 mb-4">
                
                {/* Avatar */}
                <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                  {item.imageSrc ? (
                    <Image
                      src={item.imageSrc}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className={`w-full h-full ${item.placeholderBg} flex items-center justify-center`}>
                      <span className="text-white text-xs font-bold uppercase">
                        {item.name.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Name & Role */}
                <div>
                  <h4 className="text-[15px] font-bold text-black leading-tight">
                    {item.name}
                  </h4>
                  <p className="text-[12px] text-gray-500 mt-0.5">
                    {item.role}
                  </p>
                </div>
              </div>

              {/* 5 Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, index) => (
                  <StarIcon key={index} />
                ))}
              </div>

              {/* Review Text */}
              <p className="text-gray-800 text-[14px] leading-[1.6] font-medium">
                {item.review}
              </p>
              
            </div>
          ))}

        </div>
      </div>
      
    </section>
  );
}