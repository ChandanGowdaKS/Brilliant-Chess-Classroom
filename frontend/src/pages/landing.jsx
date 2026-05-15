import React from 'react'
import "../App.css"
import { Link, useNavigate } from 'react-router-dom'

export default function LandingPage() {
    const router = useNavigate();

    return (
        <div className='landingPageContainer'>
            <nav>
                <div className='navHeader'>
                    <div className='logoContainer'>
                        <span className='chessIcon'>♔</span>
                        <h2>Brilliant Chess Classroom</h2>
                    </div>
                </div>
                <div className='navlist'>
                    <p onClick={() => router("/aljk23")} className='navItem'>
                        Join as Guest
                    </p>
                    <p onClick={() => router("/auth")} className='navItem'>
                        Register
                    </p>
                    <div onClick={() => router("/auth")} role='button' className='loginButton'>
                        <p>Login</p>
                    </div>
                </div>
            </nav>

            <div className="landingMainContainer">
                <div className='contentSection'>
                    <h1>
                        Master Chess with 
                        <span className='highlight'> Live Coaching</span>
                    </h1>
                    <p className='subtitle'>
                        Connect with grandmasters and improve your game through personalized video lessons
                    </p>
                    <div role='button' className='ctaButton'>
                        <Link to={"/auth"}>Start Learning</Link>
                    </div>
                    <div className='features'>
                        <div className='feature'>
                            <span>♟️</span>
                            <p>Live Coaching</p>
                        </div>
                        <div className='feature'>
                            <span>🎯</span>
                            <p>Strategy Analysis</p>
                        </div>
                        <div className='feature'>
                            <span>🏆</span>
                            <p>Tournament Prep</p>
                        </div>
                    </div>
                </div>
                <div className='imageSection'>
                    <div className='chessBoardGlow'></div>
                </div>
            </div>
        </div>
    )
}
