import Footer from "./_components/startpage/Footer";
import Header from "./_components/startpage/Header";
import Introduction from "./_components/startpage/Introduction";

export default function Home() {
  return (
    <div className="h-full w-full bg-[#1b1d1e] bg-dot-8-s-2-neutral-950">
      <Header />
      <Introduction />
      <Footer />
    </div>
  );
}
