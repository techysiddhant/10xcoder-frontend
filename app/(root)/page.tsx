import { Categories } from "@/components/home/categories";
import { Cta } from "@/components/home/cta";
import { Features } from "@/components/home/features";
import { Hero } from "@/components/home/hero";

const HomePage = () => {
  return (
    <>
      <Hero />
      <Features />
      <Categories />
      <Cta />
    </>
  );
};

export default HomePage;
