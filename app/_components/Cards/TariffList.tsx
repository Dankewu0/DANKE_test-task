"use client";
import { useState, useMemo, useEffect } from "react";
import TariffCard, { Plan as ImportedPlanType } from "./TariffCard";

export type Plan = ImportedPlanType;

type FeaturedCardProps = {
    plan: Plan;
    selected: boolean;
    onSelect: (id: string) => void;
    isExpired: boolean;
};

function FeaturedTariffCard({
                                plan,
                                selected,
                                onSelect,
                                isExpired,
                            }: FeaturedCardProps) {
    const displayPrice = isExpired ? (plan.oldPrice ?? plan.price) : plan.price;
    const displayOldPrice = isExpired ? undefined : plan.oldPrice;

    const discount = plan.discountPercent ?? (plan.oldPrice && plan.oldPrice > plan.price
        ? Math.round(((plan.oldPrice - plan.price) / plan.oldPrice) * 100)
        : undefined);

    const displayedDiscount = isExpired ? undefined : discount;

    return (
        <div
            onClick={() => onSelect(plan.id)}
            className={`relative cursor-pointer rounded-2xl p-6 bg-[#282E33] text-white shadow-xl transition-all duration-300
                ${selected ? "border border-[#FDB056] transform scale-[1.01]" : "border border-[#383E44] hover:border-[#FDB056]/50"}`}
        >
            {!isExpired && (
                <div className="absolute top-0 right-0 bg-[#FDB056] text-black text-sm font-bold px-4 py-1 rounded-bl-lg rounded-tr-xl">
                    ХИТ!
                </div>
            )}

            {displayedDiscount && (
                <div className={`absolute top-0 left-0 bg-[#D43F4F] text-white text-sm font-semibold px-3 py-1 rounded-br-lg rounded-tl-xl`}>
                    -{displayedDiscount}%
                </div>
            )}

            <div className="flex flex-col sm:flex-row items-start justify-between w-full pt-2">
                <div className="flex flex-col items-start">
                    <h3 className="font-bold text-xl">{plan.title}</h3>

                    <div className="flex flex-col items-start mt-2">
                        <div className="flex items-baseline gap-2">
                            <span className="text-5xl font-bold text-[#FDB056]">{displayPrice} ₽</span>
                            {displayOldPrice && (
                                <span className="line-through text-gray-500 text-lg mt-3">{displayOldPrice} ₽</span>
                            )}
                        </div>
                    </div>
                </div>

                {plan.description && (
                    <p className="mt-2 text-sm text-gray-400 text-left max-w-[150px] pt-1">
                        {plan.description}
                    </p>
                )}
            </div>
        </div>
    );
}

type TariffListProps = {
    initialPlans: Plan[];
    isExpired: boolean;
    isTimerLow: boolean;
};

export default function TariffList({ initialPlans, isExpired, isTimerLow }: TariffListProps) {
    const [plans, setPlans] = useState<Plan[]>(initialPlans);
    const [selected, setSelected] = useState<string | null>(
        initialPlans.find((p) => p.isBest)?.id ?? initialPlans[0]?.id ?? null
    );
    const [checkboxChecked, setCheckboxChecked] = useState(false);
    const [checkboxError, setCheckboxError] = useState(false);

    useEffect(() => {
        const bestId = initialPlans.find((p) => p.isBest)?.id;
        if (bestId) {
            setSelected(bestId);
        } else if (initialPlans.length > 0) {
            setSelected(initialPlans[0].id);
        }
    }, [initialPlans]);

    useEffect(() => {
        setCheckboxError(false);
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

        if (isExpired && initialPlans.find(p => p.id === selected)?.isBest) {
            setSelected(updatedPlans[0]?.id ?? null);
        }
    }, [initialPlans, isExpired, selected]);

    const handleBuy = () => {
        if (!checkboxChecked) {
            setCheckboxError(true);
            return;
        }
        console.log(`Покупка тарифа: ${selected}`);
    };

    const buttonClasses = useMemo(() => {
        let classes = "w-full mt-6 bg-[#FDB056] text-black font-extrabold py-3 rounded-xl transition-all duration-300 transform active:scale-[0.99] shadow-lg";

        if (!selected) {
            classes += " opacity-60 cursor-not-allowed";
        } else if (isTimerLow && !isExpired) {
            classes += " animate-pulse-custom shadow-[0_0_20px_rgba(253,176,86,0.8)]";
        } else {
            classes += " hover:bg-[#e8a350]";
        }
        return classes;
    }, [selected, isTimerLow, isExpired]);

    let bestPlan = plans.find(p => p.isBest);
    let standardPlans = plans.filter(p => !bestPlan || p.id !== bestPlan.id).sort((a, b) => (a.price - b.price));

    if (isExpired && plans.length > 0) {
        bestPlan = plans[0];
        standardPlans = plans.slice(1);
    }

    if (!bestPlan && plans.length > 0) {
        bestPlan = plans[0];
        standardPlans = plans.slice(1);
    }

    if (!plans.length) {
        return (
            <div className="text-center p-8 bg-[#282E33] rounded-xl text-white">
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
                        box-shadow: 0 0 20px rgba(253, 176, 86, 0.8), 0 0 0 rgba(253, 176, 86, 0.4);
                    }
                    50% {
                        box-shadow: 0 0 40px rgba(253, 176, 86, 1), 0 0 10px rgba(253, 176, 86, 0.6);
                    }
                }
                .animate-pulse-custom {
                    animation: pulse-custom 1s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
            `}</style>

            <div className="p-0 bg-[#232829] rounded-xl shadow-lg">

                {bestPlan && (
                    <div className="mb-6">
                        <FeaturedTariffCard
                            key={bestPlan.id}
                            plan={bestPlan}
                            selected={bestPlan.id === selected}
                            onSelect={setSelected}
                            isExpired={isExpired}
                        />
                    </div>
                )}

                <div className="grid gap-4 grid-cols-3">
                    {standardPlans.map((plan) => (
                        <TariffCard
                            key={plan.id}
                            plan={plan}
                            selected={plan.id === selected}
                            onSelect={setSelected}
                            isExpired={isExpired}
                        />
                    ))}
                </div>

                <div className="mt-6 flex items-start p-4 mx-0 bg-[#282E33] rounded-xl border border-[#383E44]">
                    <span className="text-xl text-[#FDB056] mr-3 font-bold">!</span>
                    <div className="ml-0 text-sm text-gray-300 text-left">
                        <p className="text-sm">
                            Следуя плану на 3 месяца и более, люди получают в
                            2 раза лучший результат, чем за 1 месяц
                        </p>
                    </div>
                </div>

                <div className="flex items-start mt-4 px-4">
                    <input
                        type="checkbox"
                        checked={checkboxChecked}
                        onChange={(e) => {
                            setCheckboxChecked(e.target.checked);
                            setCheckboxError(false);
                        }}
                        className={`form-checkbox h-4 w-4 mt-1 bg-[#1E2A32] border-[#2E3D44] text-[#FDB056] rounded transition-all duration-300 ${checkboxError ? 'border-red-500 ring-2 ring-red-500' : 'focus:ring-[#FDB056]'}`}
                    />
                    <label className={`ml-2 text-sm text-left leading-tight ${checkboxError ? 'text-red-500' : 'text-gray-400'}`}>
                        Я согласен с <span className="text-white font-bold cursor-pointer hover:text-[#FDB056]/80">офертой рекуррентных платежей</span> и <span className="text-white font-bold cursor-pointer hover:text-[#FDB056]/80">Политикой конфиденциальности</span>
                    </label>
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
