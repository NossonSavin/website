import { Link } from 'react-router-dom'
import './Snake.css'

export default function Snake() {
    return (
        <div className="snake">
            <h2>Retro Snake</h2>

            <p>This is a javascript snake Game I made for fun. The high score is saved on a mongoDB.</p>

            <Link to='/retrosnake/index.html' target="_blank">Click here to play Retro Snake</Link>

            <img src={'gif/snake.gif'} alt='timer pic 1' />
        </div>
    )
}