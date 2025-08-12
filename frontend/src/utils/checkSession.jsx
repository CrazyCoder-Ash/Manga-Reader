// /utils/checkSession.js
const checkSession = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/check-session', {
      method: 'GET',
      credentials: 'include',
    });
    const data = await response.json();
    return data.isLoggedIn;
  } catch (error) {
    return false;
  }
};

export default checkSession;
