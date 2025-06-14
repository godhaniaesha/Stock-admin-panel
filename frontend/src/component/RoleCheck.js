import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { db_fetchUserById } from '../redux/slice/userSlice';

const RoleCheck = ({ allowedRoles, children }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [hasAccess, setHasAccess] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        const checkUserRole = async () => {
            try {
                const userId = localStorage.getItem('user');
                if (!userId) {
                    setHasAccess(false);
                    setIsLoading(false);
                    return;
                }

                const result = await dispatch(db_fetchUserById(userId)).unwrap();
                if (result && result.role && allowedRoles.includes(result.role)) {
                    setHasAccess(true);
                } else {
                    setHasAccess(false);
                }
            } catch (error) {
                console.error('Error checking user role:', error);
                setHasAccess(false);
            } finally {
                setIsLoading(false);
            }
        };

        checkUserRole();
    }, [dispatch, allowedRoles]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!hasAccess) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default RoleCheck; 