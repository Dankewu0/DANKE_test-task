import { NextResponse } from "next/server";
import { mockTariffs } from "@/app/_data/mockData";

interface ApiTariff {
    id: string;
    period: string;
    price: number;
    full_price: number;
    is_best: boolean;
    text: string;
}

export async function GET() {
    console.log("API route /api/plans triggered at", new Date().toISOString());
    try {
        const res = await fetch("https://t-core.fit-hub.pro/Test/GetTariffs", {
            signal: AbortSignal.timeout(5000),
        });
        if (!res.ok) {
            console.warn("External API failed, using mock data");
            const plans = mockTariffs.map((item) => ({
                id: item.id,
                title: item.period,
                price: item.price,
                oldPrice: item.full_price,
                discountPercent: item.full_price ? Math.round(((item.full_price - item.price) / item.full_price) * 100) : undefined,
                description: item.text,
                isBest: item.is_best,
            }));
            return NextResponse.json(plans);
        }

        const text = await res.text();
        console.log("Raw response from API:", text);
        const data: ApiTariff[] = text ? JSON.parse(text) : [];
        const plans = data.map((item) => ({
            id: item.id,
            title: item.period,
            price: item.price,
            oldPrice: item.full_price,
            discountPercent: item.full_price ? Math.round(((item.full_price - item.price) / item.full_price) * 100) : undefined,
            description: item.text,
            isBest: item.is_best,
        }));

        return NextResponse.json(plans);
    } catch (error) {
        console.error("Error in /api/plans route:", error);
        const plans = mockTariffs.map((item) => ({
            id: item.id,
            title: item.period,
            price: item.price,
            oldPrice: item.full_price,
            discountPercent: item.full_price ? Math.round(((item.full_price - item.price) / item.full_price) * 100) : undefined,
            description: item.text,
            isBest: item.is_best,
        }));
        return NextResponse.json(plans, { status: 500 });
    }
}