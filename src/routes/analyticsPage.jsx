import { useEffect, useState } from "react";
import { useCommunication } from "../context/data";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "../styles/analyticsPage.css";

// Registering necessary Chart.js components
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, BarElement);

function AnalyticsPage() {
  const { state } = useCommunication();
  const [analyticsData, setAnalyticsData] = useState({
    totalCompanies: 0,
    totalCommunications: 0,
    overdueCommunications: 0,
    nextScheduledCommunications: 0,
  });

  useEffect(() => {
    const totalCompanies = state.companies.length;
    const totalCommunications = state.communications.length;
    const overdueCommunications = state.companies.filter((company) => {
      if (!company.lastCommunicationDate) return true;
      const daysSinceLastCom =
        (new Date().getTime() - new Date(company.lastCommunicationDate).getTime()) /
        (1000 * 60 * 60 * 24);
      return daysSinceLastCom > (company.communicationPeriodicity || 14);
    }).length;
    const nextScheduledCommunications = state.companies.filter((company) => {
      const nextCommunication = company.lastCommunicationSequence + 1;
      return nextCommunication <= state.communicationMethods.length;
    }).length;

    setAnalyticsData({
      totalCompanies,
      totalCommunications,
      overdueCommunications,
      nextScheduledCommunications,
    });
  }, [state]);

  // Data for Bar Chart
  const barData = {
    labels: ["Total Companies", "Total Communications", "Overdue Communications", "Next Scheduled"],
    datasets: [
      {
        label: "Count",
        data: [
          analyticsData.totalCompanies,
          analyticsData.totalCommunications,
          analyticsData.overdueCommunications,
          analyticsData.nextScheduledCommunications,
        ],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  // Data for Pie Chart
  const pieData = {
    labels: [
      "Overdue Communications",
      "Next Scheduled Communications",
    ],
    datasets: [
      {
        label: "Communications",
        data: [
          analyticsData.overdueCommunications,
          analyticsData.nextScheduledCommunications,
        ],
        backgroundColor: ["#FF6384", "#36A2EB"],
      },
    ],
  };

  // Exporting Data to CSV
  const csvData = [
    ["Total Companies", "Total Communications", "Overdue Communications", "Next Scheduled Communications"],
    [analyticsData.totalCompanies, analyticsData.totalCommunications, analyticsData.overdueCommunications, analyticsData.nextScheduledCommunications],
  ];

  // Exporting Data to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Analytics Data", 14, 16);
    autoTable(doc, {
      head: [["Metric", "Value"]],
      body: [
        ["Total Companies", analyticsData.totalCompanies],
        ["Total Communications", analyticsData.totalCommunications],
        ["Overdue Communications", analyticsData.overdueCommunications],
        ["Next Scheduled Communications", analyticsData.nextScheduledCommunications],
      ],
    });
    doc.save("analytics_data.pdf");
  };

  return (
    <div className="analytics-container">
      {/* Export Buttons Section - Aligned to the right */}
      <div className="export-buttons-container">
        <div className="export-buttons">
          <CSVLink data={csvData} filename="analytics_data.csv">
            <button className="export-btn">Export as CSV</button>
          </CSVLink>
          <button className="export-btn" onClick={exportToPDF}>Export as PDF</button>
        </div>
      </div>

      {/* Analytics Cards Section */}
      <div className="analytics-cards">
        <div className="analytics-card">
          <h2>Total Companies</h2>
          <p>{analyticsData.totalCompanies}</p>
        </div>
        <div className="analytics-card">
          <h2>Total Communications</h2>
          <p>{analyticsData.totalCommunications}</p>
        </div>
        <div className="analytics-card">
          <h2>Overdue Communications</h2>
          <p>{analyticsData.overdueCommunications}</p>
        </div>
        <div className="analytics-card">
          <h2>Next Scheduled Communications</h2>
          <p>{analyticsData.nextScheduledCommunications}</p>
        </div>
      </div>

      {/* Charts Section - Horizontal layout with smaller card views */}
      <div className="charts-container">
        {/* Bar Chart */}
        <div className="chart-card">
          <h2>Analytics Overview (Bar Chart)</h2>
          <Bar data={barData} />
        </div>

        {/* Pie Chart */}
        <div className="chart-card">
          <h2>Communications Status (Pie Chart)</h2>
          <Pie data={pieData} />
        </div>
      </div>
    </div>
  );
}

export default AnalyticsPage;
