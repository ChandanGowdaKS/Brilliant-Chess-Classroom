let IS_PROD = process.env.NODE_ENV === 'production';
const server = IS_PROD ?
    process.env.REACT_APP_BACKEND_URL || "https://brilliant-chess-classroom-2.onrender.com" :
    process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";

console.log('Backend Server URL:', server);
console.log('Is Production:', IS_PROD);


export default server;