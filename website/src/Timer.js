import { Link } from 'react-router-dom'
import './timer.css'

export default function Timer() {
    return (
        <div className="timer">
            <h2>Digital Wall Clock</h2>

            <p>This is a Windows delay shutdown timer written in C#(windows form app).</p>

            <Link to='https://github.com/NossonSavin/Windows_Shutdown_Timer' target="_blank">Current code</Link>

            <img src={'pic/timer/1.png'} alt='timer pic 1' />
            <img src={'pic/timer/2.png'} alt='timer pic 2' />
            <img src={'pic/timer/3.png'} alt='timer pic 3' />
        </div>
    )
}