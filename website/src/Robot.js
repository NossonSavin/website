import { Link } from "react-router-dom";
import './Robot.css'

export default function Robot() {
    return (
        <div className="robot">
            <h2>Robot Spider</h2>

            <p>This is a robot spider I made. It is powered by a esp-32 microcontroller  running Arduino (C++ with some additions).</p>
            
            <Link to='https://github.com/NossonSavin/robot_spider' target="_blank">Current code</Link>
           
            <img src={'gif/robot.gif'} alt='timer pic 1' />
            <img src={'pic/robot/render.png'} alt='timer pic 1' />
        </div>
    );
}