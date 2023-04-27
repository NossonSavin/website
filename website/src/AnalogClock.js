import { useEffect } from 'react'
import './AnalogClock.css'
import { useState } from 'react'
import { Link } from 'react-router-dom';

export default function AnalogClock() {
    let [time, setTime] = useState(new Date());

    useEffect(() => {
        setTimeout(() => {
            setTime(new Date());
        }, 1000);
    }, [time])

    function clock() {
        let face = [];

        for (let i = 1; i <= 12; i++) {
            face.push(
                <div key={i + 60} className='numberBox' style={{ transform: `rotate(${i * 30}deg)` }}>
                    <div className='number' style={{ transform: `rotate(${i * 330}deg)` }}>{i}</div>
                </div>
            );
        }

        for (let i = 0; i <= 60; i++) {
            face.push(
                <div key={i} className='minBox' style={{ transform: `rotate(${i * 6}deg)` }}>
                    <div className={(i) % 5 === 0 ? "min bigger" : "min"} ></div>
                </div>
            );
        }
        return face;
    }

    return (
        <div className='clockPage'>
            <div className='info'>
                <p>This is a Analog Clock I made using javaScript and css in react.</p>
                <Link to='https://github.com/NossonSavin/javascriptAnalogClock' target="_blank">Clock Code Here</Link>
            </div>
            <div id="clockBorder">
                <div id="clock">
                    {clock()}
                    <div id="face"></div>
                    <div id="dot"></div>
                    <div id="min" className="hand" style={{ transform: `rotate(${(time.getMinutes() * 6) + (time.getSeconds() * 0.1)}deg)` }}></div>
                    <div id="hour" className="hand" style={{ transform: `rotate(${(time.getHours() * 30) + (time.getMinutes() * 0.5) + (time.getSeconds() * 0.0083333333333333)}deg)` }}></div>
                    <div id="sec" className="hand" style={{ transform: `rotate(${time.getSeconds() * 6}deg)` }}></div>
                </div>
            </div>

            <div className='showTime'>{time.toLocaleTimeString()}</div>
        </div>
    )
}