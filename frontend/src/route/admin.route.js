import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Main from '../component/Main';


function UserRoutes() {
    return (
        <Routes>
            {/* <Route path="/" element={<Home />} /> */}
            <Route path="/" element={<Main />} />

        </Routes>
    );
}

export default UserRoutes;