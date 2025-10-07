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
                            }: FeaturedCardProps): React.ReactElement {
    const displayPrice = isExpired ? (plan.oldPrice ?? plan.price) : plan.price;
    const displayOldPrice = isExpired ? undefined : plan.oldPrice;

    const discount = plan.discountPercent ?? (plan.oldPrice && plan.oldPrice > plan.price
        ? Math.round(((plan.oldPrice - plan.price) / plan.oldPrice) * 100)
        : undefined);

    const displayedDiscount = isExpired ? undefined : discount;
    const priceColor = "text-[#FDB056]";

    const cardClasses = selected
        ? "border-2 border-[#FDB056] transform scale-[1.01] shadow-[0_0_20px_rgba(253,176,86,0.5)]"
        : "border-2 border-[#FDB056] hover:border-[#FDB056]/80";

    return (
        <div
            onClick={() => onSelect(plan.id)}
            className={`relative cursor-pointer rounded-3xl px-8 py-8 bg-[#282E33] text-white transition-all duration-300 ${cardClasses} overflow-hidden`}
        >
            <div className="flex justify-between absolute top-0 left-0 w-full z-10">

                {displayedDiscount && (
                    <div className={`
                        hidden lg:block bg-[#D43F4F] text-white text-xs font-semibold 
                        px-4 py-0.5 rounded-b-sm ml-8
                    `}>
                        -{displayedDiscount}%
                    </div>
                )}

                <div className="flex justify-end w-full space-x-2 pr-8 pt-0">

                    {displayedDiscount && (
                        <div className={`
                            block lg:hidden bg-[#D43F4F] text-white text-xs font-semibold 
                            px-2 py-0.5 rounded-b-sm
                        `}>
                            -{displayedDiscount}%
                        </div>
                    )}
                    {plan.isBest && !isExpired && (
                        <div className="text-[#FDB056] text-xs font-bold px-2 py-0.5 rounded-sm">
                            ХИТ!
                        </div>
                    )}
                </div>
            </div>


            <div className="flex flex-col w-full pt-0">
                <div className="flex items-start justify-start w-full">

                    <div className="flex flex-col items-start pr-4">
                        <h3 className="font-bold text-2xl mb-0 lg:mb-0 lg:mt-[-5px] whitespace-nowrap">{plan.title}</h3>
                        <div className="flex flex-col items-start">
                            <div className="flex items-start relative">
                                <span className={`text-4xl lg:text-5xl font-bold ${priceColor} whitespace-nowrap`}>{displayPrice}</span>
                                <div className="flex flex-col items-start ml-1 mt-[5px]">
                                    <span className={`text-3xl lg:text-4xl font-bold ${priceColor}`}>₽</span>
                                </div>
                            </div>
                            {displayOldPrice && (
                                <div className="flex items-start mt-2">
                                    <span
                                        className="line-through text-[#919191] text-xs whitespace-nowrap"
                                    >
                                        {displayOldPrice} ₽
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col items-end pt-0 flex-grow text-right lg:pl-4">
                        {plan.description && (
                            <p className="text-sm lg:text-base text-gray-300">
                                {plan.description}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

type TariffListProps = {
    initialPlans: Plan[];
    isExpired: boolean;
    isTimerLow: boolean;
};

export default function TariffList({ initialPlans, isExpired, isTimerLow }: TariffListProps): React.ReactElement {
    const [plans, setPlans] = useState<Plan[]>(initialPlans);
    const [selected, setSelected] = useState<string | null>(
        initialPlans.find((p) => p.isBest)?.id ?? initialPlans[0]?.id ?? null
    );
    const [checkboxChecked, setCheckboxChecked] = useState<boolean>(false);
    const [checkboxError, setCheckboxError] = useState<boolean>(false);

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

    const handleBuy = (): void => {
        if (!checkboxChecked) {
            setCheckboxError(true);
            return;
        }
        console.log(`Покупка тарифа: ${selected}`);
    };

    const buttonClasses = useMemo((): string => {
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

    let bestPlan = plans.find((p): boolean => !!p.isBest);
    let standardPlans = plans
        .filter((p): boolean => !bestPlan || p.id !== bestPlan.id);

    if (isExpired && plans.length > 0) {
        const initialBestId = initialPlans.find(ip => ip.isBest)?.id;
        bestPlan = plans.find(p => p.id === initialBestId) || plans[0];
        standardPlans = plans.filter(p => p.id !== bestPlan!.id);
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

                <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
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
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            setCheckboxChecked(e.target.checked);
                            setCheckboxError(false);
                        }}
                        className={`
                            form-checkbox h-4 w-4 mt-1 appearance-none 
                            border-2 border-gray-500 
                            checked:bg-transparent checked:border-gray-500 
                            checked:text-[#FDB056] 
                            focus:ring-0 focus:ring-offset-0 transition-all duration-100 ease-in-out
                            ${checkboxError ? 'border-red-500' : ''}
                        `}
                        style={{
                            backgroundImage: checkboxChecked
                                ? `url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='%23FDB056' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e")`
                                : 'none',
                            backgroundSize: '100% 100%',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                            backgroundColor: 'transparent',
                        }}
                    />
                    <label className={`ml-2 text-sm text-left leading-tight 
                                       ${checkboxError ? 'text-red-500' : 'text-gray-500'} 
                                       transition-colors duration-200`}>
                        Я согласен с <span className="text-gray-500 cursor-pointer hover:underline">офертой рекуррентных платежей</span> и <span className="text-gray-500 cursor-pointer hover:underline">Политикой конфиденциальности</span>
                    </label>
                </div>
                <button
                    onClick={handleBuy}
                    disabled={!selected || !checkboxChecked}
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