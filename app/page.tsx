"use client";
import { useEffect, useState } from "react";
import TariffList, { Plan } from "@/app/_components/Cards/TariffList";
import Timer from "@/app/_components/Other/Timer";
import { mockTariffs } from "@/app/_data/mockData";

const TIMER_DURATION_SECONDS: number = 120;
const LOW_TIME_THRESHOLD_SECONDS: number = 30;

type RawTariff = {
    id: string;
    period: string;
    price: number;
    full_price: number;
    is_best: boolean;
    text: string;
};

const formatPlans = (tariffs: RawTariff[]): Plan[] => {
    return tariffs.map(t => ({
        id: t.id,
        title: t.period,
        price: t.price,
        oldPrice: t.full_price,
        discountPercent: t.full_price > t.price ? Math.round(((t.full_price - t.price) / t.full_price) * 100) : undefined,
        description: t.text,
        isBest: t.is_best,
    })).sort((a, b) => {
        if (a.isBest) return -1;
        if (b.isBest) return 1;
        return a.price - b.price;
    });
};

export default function Page() {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [expired, setExpired] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [timeLeft, setTimeLeft] = useState<number>(TIMER_DURATION_SECONDS);
    const [loading, setLoading] = useState<boolean>(true);

    const isTimerLow = timeLeft <= LOW_TIME_THRESHOLD_SECONDS && timeLeft > 0;

    useEffect(() => {
        try {
            const rawTariffs: RawTariff[] = mockTariffs;
            setPlans(formatPlans(rawTariffs));
        } catch (e: unknown) {
            setError("Ошибка при обработке данных.");
        } finally {
            setLoading(false);
        }
    }, []);

    const handleTimerExpire = (): void => {
        setExpired(true);
    };

    const handleTimerTick = (newTime: number): void => {
        setTimeLeft(newTime);
    };

    const isBestPlanAvailable = plans.length > 0 && plans[0].isBest;

    return (
        <div className="min-h-screen bg-[#232829] flex flex-col items-center py-0 text-white font-sans">
            <div className="sticky top-0 z-10 w-full shadow-2xl">
                <Timer
                    onExpire={handleTimerExpire}
                    onTick={handleTimerTick}
                    timeLeft={timeLeft}
                />
            </div>

            <main className="max-w-7xl w-full px-4 pt-12 pb-12">
                <h1 className="text-3xl sm:text-4xl font-bold text-white text-center mb-10">
                    Выбери подходящий для себя <span className="text-[#FDB056]">тариф</span>
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-5 items-start justify-center mx-auto gap-8">

                    <div className="lg:col-span-2 w-full flex justify-center lg:justify-end">
                        <img
                            src="https://placehold.co/400x600/1A1D20/white?text=Спортивный+мужчина"
                            alt="Спортивный мужчина"
                            className={`
                                w-full max-w-xs lg:max-w-none object-cover rounded-xl transition-all duration-300 shadow-xl 
                                h-[550px]
                             
                            `}
                        />
                    </div>

                    <div className="lg:col-span-3 w-full">
                        {loading && <div className="text-center p-8 bg-[#282E33] rounded-xl">Загрузка тарифов...</div>}
                        {error && (
                            <div className="text-red-500 p-4 bg-red-900 border border-red-500 rounded mb-4 text-center">
                                {error}
                            </div>
                        )}
                        {!loading && !error && plans.length > 0 && (
                            <TariffList
                                initialPlans={plans}
                                isExpired={expired}
                                isTimerLow={isTimerLow}
                            />
                        )}
                    </div>
                </div>

                <div
                    className="mt-12 mb-8 p-6 rounded-2xl w-full mx-auto text-center shadow-lg border border-[#383E44] bg-[#282E33]">
                    <div
                        className="inline-block px-4 py-2 mb-4 text-lg font-bold text-[#3EE179] border border-[#3EE179] rounded-xl">
                        Гарантия возврата 30 дней
                    </div>
                    <p className="text-base text-gray-400">
                        Мы уверены, что наш план сработает для тебя и ты увидишь видимые результаты уже через 4 недели! Мы
                        даже готовы полностью вернуть твои деньги в течение 30 дней с момента покупки, если ты не получишь
                        видимых результатов.
                    </p>
                </div>
            </main>
        </div>
    );
}
