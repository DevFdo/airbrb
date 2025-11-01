import React from 'react';
import NavBar from "../components/NavBar.jsx";

const Home = () => {
    return (
        <>
            <NavBar />
            <div style={{ padding: '2rem' }}>
                <h1>Welcome to Airbrb</h1>
            </div>
        </>
    );
};

export default Home;