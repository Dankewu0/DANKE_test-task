"use client";
import { useEffect, useState } from "react";
import TariffList, { Plan } from "@/app/_components/Cards/TariffList";
import Timer from "@/app/_components/Other/Timer";
import { mockTariffs } from "@/app/_data/mockData";
import Image from "next/image";

const TIMER_DURATION_SECONDS: number = 180;
const LOW_TIME_THRESHOLD_SECONDS: number = 30;

type RawTariff = {
    id: string;
    period: string;
    price: number;
    full_price: number;
    is_best: boolean;
    text: string;
};

const PERIOD_ORDER: string[] = ["Навсегда", "3 месяца", "1 месяц", "1 неделя"];

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
        const aIndex = PERIOD_ORDER.indexOf(a.title);
        const bIndex = PERIOD_ORDER.indexOf(b.title);

        if (aIndex === -1 && bIndex === -1) return 0;
        if (aIndex === -1) return 1;
        if (bIndex === -1) return -1;

        return aIndex - bIndex;
    });
};

const IMAGE_WIDTH = 381;
const IMAGE_HEIGHT = 767;
const IMAGE_OFFSET_WIDTH = IMAGE_WIDTH + 32;

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
                <div className="grid grid-cols-1 lg:grid-cols-5 items-start mx-auto gap-8 mb-4">
                    <div className="lg:col-span-2 w-full hidden lg:flex justify-end">
                        <div
                            className="w-full text-left"
                            style={{ maxWidth: `${IMAGE_OFFSET_WIDTH}px` }}
                        >
                            <h1 className="text-3xl sm:text-4xl font-bold text-white whitespace-nowrap">
                                Выбери подходящий для себя <span className="text-[#FDB056]">тариф</span>
                            </h1>
                        </div>
                    </div>
                    <div className="lg:col-span-3 w-full" />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-5 items-start justify-center mx-auto gap-8">
                    <div className="lg:col-span-2 w-full flex justify-center lg:justify-end">
                        <div className="relative">
                            <Image
                                src="/freepik-export-20240531103402atHS.png"
                                alt="Спортивный мужчина"
                                width={IMAGE_WIDTH}
                                height={IMAGE_HEIGHT}
                                className={`
                                    object-cover transition-all duration-300
                                    w-[381px] 
                                    h-[767px]
                                    lg:mr-8 
                                `}
                            />
                            <div
                                className="absolute bottom-0 left-0 w-full h-48 pointer-events-none"
                                style={{
                                    background: 'linear-gradient(to top, #232829 0%, transparent 100%)',
                                }}
                            ></div>
                        </div>
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
                <div className="grid grid-cols-1 lg:grid-cols-5 items-start mx-auto gap-8 mt-12 w-full">
                    <div className="lg:col-span-5 w-full bg-[#232829] rounded-2xl shadow-lg border border-[#383E44]">
                        <div className="grid grid-cols-1 lg:grid-cols-5 items-start mx-auto gap-8 py-6 w-full">
                            <div className="lg:col-span-4 w-full px-4 sm:px-4">
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
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}