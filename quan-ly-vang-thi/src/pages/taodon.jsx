import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { apiGetOne } from '../api/userService';
import './taodon.css';
import { useFetchLichThi, updateMultipleLichThi } from '../api/lichthiService';
import Table from '../components/table/Table';
import { createDonVangThi, updateDonVangThi, uploadMinhChung } from '../api/donvangthiService';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useNavigate} from 'react-router-dom'


const TableHead = [
    'Tên Học Phần',
    'Giảng Viên',
    'Số Tín Chỉ',
    'Ngày Thi',
    'Phòng Thi',
    'Chọn'
];

const renderHead = (item, index) => <th key={index}>{item}</th>;

const Taodon = () => {
    const { isLoggedIn, token } = useSelector(state => state.auth);
    const [userData, setUserData] = useState({});
    const [selectedItems, setSelectedItems] = useState([]);
    const [reason, setReason] = useState('');
    const { lichThiData, loading, error } = useFetchLichThi();
    const [uploadedFiles, setUploadedFiles] = useState([]);
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

    const rearrangeName = (fullName) => {
        if (!fullName) return '';
        const nameParts = fullName.split(' ');
        const firstName = nameParts.shift();
        nameParts.push(firstName);
        return nameParts.join(' ');
    };

    const handleCheckboxChange = (e, itemId) => {
        if (e.target.checked) {
            setSelectedItems([...selectedItems, itemId]);
            console.log(new Date())

        } else {
            setSelectedItems(selectedItems.filter(id => id !== itemId));
        }
    };

    const handleReasonChange = (e) => {
        setReason(e.target.value);
    };

    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);
        setUploadedFiles(prevFiles => [...prevFiles, ...files]);
    }
    const handleRemoveFile = (index) => {
        setUploadedFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        try {
            const donVangThi = {
                USER_ID: userData.id,
                NGAY_GUI: new Date().toISOString().split('T')[0]
            };

            const response = await createDonVangThi(donVangThi);
            if (response.status === 200) {
                const donVangThiId = response.elements.id;

                // Dữ liệu cập nhật cho tất cả các ID

                // Cập nhật tất cả các lịch thi được chọn với cùng dữ liệu
                await updateMultipleLichThi(selectedItems, donVangThiId);
                toast.success('Xác nhận thành công!');

            } else {
                console.error('Lỗi khi tạo đơn vắng thi:', response.message);
            }
        } catch (error) {
            console.error('Lỗi khi xử lý đơn vắng thi:', error.message);
        }
    };
    const handleSubmit2 = async () => {
        try {
            if (!userData.id) {
                toast.error('User ID không hợp lệ!');
                return;
            }
            
            // Tạo một object chứa dữ liệu JSON
            const data = {
                USER_ID: userData.id,
                LY_DO_VANG_THI: reason
            };
    
            // Tạo đối tượng FormData để chứa các file
            const formData = new FormData();
            formData.append('USER_ID', userData.id)
            uploadedFiles.forEach(file => {
                formData.append('minhChungFile', file);
            });
    
            // Gửi yêu cầu cập nhật bằng JSON
            const response = await updateDonVangThi(data);
            
            // Gửi yêu cầu tải lên minh chứng
            const response2 = await uploadMinhChung(formData);
    
            if (response.status === 200) {
                toast.success('Tạo đơn thành công!');
                navigate('/dondagui');
            } else {
                toast.error('Lỗi khi cập nhật!');
            }
        } catch (error) {
            console.error('Lỗi khi cập nhật:', error.message);
            toast.error('Có lỗi xảy ra!');
        }
    };
    
    const renderBody = (item, index) => (
        <tr key={index}>
            <td>{item.TEN_HOC_PHAN}</td>
            <td>{item.GIANG_VIEN}</td>
            <td>{item.SO_TIN_CHI}</td>
            <td>{new Date(item.NGAY_THI).toLocaleDateString('vi-VN')}</td>
            <td>{item.PHONG_THI}</td>
            <td>
                <input
                    type="checkbox"
                    id={`checkbox-${index}`}
                    value={item.id}
                    onChange={(e) => handleCheckboxChange(e, item.id)}
                />
            </td>
        </tr>
    );

    return (
        <div>
            <h2 className="page-header">XIN VẮNG THI</h2>
            <div className="info-row">
                <h2>Họ và Tên: {rearrangeName(userData?.FULLNAME?.toUpperCase())}</h2>
                <h2>MSV: {userData?.MSV?.toUpperCase()}</h2>
                <h2>SĐT: {userData?.PHONE?.toUpperCase()}</h2>
            </div>
            <div className="info-row spacing-large">
                <h2>Chọn Học Phần Xin Vắng Thi:</h2>
            </div>
            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="card__body">
                            <Table
                                limit='10'
                                headData={TableHead}
                                renderHead={(item, index) => renderHead(item, index)}
                                bodyData={lichThiData}
                                renderBody={(item, index) => renderBody(item, index)}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="button-container">
                <button onClick={handleSubmit}>Xác nhận học phần xin vắng thi</button>
            </div>
            <ToastContainer />
            <div className="info-row spacing-large">
                <h2>Lý do xin vắng thi</h2>
                <textarea
                    value={reason}
                    onChange={handleReasonChange}
                    placeholder="Nhập lý do xin vắng thi"
                    rows="4"
                    cols="50"
                />
            </div>
            <div>
                <h2>Minh chứng (Chỉ nhận file .jpg và .png):</h2>
                <input
                    type="file"
                    onChange={handleFileChange}
                    accept=".jpg,.png"
                    multiple
                />
                <div className="uploaded-files">
                <ul>
                    {uploadedFiles.map((file, index) => (
                        <li key={index}>
                            {file.name}
                            <button onClick={() => handleRemoveFile(index)}>Xóa</button>
                        </li>
                    ))}
                </ul>
                </div>
            </div>
            <div className="button-container">
                <button onClick={handleSubmit2}>Tạo đơn</button>
            </div>
        </div>
    );
}

export default Taodon;
