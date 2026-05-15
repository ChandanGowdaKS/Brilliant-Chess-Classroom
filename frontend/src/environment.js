let IS_PROD = process.env.NODE_ENV === 'production';
const server = IS_PROD ?
    process.env.REACT_APP_BACKEND_URL || "https://apnacollegebackend.onrender.com" :
    process.env.REACT_APP_BACKEND_URL || "http://localhost:8000"


export default server;