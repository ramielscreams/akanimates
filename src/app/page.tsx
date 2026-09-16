import Link from "next/link";
import { InteriorMenu } from "@/components/navigation/interior-menu";
import { KineticPanelTypography } from "@/components/home/kinetic-panel-typography";
export default function Home() {
  return (
    <main className="home-entry min-h-dvh bg-bg text-text-primary">
      <InteriorMenu />
      <div className="home-entry__background" aria-hidden="true"><KineticPanelTypography word="AK" /></div>
      <div className="home-entry__content site-safe-x">
        <h1 className="sr-only">AK automotive photography and CGI portfolio</h1>
        <nav aria-label="Primary destinations" className="home-entry__destinations">
          <Link href="/about"><span className="site-technical-label">01 /</span><span>ABOUT</span></Link>
          <Link href="/work"><span className="site-technical-label">02 /</span><span>WORK</span></Link>
        </nav>
        <p className="home-entry__caption">Automotive photography & CGI.</p>
      </div>
    </main>
  );
}
