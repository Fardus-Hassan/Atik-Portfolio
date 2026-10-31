import { HomeView } from "@/components/home-view";
import { getSiteContent } from "@/lib/content";

export default function Home() {
  return <HomeView content={getSiteContent()} />;
}
