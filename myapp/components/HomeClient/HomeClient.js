"use client";

import dynamic from "next/dynamic";

const ClientOnlyCuratorFeed = dynamic(() => import("@/myapp/components/ClientOnlyCuratorInstaFeed"), { ssr: false });
const Banners = dynamic(() => import("@/myapp/components/Home/Banners"), { ssr: false });
const HomeFirstBox = dynamic(() => import("@/myapp/components/Home/HomeFirstBox"), { ssr: false });
const HomeSeccoundBoxs = dynamic(() => import("@/myapp/components/Home/HomeSeccoundBoxs"), { ssr: false });
const ColorSlider = dynamic(() => import("@/myapp/components/Home/ColorSlider"), { ssr: false });

export default function HomeClient({ homeFirstBox, startup, colorSlider, resProductSeccond }) {
    return (
        <>
            <Banners state={startup} />
            <HomeFirstBox state={homeFirstBox} />
            <ColorSlider state={colorSlider} />
            <HomeSeccoundBoxs
                state={resProductSeccond}
                title={{ title: "New Products", description: "We Added New Products For You" }}
            />
            <ClientOnlyCuratorFeed />
        </>
    );
}