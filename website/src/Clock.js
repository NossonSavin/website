import { Link } from 'react-router-dom'
import './Clock.css'

export default function Clock() {
    return (
        <div className="clock">
            <h2>Digital Wall Clock</h2>

            <p>
                This is a Clock design I am working on. It is powered by a esp-32 microcontroller  running Arduino (C++ with some additions).
            </p>

            <Link to='https://github.com/NossonSavin/esp-32_Clock_RGB' target="_blank">Current arduino code</Link>
            <Link to='https://www.thingiverse.com/thing:5981823' target="_blank">Current Case design</Link>
            <Link to='/clockSample/index.html' target="_blank">Clock WebApp Sample</Link>

            <img src={'pic/clock/1.jpg'} alt='clock pic 1' />
            <img src={'pic/clock/2.jpg'} alt='clock pic 2' />
            <img src={'pic/clock/3.jpg'} alt='clock pic 3' />
        </div>
    )
}