import { Star, User, Check } from "lucide-react";

const reviewsData = [
  {
    id: 1,
    name: "Harsh yadav",
    title: "Best Tshirt i have ever purchased best material",
    desc: "Best Tshirt i have ever purchased best material and easy fit",
  },
  {
    id: 2,
    name: "Muthu Venkatesh J P",
    title: "Nice One",
    desc: "Good Quality",
  },
  {
    id: 3,
    name: "Anonymous",
    title: "Awesome",
    desc: "Awesome.",
  },
  {
    id: 4,
    name: "Anonymous",
    title: "Good product",
    desc: "Good product 👍👍",
  },
  {
    id: 5,
    name: "Snehasish Routray",
    title: "v",
    desc: "v good",
  },
];

export default function CustomerReviews() {
  return (
    <section className="py-16 bg-[#f8f9fa]">
      <div className="max-w-[1320px] mx-auto px-6">
        <h2 className="text-3xl font-bold text-black mb-12">Customer Reviews</h2>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-8">
          <div className="flex-1 w-full max-w-[400px]">
            {[5, 4, 3, 2, 1].map((star) => (
              <div key={star} className="flex items-center gap-3 mb-2">
                <div className="flex items-center gap-1 w-[100px]">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      fill={i < star ? "#c04f36" : "none"}
                      color="#c04f36"
                      strokeWidth={1.5}
                    />
                  ))}
                </div>
                <div className="flex-1 h-3 bg-white rounded-sm overflow-hidden">
                  <div
                    className="h-full bg-[#c04f36]"
                    style={{ width: star === 5 ? "100%" : "0%" }}
                  ></div>
                </div>
                <span className="text-sm text-gray-400 w-4 text-right">
                  {star === 5 ? "9" : "0"}
                </span>
              </div>
            ))}
          </div>

          <button className="w-full md:w-[280px] h-[52px] bg-[#00c3ff] text-white rounded-full font-bold text-[14px] uppercase tracking-wide hover:bg-[#00a0d6] transition-colors">
            Write A Review
          </button>
        </div>

        <p className="text-sm text-gray-500 mb-6 font-medium">Most Recent</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {reviewsData.map((review) => (
            <div key={review.id} className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill="#c04f36" color="#c04f36" />
                ))}
              </div>
              <div className="flex items-center gap-3 mb-4">
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                    <User size={18} />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-[#c04f36] rounded-full flex items-center justify-center border border-white">
                    <Check size={8} color="white" strokeWidth={4} />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-bold text-black">{review.name}</span>
                  <span className="text-[9px] text-white bg-[#c04f36] px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">
                    Verified
                  </span>
                </div>
              </div>
              <h4 className="text-[14px] font-bold text-black mb-1 line-clamp-1">
                {review.title}
              </h4>
              <p className="text-[13px] text-gray-600 line-clamp-2">{review.desc}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-4 text-[13px] font-bold text-gray-500">
          <span className="text-black cursor-pointer">1</span>
          <span className="cursor-pointer hover:text-black">2</span>
          <span className="cursor-pointer hover:text-black">&gt;</span>
        </div>
      </div>
    </section>
  );
}
