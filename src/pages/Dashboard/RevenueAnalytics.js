import React, { Component , useState , useEffect } from 'react';
import { Row, Col, Card, CardBody, ButtonGroup, Button } from 'reactstrap';

//Import Charts
import { RevenueAnalyticsChart } from './Charts'
import "./dashboard.scss";
import { CustomFetch } from '../ApiConfig/CustomFetch';

const RevenueAnalytics = () => {
    const [currentYearData , setCurrentYearData] = useState();
    const [previousYearData , setPreviousYearData] = useState();
    const currentYear = new Date().getFullYear();
    const previousYear = currentYear - 1;
    
    useEffect(() => {
        const loadData = async () => {
                        try {
                            const res = await CustomFetch(`/savingreportmonthly`);
                            const data = await res.json();
                            const yearData = {
                            [currentYear]: new Array(1).fill(0),
                            [previousYear]: new Array(1).fill(0)
                            };
                            data.forEach(item => {
                                const monthIndex = item.month - 1;
                                if (yearData[item.year]) {
                                yearData[item.year][monthIndex] = item.total_amount;
                                }
                            });

                           const currentTotal = yearData[currentYear].reduce((sum, val) => sum + parseFloat(val), 0);
                            const previousTotal = yearData[previousYear].reduce((sum, val) => sum + parseFloat(val), 0);

                            setCurrentYearData(currentTotal);
                            setPreviousYearData(previousTotal);
                        }
                        catch (err) {
                            console.log(err, "Error found");
                        }
                    };
            loadData();
            // fetch(`${API_BASE_URL}/savingreportmonthly`,{
            // headers: {
            //     'Authorization': `Bearer ${token}`,
            //     'Content-Type': 'application/json',
            //     'Accept': 'application/json',
            // }
            // })
            //     .then(res => res.json())
            //     .then(data => {
            //     const yearData = {
            //         [currentYear]: new Array(1).fill(0),
            //         [previousYear]: new Array(1).fill(0)
            //     };
            //     data.forEach(item => {
            //         const monthIndex = item.month - 1;
            //         if (yearData[item.year]) {
            //          yearData[item.year][monthIndex] = item.total_amount;
            //         }
            //     });

            //     const currentTotal = yearData[currentYear].reduce((sum, val) => sum + val, 0);
            //     const previousTotal = yearData[previousYear].reduce((sum, val) => sum + val, 0);

            //     setCurrentYearData(currentTotal);
            //     setPreviousYearData(previousTotal);
            //     })
            //     .catch(error => console.error('Fetch error:', error));
            }, []);

        return (
            <React.Fragment>
                <Card>
                    <CardBody>
                        <h4 className="card-title mb-2">Monthly Wise Saving Collections</h4>
                        <div id="line-column-chart" className="apex-charts" dir="ltr">
                            <RevenueAnalyticsChart />
                        </div>  
                    </CardBody>

                    <CardBody className="border-top text-center">
                        <Row>
                            <Col sm={6}>
                                <div className="d-inline-flex">
                                    <h5 className="me-2">₹ {previousYearData}</h5>
                                    
                                </div>
                                <p className="text-muted text-truncate mb-0"> <i className="mdi mdi-circle text-success font-size-10 me-1"></i> Previous Year</p>
                            </Col>

                            <Col sm={6}>
                                <div className="mt-4 mt-sm-0">
                                    <div className="d-inline-flex">
                                        <h5 className="mb-0 me-2">₹ {currentYearData}</h5>
                                    </div>
                                    <p className="mb-2 text-muted text-truncate"><i className="mdi mdi-circle text-primary font-size-10 me-1"></i> This Year </p>
                                </div>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </React.Fragment>
        );
}

export default RevenueAnalytics;