import React, { useEffect, useState } from "react";
import { Container, Row, Col , Card , CardBody ,Label ,Input } from "reactstrap";

// Import Breadcrumb
import Breadcrumbs from '../../components/Common/Breadcrumb';

// Import Components
import MiniWidgets from "./MiniWidgets";
import RevenueAnalytics from "./RevenueAnalytics";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { Draggable } from "@fullcalendar/interaction";
import BootstrapTheme from "@fullcalendar/bootstrap";

import { API_BASE_URL, getToken, getCompanyId , RoleId} from '../ApiConfig/ApiConfig';
import  { CustomFetch } from '../ApiConfig/CustomFetch';
import { useForm, Controller } from 'react-hook-form';

const CompanyDashboard = () => {
    const [breadcrumbItems] = useState([
        { title: "GLANSA SLMS", link: "/" },
        { title: "Dashboard", link: "#" },
    ]);

    const token = getToken();
    const companyId = getCompanyId();
    const roleId = RoleId();
    const [company_id, setCompanyId] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState('');

    const [reports , setReports] = useState([
            { icon : "fas fa-users", title : "Total Active Members", value : "0", desc : "From previous period" },
            // { icon : "ri-briefcase-4-line", title : "Total Collections", value : "$ 38452", rate : "2.4%", desc : "From previous period" },
            // { icon : "ri-briefcase-4-line", title : "Total Monthly Savings", value : "$ 15.4", rate : "2.4%", desc : "From previous period" },
            { icon : "ri-briefcase-4-line", title : "Today Saving Collections", value : "₹ 0", desc : "From previous period" },
            { icon : "ri-briefcase-4-line", title : "Today Loan Collections", value : "₹ 0", desc : "From previous period" },
            { icon : "ri-briefcase-4-line", title : "Today Form Sale Collections", value : "₹ 0", desc : "From previous period" },
            // { icon : "ri-briefcase-4-line", title : "Today Late Fee Collections", value : "₹ 0",  desc : "From previous period" },
    ]);

    useEffect(() => {
        const savedCompanyId = localStorage.getItem('selectedCompanyId');
        if (savedCompanyId) {
            setSelectedCompany(savedCompanyId);
        }
    }, []);

    
    useEffect(() =>{

            const loadData = async () => {
                try {
                    const res = await CustomFetch(`/dashboard`);
                    const data = await res.json();
                     setReports([
                {
                    icon: "fas fa-users",
                    title: "Total Active Members",
                    value: data.total_members.toString(),
                    desc: "/members"
                },
                {
                    icon: "ri-briefcase-4-line",
                    title: "Today Saving Collections",
                    value: `₹ ${data.monthly_savings}`,
                    desc: "#"
                },
                {
                    icon: "ri-briefcase-4-line",
                    title: "Today Loan Collections",
                    value: `₹ ${data.loan_repayment}`,
                    desc: "#"
                },
                {
                    icon: "ri-briefcase-4-line",
                    title: "Today Form Sale Collections",
                    value: `₹ ${data.form_sales}`,
                    desc: "#"
                },
                {
                    icon: "ri-briefcase-4-line",
                    title: "Today Admission Fee ",
                    value: `₹ ${data.admission_fee}`,
                    desc: "#"
                },
                 {
                    icon: "ri-briefcase-4-line",
                    title: "Today Late Fee Collections",
                    value: `₹ ${data.late_fee}`,
                    desc: "#"
                },
            ]);
                } catch (err) {
                    console.error('Error loading user data:', err);
                }
            };

    loadData();

    }, []);

    

    
        useEffect(() => {
          const fetchCompanys = async () => {
            try {
              const response = await CustomFetch(`/auth/companys`);
              const data = await response.json();
              setCompanyId(data);
              console.log("Fetched Payments Data:", data);
      
            } catch (err) {
              console.error("Error fetching payments:", err);
            }
          };
      
          fetchCompanys();
        }, []);

        const handler = (e) => {
          const { name, value } = e.target;
          setSelectedCompany(value);
          localStorage.setItem('selectedCompanyId', value);
          CustomFetch('/switch-company', 
            {
              method: 'POST',
              body: JSON.stringify({ company_id: value }),
            }
          )
            .then(() => {
              window.location.reload();
            });
        };


    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    {roleId == 1 && (
                        <Col xl={12}>
                        <div className="auth-form-group-custom mb-4 companydrop">
                          <i className="ri-user-2-line auti-custom-input-icon"></i>
                          <Label htmlFor="username">Company</Label>
                           <Input
                                type="select"
                                id="company_id"
                                placeholder="Enter Company Name"
                                className={`form-control`}
                                onChange={handler}
                                value={selectedCompany}
                              >
                                <option value="">---Select Company Name---</option>
                                {company_id.map((company) => (
                                  <option key={company.company_id} value={company.company_id}>
                                    {company.name}
                                  </option>
                                ))}
                              </Input>
                        </div> 
                        </Col>
                        )}

                    <Breadcrumbs title="Dashboard" breadcrumbItems={breadcrumbItems} />
                    
                    <Row>
                        
                        <Col xl={8}>
                            <Row>
                                <MiniWidgets reports={reports} />
                            </Row>
                            <RevenueAnalytics />
                        </Col>

                        <Col xl={4}>
                            <Card className="mb-0">
                                <CardBody>
                                    <FullCalendar
                                        plugins={[
                                            BootstrapTheme,
                                            dayGridPlugin,
                                            interactionPlugin,
                                            ]}
                                            headerToolbar={{
                                            left: "prev",
                                            center: "title",
                                            right: "next",
                                            }}
                                            slotDuration={"00:15:00"}
                                            handleWindowResize={true}
                                            themeSystem="bootstrap"
                                    />
                                </CardBody>
                            </Card>

                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default CompanyDashboard;
