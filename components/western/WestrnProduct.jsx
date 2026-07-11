import { products } from "@/data/products";
import WestrnProductCard from "./WestrnProductCard";
const WestrnProduct = () => {
  return (
        <section className="max-w-[1320px] mx-auto py-20">

      <h2 className="text-[55px] font-semibold mb-16">
        Western Wear
      </h2>

      <div className="grid grid-cols-3 gap-12">
        {products.map((item) => (
          <WestrnProductCard
            key={item.id}
            item={item}
          />
        ))}
      </div>

    </section>
  )
}

export default WestrnProduct