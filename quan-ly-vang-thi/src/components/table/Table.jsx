import React, { useState, useEffect } from 'react';
import './table.css';

const Table = (props) => {
    // Đảm bảo props.bodyData là một mảng
    const bodyDataArray = Array.isArray(props.bodyData) ? props.bodyData : [];

    // Tính toán dữ liệu hiển thị
    const initDataShow = props.limit ? bodyDataArray.slice(0, Number(props.limit)) : bodyDataArray;

    const [dataShow, setDataShow] = useState(initDataShow);

    let pages = 1;
    let range = [];

    if (props.limit !== undefined) {
        let page = Math.floor(bodyDataArray.length / Number(props.limit));
        pages = bodyDataArray.length % Number(props.limit) === 0 ? page : page + 1;
        range = [...Array(pages).keys()];
    }

    const [currPage, setCurrPage] = useState(0);

    const selectPage = (page) => {
        const start = Number(props.limit) * page;
        const end = start + Number(props.limit);

        setDataShow(bodyDataArray.slice(start, end));
        setCurrPage(page);
    };

    useEffect(() => {
        // Cập nhật dữ liệu hiển thị khi props.bodyData hoặc props.limit thay đổi
        if (props.limit && bodyDataArray.length > 0) {
            setDataShow(bodyDataArray.slice(0, Number(props.limit)));
        } else {
            setDataShow(bodyDataArray);
        }
    }, [props.bodyData, props.limit]);

    return (
        <div>
            <div className="table-wrapper">
                <table>
                    {props.headData && props.renderHead ? (
                        <thead>
                            <tr>
                                {props.headData.map((item, index) => props.renderHead(item, index))}
                            </tr>
                        </thead>
                    ) : null}
                    {bodyDataArray && props.renderBody ? (
                        <tbody>
                            {dataShow.map((item, index) => props.renderBody(item, index))}
                        </tbody>
                    ) : null}
                </table>
            </div>
            {pages > 1 ? (
                <div className="table__pagination">
                    {range.map((item, index) => (
                        <div
                            key={index}
                            className={`table__pagination-item ${currPage === index ? 'active' : ''}`}
                            onClick={() => selectPage(index)}
                        >
                            {item + 1}
                        </div>
                    ))}
                </div>
            ) : null}
        </div>
    );
};

export default Table;
