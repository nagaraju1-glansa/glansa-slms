// MemberDashboard.jsx
import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, CardBody } from "reactstrap";
import Breadcrumbs from '../../components/Common/Breadcrumb';
import { CustomFetch } from '../ApiConfig/CustomFetch';

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { Draggable } from "@fullcalendar/interaction";
import BootstrapTheme from "@fullcalendar/bootstrap";
import { Link, useNavigate } from 'react-router-dom';
import GlansaRevenueAnalytics from "./GlansaRevenueAnalytics";

const GlansaDashboard = () => {
  const [breadcrumbItems] = React.useState([
    { title: "GLANSA SLMS", link: "/" },
    { title: "Dashboard", link: "#" },
  ]);
  const [branches, setBranches] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const loadbranches = async () => {
      try {
        const res = await CustomFetch(`/forglansa-allbranches`);
        const data = await res.json();
        setBranches(data.length);
      } catch (error) {
        console.error("Failed to load member stats", error);
      }
    };

    loadbranches();
  }, []);

  return (
     <React.Fragment>
        <div className="page-content">
            <Container fluid>
            <Breadcrumbs title="Glansa Dashboard" breadcrumbItems={breadcrumbItems} />
            <Row className="mb-4">
                {/*  */}
                <Col xl={8}>
                  <Row className="mb-2">
                    <Col md={4}>
                      <Card className="mb-0">
                        <CardBody>
                          <div className="d-flex">
                            <div className="flex-1 overflow-hidden">
                                <p className="text-truncate font-size-14 mb-2">No of Companys</p>
                                <h4 className="mb-0">{branches}</h4>
                            </div>
                            <div className="text-primary">
                                <i className={`fa fa-building font-size-24`}></i>
                              </div>
                            </div>
                      </CardBody>
                    </Card>
                  </Col>
                  <Col md={4}>
                      <Card className="mb-0">
                        <CardBody>
                          <div className="d-flex">
                            <div className="flex-1 overflow-hidden">
                                <p className="text-truncate font-size-14 mb-2">No of Companys</p>
                                <h4 className="mb-0">{branches}</h4>
                            </div>
                            <div className="text-primary">
                                <i className={`fa fa-building font-size-24`}></i>
                              </div>
                            </div>
                      </CardBody>
                    </Card>
                  </Col>
                  </Row>
                  <GlansaRevenueAnalytics />
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

export default GlansaDashboard;
