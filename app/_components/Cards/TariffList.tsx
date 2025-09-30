"use client";
import { useEffect, useState, useMemo } from "react";
import TariffCard from "./TariffCard";
import { Button } from "@/app/_components/ui/button";

export type Plan = {
    id: string;
    title: string;
    price: number;
    oldPrice?: number;
    discountPercent?: number;
    description?: string;
    isBest?: boolean;
};

type TariffListProps = {
    initialPlans: Plan[];
    isExpired: boolean;
    isTimerLow: boolean;
};

export default function TariffList({ initialPlans, isExpired, isTimerLow }: TariffListProps) {
    const [plans, setPlans] = useState(initialPlans);
    const [selected, setSelected] = useState(
        plans.find((p: Plan) => p.isBest)?.id ?? plans[0]?.id ?? null
    );

    useEffect(() => {
        const updatedPlans = initialPlans.map(p => {
            if (isExpired) {
                return {
                    ...p,
                    price: p.oldPrice ?? p.price,
                    oldPrice: undefined,
                    discountPercent: undefined,
                    isBest: false,
                };
            }
            return p;
        });
        setPlans(updatedPlans);
        if (isExpired && plans.find(p => p.id === selected)?.isBest) {
            setSelected(updatedPlans[0]?.id ?? null);
        }
    }, [initialPlans, isExpired]);

    const handleBuy = () => {
        alert(`Покупка тарифа: ${selected}`);
    };

    const buttonClasses = useMemo(() => {
        let classes = "w-full mt-6 bg-[#FFC107] text-black font-bold py-3 rounded-xl transition-all duration-300 transform active:scale-[0.99] shadow-lg";

        if (!selected) {
            classes += " opacity-60 cursor-not-allowed";
        } else if (isTimerLow && !isExpired) {
            classes += " animate-pulse-custom shadow-[0_0_20px_rgba(255,193,7,0.8)]";
        } else {
            classes += " hover:bg-[#e0b04c]";
        }

        return classes;
    }, [selected, isTimerLow, isExpired]);

    const sortedPlans = useMemo(() => {
        const best = plans.find(p => p.isBest);
        const others = plans.filter(p => !p.isBest);
        return best ? [best, ...others] : others;
    }, [plans]);

    if (!plans.length) {
        return (
            <div className="text-center p-8 bg-[#1E2A32] rounded-xl text-white">
                <h2 className="text-2xl font-bold mb-4">Тарифы не найдены.</h2>
                <p>Попробуйте позже.</p>
            </div>
        );
    }

    return (
        <div className="text-white p-0">
            <style jsx global>{`
                @keyframes pulse-custom {
                    0%, 100% {
                        box-shadow: 0 0 20px rgba(255, 193, 7, 0.8), 0 0 0 rgba(255, 193, 7, 0.4);
                    }
                    50% {
                        box-shadow: 0 0 40px rgba(255, 193, 7, 1), 0 0 10px rgba(255, 193, 7, 0.6);
                    }
                }
                .animate-pulse-custom {
                    animation: pulse-custom 1s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
            `}</style>

            <div className="p-0 bg-[#172128] rounded-xl shadow-lg">
                <div className="grid grid-cols-3 gap-4">
                    {sortedPlans.map((plan) => (
                        <TariffCard
                            key={plan.id}
                            plan={plan}
                            selected={plan.id === selected}
                            onSelect={setSelected}
                            isExpired={isExpired}
                        />
                    ))}
                </div>

                <div className="mt-6 flex items-start p-4 bg-[#1E2A32] rounded-xl border border-[#2E3D44] mx-4">
                    <svg className="h-5 w-5 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="2" y="2" width="20" height="20" rx="4" fill="#1E2A32" stroke="#1E2A32" strokeWidth="2"/>
                        <path d="M12 16V12M12 8H12.01" stroke="#FFC107" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>

                    <div className="ml-3 text-sm text-gray-300">
                        <p className="text-sm">
                            Следуя плану на 3 месяца и более, люди получают в
                            2 раза лучший результат, чем за 1 месяц
                        </p>
                    </div>
                </div>

                <button
                    onClick={handleBuy}
                    disabled={!selected}
                    className={buttonClasses}
                >
                    Купить
                </button>

                <p className="text-xs text-gray-500 mt-3 text-center px-4 pb-4">
                    Нажимая кнопку «Купить», Пользователь соглашается на разовое списание денежных средств для получения
                    пожизненного доступа к приложению. Пользователь соглашается, что данные кредитной/дебетовой карты
                    будут сохранены для осуществления покупок дополнительных услуг сервиса в случае желания пользователя.
                </p>
            </div>
        </div>
    );
}