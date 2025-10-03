import { useEffect } from "react";

type TimerProps = {
    timeLeft: number;
    onExpire: () => void;
    onTick: (newTime: number) => void;
};

export default function Timer({ timeLeft, onExpire, onTick }: TimerProps) {
    useEffect(() => {
        if (timeLeft <= 0) {
            onExpire();
            return;
        }
        const id = setInterval(() => {
            onTick(timeLeft - 1);
        }, 1000);
        return () => clearInterval(id);
    }, [timeLeft, onExpire, onTick]);

    const mm = String(Math.floor(timeLeft / 60)).padStart(2, "0");
    const ss = String(timeLeft % 60).padStart(2, "0");
    const isTimerLow = timeLeft <= 30 && timeLeft > 0;
    const isExpired = timeLeft <= 0;

    const timeClasses = `font-mono text-4xl font-extrabold tracking-wider transition-all duration-500
        ${isExpired ? 'text-gray-400' :
        isTimerLow ? 'text-red-400 animate-pulse' :
            'text-[#FDB056]'}`;

    return (
        <div className="w-full bg-[#1D5B43] text-center py-4 flex flex-col items-center justify-center relative rounded-b-xl border-b border-[#2E3D44]">
            <span className="text-white text-xl font-semibold mb-2">Успейте открыть пробную неделю</span>
            <div className={`flex items-center space-x-1 text-lg ${isExpired ? 'text-white' : 'text-white'}`}>
                <span className={timeClasses}>+</span>
                <span className={timeClasses}>
                    {mm} : {ss}
                </span>
                <span className={timeClasses}>+</span>
            </div>
        </div>
    );
}
