import LandingHeader from "@/components/landing-page/landing-header";
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";
import { Highlight } from "@/components/ui/hero-highlight";

export default function Home() {
  return (
    <div>
      <LandingHeader />
      <BackgroundGradientAnimation>
        <div className="gap-y-6 absolute z-50 inset-0 flex flex-col items-center justify-center text-white font-bold px-4 pointer-events-none  text-center md:text-4xl lg:text-7xl">
          <p className=" bg-clip-text text-transparent drop-shadow-2xl bg-gradient-to-b from-white/80 to-white/20">
            Welcome to <Highlight className="text-black">FTrade</Highlight>
          </p>
          <p className="bg-clip-text text-transparent drop-shadow-2xl bg-gradient-to-b from-white/80 to-white/20">
            Goods trading services platform
          </p>
        </div>
      </BackgroundGradientAnimation>
    </div>
  );
}
