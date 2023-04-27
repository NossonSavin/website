import { Link } from "react-router-dom";
import './error.css';

export default function ErrorPage() {
    return (
        <div id="error">
            <div className="errorMsg">
                <div>Failed To Load</div>
                <Link to={'/'}>Click Here To Home Page</Link>
            </div>
        </div>
    )
}