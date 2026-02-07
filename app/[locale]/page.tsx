import Hero from "@/components/home/Hero";
import FeaturedCategories from "@/components/home/FeaturedCategories";
import FeaturedProducts from "@/components/home/FeaturedProducts";

export default function Home() {
  return (
    <div className="flex flex-col">
      <Hero />
      <FeaturedCategories />
      <FeaturedProducts />
    </div>
  );
}
