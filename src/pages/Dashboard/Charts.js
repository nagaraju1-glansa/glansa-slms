import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { API_BASE_URL, getToken, getCompanyId } from "../ApiConfig/ApiConfig";
import { CustomFetch } from "../ApiConfig/CustomFetch";

const RevenueAnalyticsChart = () => {
  const [currentYearData, setCurrentYearData] = useState();
  const [previousYearData, setPreviousYearData] = useState();
  const currentYear = new Date().getFullYear();
  const previousYear = currentYear - 1;

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await CustomFetch(`/savingreportmonthly`);
        const data = await res.json();
        const yearData = {
          [currentYear]: new Array(12).fill(0),
          [previousYear]: new Array(12).fill(0),
        };
        data.forEach((item) => {
          const monthIndex = item.month - 1;
          if (yearData[item.year]) {
            yearData[item.year][monthIndex] = item.total_amount;
          }
        });
        setCurrentYearData(yearData[currentYear]);
        setPreviousYearData(yearData[previousYear]);
      } catch (err) {
        console.log(err, "Error found");
      }
    };
    loadData();

  }, []);

  const series = [
    {
      name: currentYear,
      type: "column",
      data: currentYearData,
    },
    {
      name: previousYear,
      type: "line",
      data: previousYearData,
    },
  ];

  const options = {
    chart: {
      toolbar: {
        show: false,
      },
    },
    stroke: {
      width: [0, 3],
      curve: "smooth",
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "20%",
      },
    },
    dataLabels: {
      enabled: false,
    },

    legend: {
      show: false,
    },
    colors: ["#5664d2", "#1cbb8c"],
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
  };

  return (
    <React.Fragment>
      <ReactApexChart
        options={options}
        series={series}
        type="line"
        height={280}
      />
    </React.Fragment>
  );
};

const SpakChart1 = () => {
  const series = [
    {
      data: [23, 32, 27, 38, 27, 32, 27, 34, 26, 31, 28],
    },
  ];
  const options = {
    chart: {
      type: "line",
      width: 80,
      height: 35,
      sparkline: {
        enabled: true,
      },
    },
    stroke: {
      width: [3],
      curve: "smooth",
    },
    colors: ["#5664d2"],

    tooltip: {
      fixed: {
        enabled: false,
      },
      x: {
        show: false,
      },
      y: {
        title: {
          formatter: function (seriesName) {
            return "";
          },
        },
      },
      marker: {
        show: false,
      },
    },
  };

  return (
    <React.Fragment>
      <ReactApexChart
        options={options}
        series={series}
        type="line"
        height={35}
        width={80}
      />
    </React.Fragment>
  );
};

const SpakChart2 = () => {
  const series = [
    {
      data: [24, 62, 42, 84, 63, 25, 44, 46, 54, 28, 54],
    },
  ];

  const options = {
    chart: {
      type: "line",
      width: 80,
      height: 35,
      sparkline: {
        enabled: true,
      },
    },
    stroke: {
      width: [3],
      curve: "smooth",
    },
    colors: ["#5664d2"],
    tooltip: {
      fixed: {
        enabled: false,
      },
      x: {
        show: false,
      },
      y: {
        title: {
          formatter: function (seriesName) {
            return "";
          },
        },
      },
      marker: {
        show: false,
      },
    },
  };

  return (
    <React.Fragment>
      <ReactApexChart
        options={options}
        series={series}
        type="line"
        height={35}
        width={80}
      />
    </React.Fragment>
  );
};

const SpakChart3 = () => {
  const series = [
    {
      data: [42, 31, 42, 34, 46, 38, 44, 36, 42, 32, 54],
    },
  ];

  const options = {
    chart: {
      type: "line",
      width: 80,
      height: 35,
      sparkline: {
        enabled: true,
      },
    },
    stroke: {
      width: [3],
      curve: "smooth",
    },
    colors: ["#5664d2"],
    tooltip: {
      fixed: {
        enabled: false,
      },
      x: {
        show: false,
      },
      y: {
        title: {
          formatter: function (seriesName) {
            return "";
          },
        },
      },
      marker: {
        show: false,
      },
    },
  };

  return (
    <React.Fragment>
      <ReactApexChart
        options={options}
        series={series}
        type="line"
        height={35}
        width={80}
      />
    </React.Fragment>
  );
};

export { SpakChart1, SpakChart2, SpakChart3, RevenueAnalyticsChart };
