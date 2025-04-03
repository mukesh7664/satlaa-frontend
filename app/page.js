import func from "@/util/helpers/func";
import { API_URL } from "@/config";
import Head from "@/myapp/core/Head";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import HomeClient from "@/components/HomeClient/HomeClient";
import { fetchData } from "@/util/fetchData";

import HomeProductsFirst from "@/myapp/components/Home/HomeProductsFirst";
import Categories from "@/myapp/components/Tags";
import HomeSlider from "@/myapp/components/Home/HomeSlider";
import Features from "@/myapp/components/Home/Features";

async function getData() {
    const response = await fetch(`${API_URL}/homesliderpublic`, { cache: "no-store" });
    const resData = await response.json();

    const filterObjectFirst = { sort: { internal_rating: -1 }, limit: 10, skip: 0 };
    const responseProductFirst = await fetch(`${API_URL}/productspublic/home`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(filterObjectFirst),
        cache: "no-store",
    });
    const resProductFirst = await responseProductFirst.json();

    const filterObjectSeccond = { sort: { createdAt: -1 }, limit: 15, skip: 0 };
    const responseProductSeccond = await fetch(`${API_URL}/productspublic/home`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(filterObjectSeccond),
        cache: "no-store",
    });
    const resProductSeccond = await responseProductSeccond.json();

    return { resData, resProductFirst, resProductSeccond };
}

export default async function HomePage() {
    const { resData, resProductFirst, resProductSeccond } = await getData();

    const homeSlider = func.getCategoriesTree(resData, "61535837020a748d51968ecc");
    const colorSlider = func.getCategoriesTree(resData, "653fc9ef97d0b304b71eaab8");
    const homeFirstBox = func.getCategoriesTree(resData, "61537c2d6464c09286494c63");
    const startup = resData.find((e) => e._id === "653fcb2f97d0b304b71eabc9");

    const structuredData = {
        "@context": "http://schema.org",
        "@type": "WebSite",
        name: "SATLAA Jewellery",
        potentialAction: {
            "@type": "SearchAction",
            target: "https://satlaa.com/search?text={search_term_string}",
            "query-input": "required name=search_term_string",
        },
        url: "https://satlaa.com",
    };

    return (
        <div>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
            <Head />
            <div className="flex flex-col-reverse md:flex-col">
                <HomeSlider state={homeSlider} />
                <div className="relative">
                    <Categories />
                </div>
            </div>

            <Features />
            <HomeProductsFirst state={resProductFirst} title={{ title: "Best Sellers" }} />

            {/* Render Client Components */}
            <HomeClient homeFirstBox={homeFirstBox} startup={startup} colorSlider={colorSlider} resProductSeccond={resProductSeccond} />
        </div>
    );
}