import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Col, Card, CardBody } from 'reactstrap';

const MiniWidgets = ({ reports }) => {
  const navigate = useNavigate();

  return (
    <React.Fragment>
      {reports.map((report, key) => (
        <Col key={key} md={4}>
          <Card>
            <CardBody>
              <div className="d-flex">
                <div className="flex-1 overflow-hidden">
                  <p className="text-truncate font-size-14 mb-2">{report.title}</p>
                  <h4 className="mb-0">{report.value}</h4>
                </div>
                <div className="text-primary">
                  <i className={`${report.icon} font-size-24`}></i>
                </div>
              </div>
            </CardBody>
{/* 
            <CardBody className="border-top py-3">
              <div className="text-truncate">
                <span className="badge bg-success-subtle text-success font-size-11 me-1" onClick={() => navigate(report.desc)}>
                    Know More <i className="mdi mdi-arrow-right"></i>
                </span>
              </div>
            </CardBody> */}
          </Card>
        </Col>
      ))}
    </React.Fragment>
  );
};

export default MiniWidgets;
