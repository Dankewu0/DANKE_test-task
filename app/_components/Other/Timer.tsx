'use client';

import { useState, useEffect } from "react";

export default function Timer({ onExpire }: { onExpire: () => void }) {
    const [time, setTime] = useState(120);

    useEffect(() => {
        if (time <= 0) {
            onExpire();
            return;
        }
        const id = setInterval(() => {
            setTime((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(id);
    }, [time, onExpire]);

    const mm = String(Math.floor(time / 60)).padStart(2, "0");
    const ss = String(time % 60).padStart(2, "0");
    const isNearEnd = time <= 30 && time > 0;

    return (
        <header className="sticky top-0 z-30 bg-emerald-800">
            <div className="py-2 text-center font-bold text-white">
                Успейте открыть пробную неделю —{" "}
                <span
                    className={`px-3 py-1 rounded font-mono ${
                        isNearEnd ? "text-red-500 animate-pulse" : ""
                    }`}
                >
          {mm}:{ss}
        </span>
            </div>
        </header>
    );
}
