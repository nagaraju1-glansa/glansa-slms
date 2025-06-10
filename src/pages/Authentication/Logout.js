import React, { Component } from 'react';
// import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { CustomFetch } from '../ApiConfig/CustomFetch';


const Logout = () => {
    const navigate = useNavigate();
    useEffect(() => {
            try {
                CustomFetch('/logout', {
                    method: 'POST',
                });
                localStorage.removeItem('token');
                navigate('/login');

            } catch (error) {
                console.error('Logout failed:', error);
                navigate('/login');
            }

    }, []);

    return <h1>&nbsp;</h1>;
};

export default Logout;

