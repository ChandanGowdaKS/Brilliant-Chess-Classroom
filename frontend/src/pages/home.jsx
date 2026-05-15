import React, { useContext, useState } from 'react'
import withAuth from '../utils/withAuth'
import { useNavigate } from 'react-router-dom'
import "../App.css";
import { Button, IconButton, TextField } from '@mui/material';
import RestoreIcon from '@mui/icons-material/Restore';
import { AuthContext } from '../contexts/AuthContext';

function HomeComponent() {
    let navigate = useNavigate();
    const [meetingCode, setMeetingCode] = useState("");

    const {addToUserHistory} = useContext(AuthContext);
    let handleJoinVideoCall = async () => {
        await addToUserHistory(meetingCode)
        navigate(`/${meetingCode}`)
    }

    return (
        <>
            <div className="navBar">
                <div style={{ display: "flex", alignItems: "center" }}>
                    <span className='chessIcon' style={{ fontSize: '2rem', marginRight: '10px' }}>♔</span>
                    <h2>Brilliant Chess Classroom</h2>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: '15px' }}>
                    <IconButton onClick={() => navigate("/history")} className='iconButton'>
                        <RestoreIcon />
                    </IconButton>
                    <p style={{ cursor: 'pointer' }}>History</p>

                    <Button 
                        onClick={() => {
                            localStorage.removeItem("token")
                            navigate("/auth")
                        }}
                        variant="outlined"
                        className='logoutButton'
                    >
                        Logout
                    </Button>
                </div>
            </div>

            <div className="meetContainer">
                <div className="leftPanel">
                    <div className='meetingCard'>
                        <h2>
                            <span className='chessIcon'>♟️</span>
                            Join Your Chess Lesson
                        </h2>
                        <p className='meetingSubtitle'>
                            Enter your classroom code to start learning
                        </p>

                        <div className='meetingInputContainer'>
                            <TextField 
                                onChange={e => setMeetingCode(e.target.value)} 
                                id="outlined-basic" 
                                label="Classroom Code" 
                                variant="outlined"
                                fullWidth
                                className='meetingInput'
                            />
                            <Button 
                                onClick={handleJoinVideoCall} 
                                variant='contained'
                                className='joinButton'
                                size='large'
                            >
                                Join Lesson
                            </Button>
                        </div>

                        <div className='quickTips'>
                            <p className='tipsTitle'>Quick Tips:</p>
                            <ul>
                                <li>Ensure your camera and microphone are enabled</li>
                                <li>Have your chessboard ready</li>
                                <li>Prepare any questions in advance</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className='rightPanel'>
                    <div className='chessImageContainer'>
                        <div className='chessPieces'>♔ ♕ ♖ ♗ ♘ ♙</div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default withAuth(HomeComponent)