"use client";
import { useEffect, useState } from "react";
import Timer from "@/app/_components/Other/Timer";
import TariffList from "@/app/_components/Cards/TariffList";
type Plan = {
  id: string;
  title: string;
  price: number;
  oldPrice?: number;
  discountPercent?: number;
  description?: string;
};

export default function Page() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    fetch("/api/plans")
        .then((res) => res.json())
        .then((data) => setPlans(data));
  }, []);

  return (
      <>
        <Timer onExpire={() => setExpired(true)} />
        <main className="min-h-screen bg-gray-900 text-white">
          <TariffList initialPlans={plans} isExpired={expired} />
        </main>
      </>
  );
}
