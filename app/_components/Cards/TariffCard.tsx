'use state';

import React from "react";

export type Plan = {
    id: string;
    title: string;
    price: number;
    oldPrice?: number;
    discountPercent?: number;
    description?: string;
    isBest?: boolean;
};

type TariffCardProps = {
    plan: Plan;
    selected: boolean;
    onSelect: (id: string) => void;
    isExpired: boolean;
}

export default function TariffCard({
                                       plan,
                                       selected,
                                       onSelect,
                                       isExpired,
                                   }: TariffCardProps): React.ReactElement {

    const displayPrice = isExpired ? (plan.oldPrice ?? plan.price) : plan.price;
    const displayOldPrice = isExpired ? undefined : plan.oldPrice;

    const discount = plan.discountPercent ?? (plan.oldPrice && plan.oldPrice > plan.price
        ? Math.round(((plan.oldPrice - plan.price) / plan.oldPrice) * 100)
        : undefined);

    const displayedDiscount = isExpired ? undefined : discount;

    return (
        <div
            onClick={() => onSelect(plan.id)}
            className={`relative cursor-pointer rounded-3xl py-14 px-5 bg-[#282E33] border transition-all duration-300 text-white flex flex-col justify-start col-span-1
                ${selected
                ? "border-[#FDB056] transform scale-[1.02]"
                : "border-[#383E44] hover:border-[#FDB056]/50"}
                shadow-lg`}
        >
            {displayedDiscount && (
                <div className={`absolute top-0 left-0 bg-[#D43F4F] text-white text-xs font-semibold px-2 py-0.5 rounded-b-sm ml-12`}>
                    -{displayedDiscount}%
                </div>
            )}
            <h3 className={`text-center text-2xl mt-0`}>{plan.title}</h3>
            <div className="flex flex-col mt-4 mb-8 items-center">
                <div className={`font-bold text-white text-5xl`}>
                    <span className="flex items-baseline space-x-2">
                        <span>{displayPrice} ₽</span>
                    </span>
                </div>
                {displayOldPrice && (
                    <span className={`text-base text-gray-500 ml-12 line-through mt-0`}>
                        {displayOldPrice} ₽
                    </span>
                )}
            </div>
            <div className="mt-auto pt-0 text-left">
                {plan.description && (
                    <p className={`text-base text-gray-200 p-0 transition-all duration-300`}>
                        {plan.description.split(' ').map((word, index, arr) => (
                            <React.Fragment key={index}>
                                {word}
                                {(word === "порядке" || word === "результаты" || word === "начать") && arr.length > index + 1 ? <br /> : ' '}
                            </React.Fragment>
                        ))}
                    </p>
                )}
            </div>
        </div>
    );
}
