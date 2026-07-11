const missionVisionData = [
  {
    title: "Mission",
    description: "To turn any design concept into high-quality reality for individuals and brands alike through expert craftsmanship."
  },
  {
    title: "Vision",
    description: "To be the ultimate destination where limitless creativity meets precision manufacturing."
  }
];

export default function MissionVision() {
  return (
    
    <section className="py-16 lg:py-24 bg-white border-b border-gray-100">
      <div className="max-w-[1320px] mx-auto px-6">
        
        {/* Grid Container for Side-by-Side Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          
          {missionVisionData.map((item, index) => (
            <div 
              key={index} 
              
              className="bg-[#cbe4ff] rounded-[24px] px-8 py-12 lg:px-12 lg:py-16 flex flex-col items-center justify-center text-center"
            >
              {/* Card Heading */}
              <h3 className="text-xl sm:text-2xl font-bold text-black mb-4">
                {item.title}
              </h3>
              
              {/* Card Description */}
              <p className="text-[#333] text-[15px] sm:text-[16px] leading-[1.6] max-w-[450px]">
                {item.description}
              </p>
            </div>
          ))}

        </div>
        
      </div>
    </section>
  );
}