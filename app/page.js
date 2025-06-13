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

async function fetchWithRetry(url, options, retries = 5) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url, {
                ...options,
                signal: controller.signal,
                keepalive: true, // Keep connection alive
                mode: 'cors', // Enable CORS
                headers: {
                    ...options?.headers,
                    'Connection': 'keep-alive',
                }
            });

            clearTimeout(timeoutId); // Clear timeout if fetch succeeds

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            // Clear timeout if fetch fails
            clearTimeout(timeoutId);

            console.error(`Attempt ${i + 1} failed:`, error.message);

            if (i === retries - 1) {
                console.error('All retry attempts failed:', error);
                throw error;
            }

            // Exponential backoff with jitter
            const delay = Math.min(1000 * Math.pow(2, i) + Math.random() * 1000, 10000);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
}

async function getData() {
    try {
        const [resData, resProductFirst, resProductSeccond] = await Promise.all([
            // Fetch home slider data
            fetchWithRetry(`${API_URL}/homesliderpublic`, { 
                cache: "no-store"
            }),
            
            // Fetch best selling products
            fetchWithRetry(`${API_URL}/productspublic/home`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    sort: { internal_rating: -1 }, 
                    limit: 10, 
                    skip: 0 
                }),
                cache: "no-store",
            }),
            
            // Fetch latest products
            fetchWithRetry(`${API_URL}/productspublic/home`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    sort: { createdAt: -1 }, 
                    limit: 15, 
                    skip: 0 
                }),
                cache: "no-store",
            })
        ]);

        return { resData, resProductFirst, resProductSeccond };
    } catch (error) {
        console.error('Failed to fetch data:', error);
        return {
            resData: [],
            resProductFirst: { products: [] },
            resProductSeccond: { products: [] }
        };
    }
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