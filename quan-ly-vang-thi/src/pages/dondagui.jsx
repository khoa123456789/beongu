import React, { useState, useEffect } from 'react'
import { useFetchDonVangThi } from '../api/donvangthiService'
import Table from '../components/table/Table';
import { useNavigate } from 'react-router-dom';
import { apiGetOne } from '../api/userService';
import { useSelector } from 'react-redux';
import './dondagui.css'


const TableHead = [
    'Tên Học Phần',
    'Giảng Viên',
    'Số Tín Chỉ',
    'Ngày Thi',
    'Phòng Thi',
];

const Dondagui = () => {
    const { donVangThiData, loadings, errors } = useFetchDonVangThi()
    const [lichThiData, setLichThiData] = useState([])
    const { isLoggedIn, token } = useSelector(state => state.auth);
    const [userData, setUserData] = useState({});
    const navigate = useNavigate();


    useEffect(() => {
        const fetchUser = async () => {
            let response = await apiGetOne(token);
            if (response?.data.err === 0) {
                setUserData(response.data?.response);
            } else {
                setUserData({});
            }
        }
        fetchUser();
    }, [isLoggedIn, token]);

    useEffect(() => {
        // Giả sử mảng Lich_This nằm trong phần tử đầu tiên của donVangThiData
        setLichThiData(donVangThiData.Lich_This);

    }, [donVangThiData]);

    const renderHead = (item, index) => <th key={index}>{item}</th>;

    const renderBody = (item, index) => (
        <tr key={index}>
            <td>{item.TEN_HOC_PHAN}</td>
            <td>{item.GIANG_VIEN}</td>
            <td>{item.SO_TIN_CHI}</td>
            <td>{new Date(item.NGAY_THI).toLocaleDateString('vi-VN')}</td>
            <td>{item.PHONG_THI}</td>
        </tr>
    );
    const rearrangeName = (fullName) => {
        if (!fullName) return '';
        const nameParts = fullName.split(' ');
        const firstName = nameParts.shift();
        nameParts.push(firstName);
        return nameParts.join(' ');
    };
    const getTrangThaiColor = (trangThai) => {
        switch (trangThai) {
            case 'Chờ Duyệt':
                return '#1E90FF'; // Màu xanh nước biển
            case 'Được Duyệt':
                return '#28A745'; // Màu xanh lá cây
            case 'Không Được Duyệt':
                return '#DC3545'; // Màu đỏ
            default:
                return '#333'; // Màu mặc định
        }
    };
    const evenButton = () => {
        navigate('/don')

    }


    return (
        <div>
            <h2 className="page-header" style={{ color: getTrangThaiColor(donVangThiData.TRANG_THAI) }}>
                TRẠNG THÁI ĐƠN: {donVangThiData.TRANG_THAI}
            </h2>
            <div className="info-row">
                <h1>I. THÔNG TIN SINH VIÊN:</h1>
            </div>

            <div className="info-row">
                <h2>Họ và Tên: {rearrangeName(userData?.FULLNAME?.toUpperCase())}</h2>
                <h2>MSV: {userData?.MSV?.toUpperCase()}</h2>
                <h2>SĐT: {userData?.PHONE?.toUpperCase()}</h2>
            </div>
            <div className="info-row">
                <h1>II. THÔNG TIN ĐƠN:</h1>
            </div>
            <div className="info-row">
                <h2 >Ngày Gửi: {new Date(donVangThiData.NGAY_GUI).toLocaleDateString('vi-VN')}</h2>
            </div>
            <div className="info-row">
                <h2 >Học Phần Xin Vắng Thi:</h2>
            </div>
            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="card__body">
                            <Table
                                headData={TableHead}
                                limit='10'
                                renderHead={(item, index) => renderHead(item, index)}
                                bodyData={lichThiData}
                                renderBody={(item, index) => renderBody(item, index)}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="info-row">
                <h2 className='dondagui'>Lý Do: {donVangThiData.LY_DO_VANG_THI} </h2>
            </div>
            <div className="info-row">
                <h2 className='dondagui'>Minh Chứng:</h2>
            </div>
            <img src={donVangThiData.MINH_CHUNG} alt="Minh chứng" style={{ width: '100px', height: 'auto' }} />
            <div className='button-container'>
                <button onClick={evenButton}>Xuất Đơn</button>
            </div>


        </div>
    )
}

export default Dondagui

