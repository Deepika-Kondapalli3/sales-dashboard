import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ReactECharts from 'echarts-for-react';
import axios from 'axios';
import './Dashboard.css'; // For styling

const Dashboard = () => {
  const [startDate, setStartDate] = useState(new Date('2023-01-01'));
  const [endDate, setEndDate] = useState(new Date());
  const [revenueData, setRevenueData] = useState({ totalRevenue: 0, totalOrders: 0 });
  const [topProducts, setTopProducts] = useState([]);
  const [topCustomers, setTopCustomers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const baseURL = 'http://localhost:5000'; // Change if your backend URL is different

      // Fetch Revenue & Orders
      const revRes = await axios.get(
        `${baseURL}/api/analytics/revenue-orders?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
      );
      console.log('Revenue API response:', revRes.data);

      setRevenueData({
        totalRevenue: Number(revRes.data.totalRevenue) || 0,
        totalOrders: Number(revRes.data.totalOrders) || 0,
      });

      // Fetch Top Products
      const prodRes = await axios.get(
        `${baseURL}/api/analytics/top-products?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
      );
      setTopProducts(prodRes.data);

      // Fetch Top Customers
      const custRes = await axios.get(
        `${baseURL}/api/analytics/top-customers?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
      );
      setTopCustomers(custRes.data);

    } catch (err) {
      console.error('Error fetching data:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate]);

  // Chart options
  const chartOptions = {
  tooltip: {},
  xAxis: { type: 'category', data: ['Revenue', 'Orders'] },
  yAxis: [
    { type: 'value', name: 'Revenue', position: 'left' },
    { type: 'value', name: 'Orders', position: 'right' }
  ],
  series: [
    {
      name: 'Revenue',
      type: 'bar',
      data: [revenueData.totalRevenue, 0],
      yAxisIndex: 0,
      itemStyle: { color: '#4caf50' }
    },
    {
      name: 'Orders',
      type: 'bar',
      data: [0, revenueData.totalOrders],
      yAxisIndex: 1,
      itemStyle: { color: '#2196f3' }
    }
  ],
  legend: { data: ['Revenue', 'Orders'] }
};


  return (
    <div className="dashboard-container">
      <h2>Sales Dashboard</h2>

      <div className="date-picker-container">
        <DatePicker selected={startDate} onChange={date => setStartDate(date)} />
        <DatePicker selected={endDate} onChange={date => setEndDate(date)} />
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <ReactECharts
          key={revenueData.totalRevenue + '-' + revenueData.totalOrders} // force re-render
          option={chartOptions}
          style={{ height: 300 }}
        />
      )}

      <div className="tables-container">
        <div className="table-section">
          <h3>Top Products</h3>
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity Sold</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.length > 0 ? (
                topProducts.map(p => (
                  <tr key={p._id}>
                    <td>{p.name}</td>
                    <td>{p.totalSold}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2">No data available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="table-section">
          <h3>Top Customers</h3>
          <table>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Total Spent</th>
              </tr>
            </thead>
            <tbody>
              {topCustomers.length > 0 ? (
                topCustomers.map(c => (
                  <tr key={c._id}>
                    <td>{c.name}</td>
                    <td>{c.totalSpent}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2">No data available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
