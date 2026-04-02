const loginTest = async () => {
    try {
        const response = await fetch('http://localhost:5001/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'trustinprogress24@gmail.com', password: 'password' }) // Trying a random password
        });
        const data = await response.json();
        console.log(`Status: ${response.status}`);
        console.log(`Response:`, data);
    } catch (e) {
        console.error(e);
    }
};

loginTest();
