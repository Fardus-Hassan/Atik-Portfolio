import { HomeView } from "@/components/home-view";
import { getSiteContent } from "@/lib/site";

export default async function Home() {
  return <HomeView content={await getSiteContent()} />;
}
