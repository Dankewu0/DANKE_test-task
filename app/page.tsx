"use client";
import { useEffect, useState } from "react";
import TariffList, { Plan } from "@/app/_components/Cards/TariffList";
import { mockTariffs } from "@/app/_data/mockData";
import Image from "next/image";
import Timer from "@/app/_components/Other/Timer";

const TIMER_DURATION_SECONDS = 120;
const LOW_TIME_THRESHOLD_SECONDS = 30;

type RawTariff = {
    id: string;
    period: string;
    price: number;
    full_price: number;
    is_best: boolean;
    text: string;
};

const formatMockPlans = (tariffs: RawTariff[]): Plan[] => {
    return tariffs.map(t => ({
        id: t.id,
        title: t.period,
        price: t.price,
        oldPrice: t.full_price,
        discountPercent: Math.round(((t.full_price - t.price) / t.full_price) * 100),
        description: t.text,
        isBest: t.is_best,
    }));
};

export default function Page() {
    const [plans, setPlans] = useState<Plan[]>(formatMockPlans(mockTariffs));
    const [expired, setExpired] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [timeLeft, setTimeLeft] = useState(TIMER_DURATION_SECONDS);

    const isTimerLow = timeLeft <= LOW_TIME_THRESHOLD_SECONDS && timeLeft > 0;

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const res = await fetch("/api/plans", {
                    cache: "no-store",
                });

                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }

                const data: RawTariff[] = await res.json();

                if (!Array.isArray(data)) {
                    throw new Error("Invalid data format from API");
                }

                if (data.length > 0) {
                    setPlans(formatMockPlans(data));
                } else {
                    setError("API вернул пустой список тарифов. Отображаются моковые данные.");
                }

            } catch (err) {
                setError("Не удалось загрузить тарифы с API. Отображаются моковые данные.");
            }
        };
    }, []);

    const handleTimerExpire = () => {
        setExpired(true);
    };

    const handleTimerTick = (newTime: number) => {
        setTimeLeft(newTime);
    };

    return (
        <div className="min-h-screen bg-[#172128] flex flex-col items-center py-0 text-white font-sans">
            <div className="sticky top-0 z-10 w-full shadow-2xl">
                <Timer
                    onExpire={handleTimerExpire}
                    onTick={handleTimerTick}
                    timeLeft={timeLeft}
                />
            </div>

            <h1 className="text-3xl font-bold mt-8 mb-8 text-white">
                Выбери подходящий для себя <span className="text-[#FFC107]">тариф</span>
            </h1>

            <div className="flex flex-col lg:flex-row items-start justify-center max-w-7xl mx-auto gap-8 px-4">
                <div className="flex-shrink-0 flex items-center justify-center lg:justify-start lg:w-1/3">
                    <Image
                        src="/placeholder_man.png"
                        alt="Спортивный мужчина"
                        width={300}
                        height={600}
                        priority
                        className="object-contain h-[550px]"
                    />
                </div>

                <div className="flex-grow lg:w-2/3 max-w-lg">
                    {error && (
                        <div className="text-red-500 p-4 bg-red-900 border border-red-500 rounded mb-4 text-center">
                            {error}
                        </div>
                    )}
                    <TariffList
                        initialPlans={plans}
                        isExpired={expired}
                        isTimerLow={isTimerLow}
                    />
                </div>
            </div>

            <div
                className="mt-12 mb-8 bg-[#172128] p-6 rounded-2xl max-w-3xl text-center shadow-lg border border-[#172128]">
                <div
                    className="inline-block px-4 py-2 mb-4 text-lg font-bold text-[#3EE179] border border-[#3EE179] rounded-full">
                    гарантия возврата 30 дней
                </div>
                <p className="text-base text-gray-300">
                    Мы уверены, что наш план сработает для тебя и ты увидишь видимые результаты уже через 4 недели! Мы
                    даже готовы полностью вернуть твои деньги в течение 30 дней с момента покупки, если ты не получишь
                    видимых результатов.
                </p>
            </div>
        </div>
    );
}