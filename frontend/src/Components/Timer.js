import React, { useEffect, useMemo, useState } from "react";

const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;

function Timer({ deadline = new Date().toString() }) {
    const parsedDeadline = useMemo(() => Date.parse(deadline), [deadline]);
    const [time, setTime] = useState(parsedDeadline - Date.now());

    useEffect(() => {
        const interval = setInterval(
            () => setTime(parsedDeadline - Date.now()),
            1000,
        );

        return () => clearInterval(interval);
    }, [parsedDeadline]);

    return (
        <div className="timer">
            {Object.entries({
                D: time / DAY,
                h: (time / HOUR) % 24,
                m: (time / MINUTE) % 60,
                s: (time / SECOND) % 60,
            }).map(([label, value]) => (
                <div key={label} className="col-4" style={{
                'display': 'inline-block',                
                'textAlign': 'center',
                'width': '100px'
                }}>
                    <div className="box">
                        {`${Math.floor(value)}`.padStart(2, "0")} <span className="text">{label}</span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Timer