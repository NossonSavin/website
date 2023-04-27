import { Link } from 'react-router-dom'
import './Website.css'

export default function Website() {
    return (
        <div className="website">
            <h2>This Website</h2>

            <p>This is the code for this website with all of the sensitive code removed. It is written in react and served with node and express.</p>

            <Link to='https://github.com/NossonSavin/website' target="_blank">Current code</Link>

            <img src={'pic/website/website.png'} alt='timer pic 1' />
        </div>
    )
}