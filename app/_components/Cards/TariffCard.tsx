"use client";
export type Plan = {
    id: string;
    title: string;
    price: number;
    oldPrice?: number;
    discountPercent?: number;
    description?: string;
    isBest?: boolean;
};
export default function TariffCard({
                                       plan,
                                       selected,
                                       onSelect,
                                       isExpired,
                                   }: {
    plan: Plan;
    selected: boolean;
    onSelect: (id: string) => void;
    isExpired: boolean;
}) {
    const isBestVisible = plan.isBest && !isExpired;

    const displayPrice = isExpired ? (plan.oldPrice ?? plan.price) : plan.price;
    const displayOldPrice = isExpired ? undefined : plan.oldPrice;

    return (
        <div
            onClick={() => onSelect(plan.id)}
            className={`relative cursor-pointer rounded-2xl p-4 bg-[#1E2A32] border transition-all duration-300 text-white flex flex-col justify-start min-h-[220px]
                ${isBestVisible
                ? (selected ? "border-[#FFC107] col-span-2 order-first" : "border-[#2E3D44] col-span-2 order-first")
                : (selected ? "border-[#FFC107] col-span-1" : "border-[#2E3D44] col-span-1 hover:border-[#FFC107]/50")}
                shadow-lg`}
        >
            {isBestVisible && (
                <div className="absolute top-0 right-0 bg-[#FFC107] text-black text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-xl">
                    ХИТ!
                </div>
            )}

            <div className="flex flex-col">
                {plan.discountPercent && !isExpired && (
                    <div className={`absolute top-0 left-0 bg-[#D43F4F] text-white text-xs font-semibold px-2 py-0.5 rounded-br-lg rounded-tl-xl
                        ${isBestVisible ? 'mt-0' : 'mt-0'} `}>
                        -{plan.discountPercent}%
                    </div>
                )}

                <h3 className={`font-bold mb-1 ${isBestVisible ? 'text-xl mt-4' : 'text-lg mt-4'}`}>{plan.title}</h3>

                <div className="flex flex-col mt-2">
                    <div className={`font-extrabold text-white transition-colors duration-500 ${isBestVisible ? 'text-5xl' : 'text-3xl'}`}>
                        <span className="flex items-baseline space-x-2">
                            <span className={`${isBestVisible ? 'text-[#FFC107]' : 'text-white'}`}>{displayPrice} ₽</span>
                        </span>
                    </div>
                    {displayOldPrice && (
                        <span className={`text-base text-gray-500 line-through transition-opacity duration-500 mt-[-5px] ${isBestVisible ? 'text-lg' : 'text-sm'}`}>
                            {displayOldPrice} ₽
                        </span>
                    )}

                    {plan.description && (
                        <p className={`text-sm text-gray-400 mt-2 p-1 transition-all duration-300 
                            ${selected ? 'rounded' : 'border-transparent'}`}>
                            {plan.description}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}