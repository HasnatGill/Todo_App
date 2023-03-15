import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Typography } from 'antd';
import { analytics } from '../../config/firebase';
import { logEvent } from 'firebase/analytics';

const { Title } = Typography;

const data = [
    { name: 'Jan', uv: 4000, },
    { name: 'Feb', uv: 3000, },
    { name: 'Mar', uv: 2000, },
    { name: 'Apr', uv: 2780, },
    { name: 'May', uv: 1890, },
    { name: 'Jun', uv: 2390, },
    { name: 'Jul', uv: 3490, },
];
// let analytics = getAnalytics();

const handleAnalytics = () => {
    console.log(logEvent(analytics, 'page_view'))
    // console.log('ChartData', chartdata)
}

const AppChart = () => {

    return (
        <div className='px-5 py-4'>
            <div className='container bg-white py-4 px-4'>
                <Title level={2} className="mb-5" onClick={handleAnalytics}>Analytics Chart</Title>
                <LineChart width={500} height={300} data={data}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="pv" stroke="#8884d8" />
                    <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
                </LineChart>
            </div>
        </div>
    );
};

export default AppChart;
