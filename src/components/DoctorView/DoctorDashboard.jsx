import React, { useState, useEffect } from 'react';
import { fetchHistoricalData } from '../../utils/api';
import { downloadHistoricalDataAsCsv } from '../../utils/exportCsv';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import './DoctorDashboard.css';

const DoctorDashboard = ({ username, allTasks }) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPatient, setSelectedPatient] = useState('all');
  const [viewMode, setViewMode] = useState('chart'); // 'chart' or 'table'
  
  // Calculate max CMAS score
  const maxCmasScore = allTasks ? allTasks.reduce((sum, task) => sum + (task.maxPoints || 0), 0) : 53;
  
  // CMAS interpretation categories
  const cmasInterpretation = [
    { range: [0, 19], label: 'Severe impairment', color: '#ef4444' },
    { range: [20, 34], label: 'Moderate impairment', color: '#f97316' },
    { range: [35, 49], label: 'Mild impairment', color: '#facc15' },
    { range: [50, maxCmasScore], label: 'Normal function', color: '#22c55e' }
  ];
  
  // Get color based on CMAS score
  const getScoreColor = (score) => {
    const category = cmasInterpretation.find(
      cat => score >= cat.range[0] && score <= cat.range[1]
    );
    return category ? category.color : '#6b7280';
  };
  
  // Get interpretation based on CMAS score
  const getScoreInterpretation = (score) => {
    const category = cmasInterpretation.find(
      cat => score >= cat.range[0] && score <= cat.range[1]
    );
    return category ? category.label : 'Not categorized';
  };
  
  // Load historical data on component mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const historicalData = await fetchHistoricalData();
        
        // Add interpretation to each data point
        const enhancedData = historicalData.map(item => ({
          ...item,
          interpretation: getScoreInterpretation(item.totalScore),
          scoreColor: getScoreColor(item.totalScore)
        }));
        
        setData(enhancedData);
        setError('');
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load patient data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  // Get unique patient list
  const patientList = React.useMemo(() => {
    if (!data.length) return [];
    const patients = new Set(data.map(item => item.username));
    return ['all', ...patients];
  }, [data]);
  
  // Filter data based on selected patient
  const filteredData = React.useMemo(() => {
    if (selectedPatient === 'all') return data;
    return data.filter(item => item.username === selectedPatient);
  }, [data, selectedPatient]);
  
  // Handle patient selection change
  const handlePatientChange = (e) => {
    setSelectedPatient(e.target.value);
  };
  
  // Handle view mode change
  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };
  
  // Handle CSV export
  const handleExport = () => {
    downloadHistoricalDataAsCsv(filteredData);
  };

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip bg-white p-3 border border-gray-200 rounded shadow-md">
          <p className="font-bold">{label}</p>
          <p className="text-sm">
            Patient: <span className="font-medium">{payload[0].payload.username}</span>
          </p>
          <p className="text-sm">
            Score: <span className="font-medium">{payload[0].value}</span>
          </p>
          <p className="text-sm">
            Status: <span className="font-medium" style={{ color: payload[0].payload.scoreColor }}>
              {payload[0].payload.interpretation}
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="doctor-dashboard bg-white p-6 rounded-lg shadow-lg max-w-5xl w-full mx-auto">
      <div className="dashboard-header mb-6">
        <h2 className="text-2xl font-bold text-blue-800">Doctor Dashboard</h2>
        <p className="text-gray-600">Welcome, Dr. {username}. Here's an overview of your patients' CMAS scores.</p>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="dashboard-controls flex flex-wrap gap-4 mb-6">
        <div className="filter-control">
          <label htmlFor="patient-select" className="block text-sm font-medium text-gray-700 mb-1">
            Select Patient:
          </label>
          <select
            id="patient-select"
            value={selectedPatient}
            onChange={handlePatientChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            {patientList.map(patient => (
              <option key={patient} value={patient}>
                {patient === 'all' ? 'All Patients' : patient}
              </option>
            ))}
          </select>
        </div>
        
        <div className="view-toggle ml-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">View Mode:</label>
          <div className="flex border border-gray-300 rounded-md overflow-hidden">
            <button
              className={`px-3 py-2 text-sm font-medium transition-colors ${
                viewMode === 'chart' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => handleViewModeChange('chart')}
            >
              Chart
            </button>
            <button
              className={`px-3 py-2 text-sm font-medium transition-colors ${
                viewMode === 'table' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => handleViewModeChange('table')}
            >
              Table
            </button>
          </div>
        </div>
        
        <div className="export-control ml-auto">
          <button
            onClick={handleExport}
            disabled={filteredData.length === 0}
            className={`bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition-colors ${
              filteredData.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            Export to CSV
          </button>
        </div>
      </div>
      
      <div className="cmas-interpretation mb-6">
        <h3 className="text-lg font-medium text-gray-700 mb-2">CMAS Score Interpretation</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {cmasInterpretation.map((category, index) => (
            <div 
              key={index} 
              className="interpretation-item p-2 rounded-md"
              style={{ backgroundColor: `${category.color}20`, borderLeft: `4px solid ${category.color}` }}
            >
              <p className="font-medium" style={{ color: category.color }}>{category.label}</p>
              <p className="text-sm text-gray-600">{category.range[0]}-{category.range[1]} points</p>
            </div>
          ))}
        </div>
      </div>
      
      <div className="dashboard-content mb-6">
        {isLoading ? (
          <div className="loading-indicator text-center p-8">
            <p className="text-gray-600">Loading patient data...</p>
            <div className="spinner mt-2"></div>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="empty-state text-center p-8 bg-gray-50 rounded-lg">
            <p className="text-gray-600">No data available for the selected patient.</p>
          </div>
        ) : viewMode === 'chart' ? (
          <div className="chart-container p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-medium text-gray-700 mb-4">CMAS Score Trends</h3>
            <div className="chart-wrapper h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={filteredData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, maxCmasScore]} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="totalScore" 
                    name="CMAS Total Score" 
                    stroke="#3b82f6" 
                    strokeWidth={2} 
                    activeDot={{ r: 8 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            {selectedPatient !== 'all' && (
              <div className="bar-chart-wrapper mt-8 h-80">
                <h3 className="text-lg font-medium text-gray-700 mb-4">Latest CMAS Score Breakdown</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={filteredData.slice(-1)}
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, maxCmasScore]} />
                    <YAxis dataKey="username" type="category" width={100} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="totalScore" fill="#3b82f6">
                      {filteredData.slice(-1).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.scoreColor} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        ) : (
          <div className="table-container p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-medium text-gray-700 mb-4">Patient Data Table</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Patient
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      CMAS Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Interpretation
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredData.map((item, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{item.username}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{item.date}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div 
                          className="text-sm font-medium px-2 py-1 rounded" 
                          style={{ 
                            backgroundColor: `${item.scoreColor}20`,
                            color: item.scoreColor
                          }}
                        >
                          {item.totalScore} / {maxCmasScore}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div 
                          className="text-sm" 
                          style={{ color: item.scoreColor }}
                        >
                          {item.interpretation}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      
      <div className="dashboard-note bg-blue-50 border-l-4 border-blue-500 p-4 mt-8">
        <h4 className="text-blue-800 font-medium">Note to Healthcare Providers:</h4>
        <p className="text-sm text-gray-700 mt-1">
          This dashboard provides a summary of patient CMAS scores. For detailed analysis and 
          clinical decision-making, please refer to the complete patient records in your electronic 
          health record system. The CSV export feature allows for further analysis in specialized software.
        </p>
      </div>
    </div>
  );
};

export default DoctorDashboard;