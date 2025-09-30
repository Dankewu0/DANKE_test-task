import { NextResponse } from "next/server";

const PLANS = [
    {
        id: "forever",
        title: "Навсегда",
        price: 5990,
        oldPrice: 19900,
        discountPercent: 70,
        description: "Для тех, кто хочет всегда быть в форме",
    },
    {
        id: "3m",
        title: "3 месяца",
        price: 1990,
        oldPrice: 3990,
        discountPercent: 50,
        description: "Привести тело в порядок",
    },
    {
        id: "1m",
        title: "1 месяц",
        price: 990,
        oldPrice: 1690,
        discountPercent: 40,
        description: "Получить первые результаты",
    },
    {
        id: "1w",
        title: "1 неделя",
        price: 690,
        oldPrice: 990,
        discountPercent: 30,
        description: "Чтобы просто начать",
    },
];

export async function GET() {
    await new Promise((r) => setTimeout(r, 200)); // имитация задержки
    return NextResponse.json(PLANS);
}


// Код является заглушкой.