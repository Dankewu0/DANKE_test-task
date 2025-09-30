"use client";
type Plan = {
    id: string;
    title: string;
    price: number;
    oldPrice?: number;
    discountPercent?: number;
    description?: string;
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
    return (
        <div
            onClick={() => onSelect(plan.id)}
            className={`cursor-pointer rounded-2xl p-4 transition ${
                selected
                    ? "border-2 border-yellow-400 bg-gray-800"
                    : "border border-gray-700 bg-gray-900"
            }`}
        >
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">{plan.title}</h3>
                {!isExpired && plan.discountPercent && (
                    <span className="bg-red-600 text-white text-xs px-2 py-1 rounded">
            -{plan.discountPercent}%
          </span>
                )}
            </div>

            <div className="mt-4">
                {!isExpired ? (
                    <div className="flex items-baseline gap-3">
                        <span className="text-2xl font-bold text-white">{plan.price} ₽</span>
                        {plan.oldPrice && (
                            <span className="line-through text-gray-400">{plan.oldPrice} ₽</span>
                        )}
                    </div>
                ) : (
                    <span className="text-2xl font-bold text-white">
            {plan.oldPrice ?? plan.price} ₽
          </span>
                )}
                {plan.description && (
                    <p className="mt-2 text-sm text-gray-300">{plan.description}</p>
                )}
            </div>
        </div>
    );
}
