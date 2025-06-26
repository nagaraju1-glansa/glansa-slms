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

const MemberDashboard = () => {
  const [breadcrumbItems] = React.useState([
    { title: "GLANSA SLMS", link: "/" },
    { title: "Dashboard", link: "#" },
  ]);

  const [memberStats, setMemberStats] = useState({
    totalSaving: 0,
    totalLoanPending: 0,
  });

  const navigate = useNavigate();

  useEffect(() => {
    const loadMemberStats = async () => {
      try {
        const mencpt = localStorage.getItem('mencpt');
        const res = await CustomFetch(`/members/${mencpt}`);
        const data = await res.json();
        console.log(data);
        setMemberStats({
          totalSaving: (Number(data.member.totalsavings)).toFixed(2) || 0,
          totalLoanPending: (Number(data.member.loanpending)).toFixed(2) || 0,
          image: data.member.image,
          name: data.member.name,
          phone: data.member.mobile1,
          id: data.member.m_no
        });
      } catch (error) {
        console.error("Failed to load member stats", error);
      }
    };

    loadMemberStats();
  }, []);

  return (
     <React.Fragment>
        <div className="page-content">
            <Container fluid>
            <Breadcrumbs title="Member Dashboard" breadcrumbItems={breadcrumbItems} />
            <Row className="mb-4">
                <Col md={4}>
                    <Card>
                        <CardBody>
                            <div className="d-flex">
                                <div className="flex-2 overflow-hidden">
                                    <img
                                        src={memberStats.image ? `${process.env.REACT_APP_APIURL_IMAGE}members/${memberStats.image}` : ""}
                                        alt="profile"
                                        className="rounded-circle img-fluid mb-3"
                                        style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                                        onError={e => {
                                            e.target.onerror = null;
                                            e.target.src = `${process.env.REACT_APP_APIURL_IMAGE}user.jpg`;
                                        }}
                                        />

                                   {/* <img
                                    src={
                                        memberStats.image
                                        ? `${process.env.REACT_APP_APIURL}storage/uploads/${memberStats.image}`
                                        : "https://i.pravatar.cc/150?img=5"
                                    }
                                    alt="profile"
                                    className="rounded-circle img-fluid mb-3"
                                    style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                                    onError={e => {
                                        e.target.onerror = null;
                                        e.target.src = "https://i.pravatar.cc/150?img=5";
                                    }}
                                    /> */}
                                     
                                </div>
                                <div className="text-primary p-3">
                                    <h4 className="text-truncate font-size-14 mb-2">{memberStats.name}</h4>
                                    <p className="mb-0">Phone: {memberStats.phone}</p>   
                                    <p className="mb-0">Member MNO: {memberStats.id}</p>
                                    <button className="btn btn-primary mt-2"  onClick={()=> navigate(`/memberview/${localStorage.getItem('mencpt')}`) }>View Profile</button>
                                </div>     
                            </div>
                        </CardBody>
                    </Card>
                </Col>
                <Col md={4}>
                <Card>
                   <CardBody>
                        <div className="d-flex">
                            <div className="flex-1 overflow-hidden">
                                <p className="text-truncate font-size-14 mb-2">Total Savings</p>
                                <h4 className="mb-0">{memberStats.totalSaving}</h4>
                            </div>
                            <div className="text-primary">
                                <i className="ri-wallet-2-line font-size-24"></i>
                            </div>     
                        </div>
                    </CardBody>
                </Card>

                <Card>
                    <CardBody>
                        <div className="d-flex">
                            <div className="flex-1 overflow-hidden">
                                <p className="text-truncate font-size-14 mb-2">Loan Pending</p>
                                <h4 className="mb-0">{memberStats.totalLoanPending}</h4>
                            </div>
                            <div className="text-primary">
                                <i className="ri-wallet-2-line font-size-24"></i>
                            </div>     
                        </div>
                    </CardBody>
                </Card>
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

export default MemberDashboard;
