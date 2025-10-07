'use client';

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

    const priceColor = "text-white";

    return (
        <div
            onClick={() => onSelect(plan.id)}
            className={`relative cursor-pointer rounded-3xl px-5 py-6 bg-[#282E33] transition-all duration-300 text-white flex flex-col justify-start col-span-1 overflow-hidden
                ${selected
                ? "border-2 border-[#FDB056] transform scale-[1.02] shadow-[0_0_20px_rgba(253,176,86,0.2)]"
                : "border-2 border-[#383E44] hover:border-[#FDB060] hover:border-opacity-50"}
                shadow-lg`}
        >
            <div className="flex justify-between absolute top-0 left-0 w-full">

                {displayedDiscount && (
                    <div className={`
                        hidden lg:block bg-[#D43F4F] text-white text-xs font-semibold 
                        px-4 py-0.5 rounded-b-sm ml-6
                    `}>
                        -{displayedDiscount}%
                    </div>
                )}

                <div className="flex justify-end w-full space-x-2 pr-5">

                    {displayedDiscount && (
                        <div className={`
                            block lg:hidden bg-[#D43F4F] text-white text-xs font-semibold 
                            px-2 py-0.5 rounded-b-sm
                        `}>
                            -{displayedDiscount}%
                        </div>
                    )}

                </div>
            </div>

            <div className="flex flex-col w-full pt-0">
                <div className={`flex flex-row justify-between items-start w-full lg:flex-col lg:items-center`}>

                    <div className="flex flex-col items-start pr-4 flex-shrink-0 lg:items-center lg:pr-0 lg:pt-3">
                        <h3 className="font-bold text-lg lg:text-xl mb-0 whitespace-nowrap lg:text-center">{plan.title}</h3>
                        <div className="flex flex-col items-start lg:items-center">
                            <div className="flex items-start relative">
                                <span className={`text-2xl lg:text-3xl font-bold ${priceColor} whitespace-nowrap`}>{displayPrice}</span>
                                <div className="flex flex-col items-start ml-1 mt-[2px]">
                                    <span className={`text-xl lg:text-2xl font-bold ${priceColor}`}>₽</span>
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

                    <div className={`flex flex-col items-end pt-0 flex-grow text-right lg:items-center lg:text-center lg:pl-0 lg:pt-1`}>
                        {plan.description && (
                            <p className="text-xs lg:text-sm text-gray-300">
                                {plan.description}
                            </p>
                        )}
                    </div>
                </div>
            </div>
            <div className="mt-auto pt-2 text-center"></div>
        </div>
    );
}