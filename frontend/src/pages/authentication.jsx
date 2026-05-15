import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AuthContext } from '../contexts/AuthContext';
import { Snackbar } from '@mui/material';

const defaultTheme = createTheme({
    palette: {
        primary: {
            main: '#f4a261',
        },
        secondary: {
            main: '#e76f51',
        },
    },
});

export default function Authentication() {
    const [username, setUsername] = React.useState();
    const [password, setPassword] = React.useState();
    const [name, setName] = React.useState();
    const [error, setError] = React.useState();
    const [message, setMessage] = React.useState();
    const [formState, setFormState] = React.useState(0);
    const [open, setOpen] = React.useState(false)

    const { handleRegister, handleLogin } = React.useContext(AuthContext);

    let handleAuth = async () => {
        try {
            if (formState === 0) {
                let result = await handleLogin(username, password)
            }
            if (formState === 1) {
                let result = await handleRegister(name, username, password);
                console.log(result);
                setUsername("");
                setMessage(result);
                setOpen(true);
                setError("")
                setFormState(0)
                setPassword("")
            }
        } catch (err) {
            console.log(err);
            let message = (err.response.data.message);
            setError(message);
        }
    }

    return (
        <ThemeProvider theme={defaultTheme}>
            <Grid container component="main" sx={{ height: '100vh' }}>
                <CssBaseline />
                <Grid
                    item
                    xs={false}
                    sm={4}
                    md={7}
                    sx={{
                        background: 'linear-gradient(135deg, #0f3460 0%, #1a1a2e 50%, #16213e 100%)',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        overflow: 'hidden',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            backgroundImage: `
                                repeating-linear-gradient(
                                    45deg,
                                    transparent,
                                    transparent 80px,
                                    rgba(244, 162, 97, 0.03) 80px,
                                    rgba(244, 162, 97, 0.03) 160px
                                )
                            `,
                        }
                    }}
                >
                    <Box sx={{ position: 'relative', zIndex: 2, textAlign: 'center', color: 'white', padding: 4 }}>
                        <Typography variant="h1" sx={{ 
                            fontSize: '4rem', 
                            fontFamily: "'Playfair Display', serif",
                            fontWeight: 700,
                            marginBottom: 2,
                            filter: 'drop-shadow(0 0 20px rgba(244, 162, 97, 0.5))'
                        }}>
                            ♔
                        </Typography>
                        <Typography variant="h3" sx={{ 
                            fontFamily: "'Playfair Display', serif", 
                            fontWeight: 600,
                            marginBottom: 2
                        }}>
                            Brilliant Chess Classroom
                        </Typography>
                        <Typography variant="h6" sx={{ 
                            color: 'rgba(255, 255, 255, 0.8)',
                            maxWidth: '500px',
                            lineHeight: 1.6
                        }}>
                            Master chess with personalized live coaching from grandmasters. Join thousands of students improving their game every day.
                        </Typography>
                        <Box sx={{ 
                            display: 'flex', 
                            gap: 3, 
                            justifyContent: 'center', 
                            marginTop: 4,
                            fontSize: '1.1rem'
                        }}>
                            <Box sx={{ textAlign: 'center' }}>
                                <Typography sx={{ fontSize: '2rem', marginBottom: 1 }}>♟️</Typography>
                                <Typography>Live Coaching</Typography>
                            </Box>
                            <Box sx={{ textAlign: 'center' }}>
                                <Typography sx={{ fontSize: '2rem', marginBottom: 1 }}>🎯</Typography>
                                <Typography>Strategy Analysis</Typography>
                            </Box>
                            <Box sx={{ textAlign: 'center' }}>
                                <Typography sx={{ fontSize: '2rem', marginBottom: 1 }}>🏆</Typography>
                                <Typography>Tournament Prep</Typography>
                            </Box>
                        </Box>
                    </Box>
                </Grid>
                <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                    <Box
                        sx={{
                            my: 8,
                            mx: 4,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Avatar sx={{ 
                            m: 1, 
                            bgcolor: '#f4a261',
                            width: 56,
                            height: 56,
                            fontSize: '2rem'
                        }}>
                            ♔
                        </Avatar>

                        <Typography component="h1" variant="h5" sx={{ 
                            fontFamily: "'Playfair Display', serif",
                            fontWeight: 600,
                            marginTop: 2,
                            marginBottom: 3
                        }}>
                            Welcome Back
                        </Typography>

                        <Box sx={{ display: 'flex', gap: 1, marginBottom: 3 }}>
                            <Button 
                                variant={formState === 0 ? "contained" : "outlined"} 
                                onClick={() => { setFormState(0) }}
                                sx={{ 
                                    textTransform: 'none',
                                    paddingX: 4,
                                    borderRadius: 2,
                                    fontWeight: 600
                                }}
                            >
                                Sign In
                            </Button>
                            <Button 
                                variant={formState === 1 ? "contained" : "outlined"} 
                                onClick={() => { setFormState(1) }}
                                sx={{ 
                                    textTransform: 'none',
                                    paddingX: 4,
                                    borderRadius: 2,
                                    fontWeight: 600
                                }}
                            >
                                Sign Up
                            </Button>
                        </Box>

                        <Box component="form" noValidate sx={{ mt: 1, width: '100%' }}>
                            {formState === 1 ? <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="name"
                                label="Full Name"
                                name="name"
                                value={name}
                                autoFocus
                                onChange={(e) => setName(e.target.value)}
                                sx={{ marginBottom: 2 }}
                            /> : <></>}

                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="username"
                                label="Username"
                                name="username"
                                value={username}
                                autoFocus={formState === 0}
                                onChange={(e) => setUsername(e.target.value)}
                                sx={{ marginBottom: 2 }}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                value={password}
                                type="password"
                                onChange={(e) => setPassword(e.target.value)}
                                id="password"
                                sx={{ marginBottom: 1 }}
                            />

                            {error && (
                                <Typography sx={{ 
                                    color: 'error.main', 
                                    marginTop: 1,
                                    fontSize: '0.9rem'
                                }}>
                                    {error}
                                </Typography>
                            )}

                            <Button
                                type="button"
                                fullWidth
                                variant="contained"
                                sx={{ 
                                    mt: 3, 
                                    mb: 2,
                                    paddingY: 1.5,
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    fontSize: '1.1rem',
                                    fontWeight: 600,
                                    background: 'linear-gradient(135deg, #f4a261 0%, #e76f51 100%)',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #e76f51 0%, #f4a261 100%)',
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 6px 20px rgba(244, 162, 97, 0.4)'
                                    },
                                    transition: 'all 0.3s ease'
                                }}
                                onClick={handleAuth}
                            >
                                {formState === 0 ? "Sign In" : "Create Account"}
                            </Button>
                        </Box>
                    </Box>
                </Grid>
            </Grid>

            <Snackbar
                open={open}
                autoHideDuration={4000}
                message={message}
            />
        </ThemeProvider>
    );
}