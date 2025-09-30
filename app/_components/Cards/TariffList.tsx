"use client";
import { useEffect, useState } from "react";
import TariffCard from "@/app/_components/Cards/TariffCard";
import {Button} from "@/app/_components/ui/button";

type Plan = {
    id: string;
    title: string;
    price: number;
    oldPrice?: number;
    discountPercent?: number;
    description?: string;
};

export default function TariffList({
                                      initialPlans,
                                      isExpired,
                                  }: {
    initialPlans: Plan[];
    isExpired: boolean;
}) {
    const [plans, setPlans] = useState<Plan[]>(initialPlans);
    const [selected, setSelected] = useState<string | null>(plans[0]?.id ?? null);
    const [agree, setAgree] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (isExpired) {
            setPlans((ps) =>
                ps.map((p) => ({
                    ...p,
                    price: p.oldPrice ?? p.price,
                    oldPrice: undefined,
                    discountPercent: undefined,
                }))
            );
        }
    }, [isExpired]);

    const handleBuy = () => {
        if (!agree) {
            setError(true);
            setTimeout(() => setError(false), 2000);
            return;
        }
        alert(`Покупка тарифа: ${selected}`);
    };

    return (
        <section className="mx-auto max-w-6xl px-4 py-10">
            <h2 className="mb-6 text-center text-2xl font-bold">
                Выбери подходящий <span className="text-yellow-400">тариф</span>
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
                {plans.map((plan) => (
                    <TariffCard
                        key={plan.id}
                        plan={plan}
                        selected={selected === plan.id}
                        onSelect={setSelected}
                        isExpired={isExpired}
                    />
                ))}
            </div>
            <div className="mx-auto mt-6 max-w-md">
                <label
                    className={`flex items-start gap-3 rounded-md p-3 ${
                        error ? "border-2 border-red-500 bg-red-50/5" : ""
                    }`}
                >
                    <input
                        type="checkbox"
                        checked={agree}
                        onChange={(e) => setAgree(e.target.checked)}
                        className="h-5 w-5 rounded"
                    />
                    <span className="text-sm text-gray-200">
            Я принимаю условия оплаты
            <div className="text-xs text-gray-400">
              Гарантия возврата 30 дней
            </div>
          </span>
                </label>
                <Button className="bg-orange-400 text-black"onClick={handleBuy} />
            </div>
        </section>
    );
}
