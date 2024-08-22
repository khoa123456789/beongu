import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { apiGetOne } from './userService';

export const useFetchDonVangThi = () => {
    const [donVangThiData, setDonVangThiData] = useState([]);
    const [loadings, setLoadings] = useState(true);
    const [errors, setErrors] = useState(null);
    const { token } = useSelector(state => state.auth);

    useEffect(() => {
        const fetchDonVangThi = async () => {
            try {
                // Fetch user data first
                const userResponse = await apiGetOne(token);
                if (userResponse?.data?.err === 0) {
                    const userId = userResponse.data.response?.id;
                    if (userId) {
                        // Fetch lich thi data by userId
                        const response = await axios.get(`http://localhost:8345/api/donvangthi/getDonVangThiByUserId/${userId}`);
                        if (response.status === 200) {
                            setDonVangThiData(response.data.elements.donVangThi || []);
                        } else {
                            setErrors('Failed to fetch lich thi data');
                        }
                    } else {
                        setErrors('User ID not found');
                    }
                } else {
                    setErrors('Failed to fetch user data');
                }
            } catch (err) {
                setErrors(err.message);
            } finally {
                setLoadings(false);
            }
        };

        fetchDonVangThi();
    }, [token]);

    return { donVangThiData, loadings, errors };
};

export const createDonVangThi = async (donVangThi) => {
    try {
        const response = await axios.post(`http://localhost:8345/api/donVangThi/createDonVangThi`, donVangThi);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Error creating Don Vang Thi');
    }
};
export const updateDonVangThi = async (data) => {
    try {
        const response = await axios.patch('http://localhost:8345/api/donVangThi/updateDonVangThi', data, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Error updating Don Vang Thi');
    }
};
export const uploadMinhChung = async (formData) => {
    try {
        const response = await axios.post('http://localhost:8345/api/donVangThi/uploadMinhChung', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Error updating Don Vang Thi');
    }
};