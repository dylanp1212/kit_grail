'use client'
import React from 'react'; // needed?
import {useEffect, useState} from 'react'
import Box from '@mui/material/Box';
import {OrdersPerDay} from '../orders'
import {getOrdersPerDay} from '../orders/actions'
import {Line} from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function OrdersChart() {
  const [orders, setOrders] = useState<OrdersPerDay[]>([])
  useEffect(() => {
    const getOrders = async (): Promise<void> => {
      const o = await getOrdersPerDay()
      // console.log(o)
      setOrders(o);
    }
    void getOrders();
  }, [])
  const today = new Date()
  // today.setDate(today.getDate() - 10)
  const start = new Date(today)
  start.setDate(today.getDate() - 30)

  const dates = Array.from({length: 31}, (_, i) => {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    return d.toLocaleDateString('en-US', {month: 'short', day: 'numeric'})
  })

  const fullOrders = Array(31).fill(0)
  const sales = Array(31).fill(0)
  start.setHours(0, 0, 0, 0)
  for (let i = 0; i < orders.length; i++) {
    const d = new Date(orders[i].day)
    const diffDays = Math.round((d.getTime() - start.getTime()) / 86400000)
    if (diffDays >= 0 && diffDays <= 30) {
      fullOrders[diffDays] = orders[i].count
      // console.log(orders[i].total)
      sales[diffDays] = orders[i].total
    }
  }
  const ordersData = {
    labels: dates,
    datasets: [
      {
        label: 'Total Orders',
        data: fullOrders,
        borderColor: '#ad6036',
        backgroundColor: '#ad603669',
      },
    ],
  };
  const salesData = {
    labels: dates,
    datasets: [
      {
        label: 'Total Sales ($)',
        data: sales,
        borderColor: '#154212',
        backgroundColor: '#15421269',
      },
    ],
  };

  const ordersOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Daily Orders',
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };
  const salesOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Daily Sales ($)',
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <Box sx={{width: '600px'}}>
      <Line data={ordersData} options={ordersOptions} />
      <Line data={salesData} options={salesOptions} />
    </Box>
  );
}