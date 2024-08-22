import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { apiGetOne } from './userService';
import { useFetchDonVangThi } from './donvangthiService';

export const useFetchLichThi = () => {
    const [lichThiData, setLichThiData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { token } = useSelector(state => state.auth);

    useEffect(() => {
        const fetchLichThi = async () => {
            try {
                // Fetch user data first
                const userResponse = await apiGetOne(token);
                if (userResponse?.data?.err === 0) {
                    const userId = userResponse.data.response?.id;
                    if (userId) {
                        // Fetch lich thi data by userId
                        const lichThiResponse = await axios.get(`http://localhost:8345/api/lichthi/getLichThiByUserId/${userId}`);
                        if (lichThiResponse.status === 200) {
                            setLichThiData(lichThiResponse.data.elements.lichThi || []);
                        } else {
                            setError('Failed to fetch lich thi data');
                        }
                    } else {
                        setError('User ID not found');
                    }
                } else {
                    setError('Failed to fetch user data');
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchLichThi();
    }, [token]);

    return { lichThiData, loading, error };
};

export const updateMultipleLichThi = async (lichThiIds, donVangThiId) => {
    try {
        const response = await axios.patch('http://localhost:8345/api/lichthi/updateMultipleLichThi', {
            ids: lichThiIds,  // Sử dụng 'ids' thay vì 'lichThiIds'
            data: { DONVANGTHI_ID: donVangThiId }  // Sử dụng 'data' chứa thông tin cần cập nhật
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Error updating lich thi');
    }
};

