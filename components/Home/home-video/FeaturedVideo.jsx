"use client";

export default function FeaturedVideo() {
  return (
    <section className="relative w-full overflow-hidden bg-black">
     
      <div className="relative w-full h-screen min-h-[400px] md:h-[80vh] lg:min-h-[100vh]">
        
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
         
          <source src="/videos/SRIJAN Signature Video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

       
        {/* <div className="absolute inset-0 bg-black/20 pointer-events-none"></div> */}

      </div>
    </section>
  );
}