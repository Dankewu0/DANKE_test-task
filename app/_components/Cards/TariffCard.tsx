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
                                   }: TariffCardProps) {
    const displayPrice = isExpired ? (plan.oldPrice ?? plan.price) : plan.price;
    const displayOldPrice = isExpired ? undefined : plan.oldPrice;

    const discount = plan.discountPercent ?? (plan.oldPrice && plan.oldPrice > plan.price
        ? Math.round(((plan.oldPrice - plan.price) / plan.oldPrice) * 100)
        : undefined);

    const displayedDiscount = isExpired ? undefined : discount;

    return (
        <div
            onClick={() => onSelect(plan.id)}
            className={`relative cursor-pointer rounded-2xl p-4 bg-[#282E33] border transition-all duration-300 text-white flex flex-col justify-start col-span-1
                ${selected ? "border-[#FDB056] transform scale-[1.02]" : "border-[#383E44] hover:border-[#FDB056]/50"}
                shadow-lg`}
        >
            {displayedDiscount && (
                <div className={`absolute top-0 left-0 bg-[#D43F4F] text-white text-xs font-semibold px-2 py-0.5 rounded-br-lg rounded-tl-xl`}>
                    -{displayedDiscount}%
                </div>
            )}

            <h3 className={`font-bold text-lg mt-0`}>{plan.title}</h3>

            <div className="flex flex-col mt-2">
                <div className={`font-bold text-white text-3xl`}>
                    <span className="flex items-baseline space-x-2">
                        <span>{displayPrice} ₽</span>
                    </span>
                </div>

                {displayOldPrice && (
                    <span className={`text-sm text-gray-500 line-through mt-[-5px]`}>
                        {displayOldPrice} ₽
                    </span>
                )}
            </div>

            <div className="mt-auto pt-3">
                {plan.description && (
                    <p className={`text-xs text-gray-400 p-0 transition-all duration-300`}>
                        {plan.description}
                    </p>
                )}
            </div>
        </div>
    );
}
