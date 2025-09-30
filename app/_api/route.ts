import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch("https://t-core.fit-hub.pro/Test/GetTariffs");
    const data = await res.json();

    const plans = data.map((item: any) => ({
      id: item.id,
      title: item.period,
      price: item.price,
      oldPrice: item.full_price,
      discountPercent: item.full_price
        ? Math.round(((item.full_price - item.price) / item.full_price) * 100)
        : undefined,
      description: item.text,
      isBest: item.is_best,
    }));

    return NextResponse.json(plans);
  } catch (error) {
    console.error("Ошибка получения тарифов:", error);
    return NextResponse.json([], { status: 500 });
  }
}


