import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './Don.css'; // Thêm file CSS
import Table from '../components/table/Table';
import { apiGetOne } from '../api/userService';
import { useFetchDonVangThi } from '../api/donvangthiService';
const TableHead = [
    'STT',
    'Tên học phần',
    'Số tín chỉ',
    'Giờ/Ngày thi',
    'Ghi chú',
];

const MauDonXinVangThi = () => {
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
    const handlePrint = () => {
        window.print();
    };
    const handlePrint2 = () => {
        navigate('/')
    };
    const renderHead = (item, index) => <th key={index}>{item}</th>;

    const renderBody = (item, index) => (
        <tr key={index}>
            <td>{index + 1}</td> 
            <td>{item.TEN_HOC_PHAN}</td>
            <td>{item.SO_TIN_CHI}</td>
            <td>{new Date(item.NGAY_THI).toLocaleDateString('vi-VN')}</td>
        </tr>
    );
    const rearrangeName = (fullName) => {
        if (!fullName) return '';
        const nameParts = fullName.split(' ');
        const firstName = nameParts.shift();
        nameParts.push(firstName);
        return nameParts.join(' ');
    };
    return (
        <div className="mau-don-xin-vang-thi">
            <h1>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</h1>
            <h2>Độc lập - Tự do - Hạnh phúc</h2>

            <h3>ĐƠN XIN VẮNG THI</h3>

            <p className="centered-text">Học kỳ: ……. Năm học: 20… - 20…</p>
            <p>Kính gửi:</p>
            <ul>
                <li>Phòng Khảo thí - Đảm bảo chất lượng giáo dục - Trường Đại học CNTT và Truyền thông Việt - Hàn.</li>
                <li>Giảng viên chủ nhiệm</li>
            </ul>

            <p>Em tên là:  ..........{rearrangeName(userData?.FULLNAME?.toUpperCase())}........... Ngày sinh: .................................</p>
            <p>Mã sinh viên:  .............{userData?.MSV?.toUpperCase()}............................ Lớp sinh hoạt: .............................</p>
            <p>Điện thoại liên hệ:....{userData?.PHONE?.toUpperCase()}... Email:…{userData.EMAIL}.......................</p>

            <p>Nay em viết đơn này để xin vắng thi các học phần trong học kỳ …. năm học 20… - 20....</p>
            <p>Lý do: ......{donVangThiData.LY_DO_VANG_THI}................................................................</p>
            <p>....................................................................................</p>

            <h4>Cụ thể học phần xin vắng thi như sau:</h4>
            <div >
                <div >
                    <div >
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

            <p>Em xin hứa sẽ tuân theo mọi quy định chung của nhà trường về việc xin vắng thi cũng như xin thi bổ sung khi có điều kiện.</p>
            <p>Em xin chân thành cảm ơn.</p>

            <div className="signatures">
                <p className='centered-text2'>Đà Nẵng, ngày ...... tháng ...... năm 20.....</p>
                <div className="signature-blocks">
                    <p>DUYỆT CỦA GVCN/KHOA</p>
                    <p>NGƯỜI LÀM ĐƠN</p>
                    
                </div>
                <p className='centered-text2'>(Ký và ghi rõ họ tên)</p>
            </div>
            <button className="no-print" onClick={handlePrint}>In</button>
            <button className="no-print" onClick={handlePrint2}>Quay về</button>
        </div>
    );
}

export default MauDonXinVangThi;
