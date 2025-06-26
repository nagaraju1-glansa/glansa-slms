import React, { useEffect, useState } from 'react';
import { Row, Col, Input, Button, Container, Label } from "reactstrap";
import { useForm, Controller } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';

import logodark from "../../assets/images/logo-dark.png";
import logolight from "../../assets/images/logo-light.png";
import { API_BASE_URL } from "../ApiConfig/ApiConfig";
import Swal from 'sweetalert2';

import logoWhite from './assets/images/logos/logo-white.png';
import WhiteClose from './assets/images/shapes/white-close.png';
import WhiteDots from './assets/images/shapes/white-dots.png';
import WhiteTringle from './assets/images/shapes/white-tringle.png';
import WhiteCircle from './assets/images/shapes/white-circle.png';
import Circle2 from './assets/images/shapes/circle-two.png';
import Tringle2 from './assets/images/shapes/tringle-two.png';


import Dashboard from "./assets/images/partners/dashboard.jpg";
// import PartnerTwo1 from "./assets/images/partners/partner-two1.png";
// import PartnerTwo2 from "./assets/images/partners/partner-two2.png";
// import PartnerTwo3 from "./assets/images/partners/partner-two3.png";
// import PartnerTwo4 from "./assets/images/partners/partner-two4.png";
// import PartnerTwo5 from "./assets/images/partners/partner-two5.png";
// import PartnerTwo6 from "./assets/images/partners/partner-two6.png";
// import PartnerTwo7 from "./assets/images/partners/partner-two7.png";
import FeatureRight from "./assets/images/features/feature-right.png";
import FeatureLeft from "./assets/images/features/feature-left.png";

import HeroBg from "./assets/images/hero/hero-bg.png";
import CounterBg from "./assets/images/shapes/counter-bg.png";

import Newsletter from "./assets/images/newsletter/newsletter.png";
import NewsletterCircle from "./assets/images/newsletter/circle.png";
import NewsletterDots from "./assets/images/newsletter/dots.png";
import LogoHome from "./assets/images/logo-dark.png";
import LogoHomeWhite from "./assets/images/logo-light.png";
import PartnerTwo1 from "./assets/images/client-logos/tata-150x150.jpg";
import PartnerTwo2 from "./assets/images/client-logos/sweekar-150x150.jpg";
import PartnerTwo3 from "./assets/images/client-logos/siam-organic-150x150.jpg";
import PartnerTwo4 from "./assets/images/client-logos/panjab-bank-150x150.jpg";
import PartnerTwo5 from "./assets/images/client-logos/ministry-of-defence-150x150.jpg";
import PartnerTwo6 from "./assets/images/client-logos/gaar-150x150.jpg";
import PartnerTwo7 from "./assets/images/client-logos/client_9.jpg";


const LandingPage = () => {
  const navigate = useNavigate();
  const [stylesLoaded, setStylesLoaded] = useState(false);
  const [formData, setFormData] = useState({
  name: "",
  email: "",
  number: "",
  company: "",
  website: "",
  subject: "",
  message: "",
});
const [isOpen, setIsOpen] = useState(false);

 useEffect(() => {
    const cssFiles = [
      'fontawesome.5.9.0.min.css',
      'flaticon.css',
      'bootstrap.4.5.3.min.css',
      'magnific-popup.css',
      'slick.css',
      'animate.min.css',
      'nice-select.css',
      'spacing.min.css',
      'menu.css',
      'style.css',
      'responsive.css'
    ];
    let loadedCount = 0;

    const links = cssFiles.map(file => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = `/assets/landingpage/assets/css/${file}`;
      link.onload = () => {
      loadedCount++;
      if (loadedCount === cssFiles.length) {
        setStylesLoaded(true);
      }
    };
      document.head.appendChild(link);
      return link;
    });

    return () => {
      links.forEach(link => document.head.removeChild(link));
    };
  }, []);


  const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData((prev) => ({
    ...prev,
    [name]: value,
  }));
};

  const handleSubmit = async (e) => {

   e.preventDefault();

  try {
    const response = await fetch(`${API_BASE_URL}/auth/contact-form`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    var data = await response.json();

    if (data.success) {
      Swal.fire({
        title: "Success!",
        text: "Message sent successfully.",
        icon: "success",
        confirmButtonText: "OK",
      })
      setFormData({
        name: "",
        email: "",
        number: "",
        company: "",
        website: "",
        subject: "",
        message: "",
      });
    } else {
      alert("Failed to send message.");
    }
  } catch (error) {
    console.error("Error submitting form:", error);
  }
};

if (!stylesLoaded) return <div>...</div>; 
  return (
    <Container fluid className=" home-two p-0">
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&amp;family=Poppins:wght@400;600;700&amp;display=swap" rel="stylesheet"></link>
     <>
  <div className="page-wrapper">
    {/* Preloader */}
    {/* <div className="preloader" /> */}
    {/*====== Header Part Start ======*/}
    <header className="main-header header-two" style={{ position: "fixed" , background: "#017eff" , background: "linear-gradient(90deg, rgb(77 59 239) 0%, rgb(11 117 253) 70%, rgb(1 126 255) 100%)"}}>
      {/*Header-Upper*/}
      <div className="header-upper">
        <div className="container clearfix">
          <div className="header-inner p-2">
            <div className="nav-outer clearfix">
              {/* Main Menu */}
              <nav className="main-menu navbar-expand-lg">
                <div className="navbar-header">
                  <div className="logo-mobile">
                    <a href="home">
                       <img src={LogoHomeWhite} alt="Logo" />
                    </a>
                  </div>
                  {/* Toggle Button */}
                  <button
                    type="button"
                    className="navbar-toggle"
                    data-toggle="collapse"
                    data-target=".navbar-collapse"
                    aria-controls="main-menu"
                    onClick={() => setIsOpen(!isOpen)}
                  >
                    <span className="icon-bar" />
                    <span className="icon-bar" />
                    <span className="icon-bar" />
                  </button>
                </div>
                <div
                   className={`navbar-collapse collapse clearfix ${isOpen ? "show" : ""}`}
                  id="main-menu"
                >
                  <ul className="navigation clearfix">
                    <li className="current">
                      <a href="#home" className="page-scroll">
                        home
                      </a>
                    </li>
                    <li>
                      <a href="#features" className="page-scroll">
                        Features
                      </a>
                    </li>
                    <li>
                      <a href="#contact" className="page-scroll">
                        contact
                      </a>
                    </li>
                  </ul>
                </div>
              </nav>
              {/* Main Menu End*/}
            </div>
            <div className="logo-outer mx-lg-auto">
              <div className="logo">
                <a href="home">
                  <img src={LogoHomeWhite} alt="Logo" width={"120px"} />
                </a>
              </div>
            </div>
            <div className="menu-right d-none d-lg-flex align-items-center ml-lg-auto">
              {/* Menu Serch Box*/}
              {/* <div className="nav-search">
                <button className="fa fa-search" />
                <form action="#" className="hide">
                  <input
                    type="text"
                    placeholder="Search"
                    className="searchbox"
                    required=""
                  />
                  <button type="submit" className="searchbutton fa fa-search" />
                </form>
              </div> */}
        
              <a href="/login" className="theme-btn style-five">
                Get Started <i className="fas fa-arrow-right" />
              </a>
            </div>
          </div>
        </div>
      </div>
      {/*End Header Upper*/}
    </header>
    {/*====== Header Part End ======*/}
    {/*====== Hero Section Start ======*/}
    <section
      className="hero-section-two bgs-cover rel z-2 pt-205 pb-150 rpt-150 rpb-50"
      style={{ backgroundImage: `url(${HeroBg})` }}
      id="home"
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-9">
            <div className="hero-content-two text-center text-white rpt-20">
              <span className="sub-title wow fadeInUp delay-0-2s">
                 Glansa Saving & Loan Management Application
              </span>
              <h1 className="mb-15 wow fadeInUp delay-0-4s">
                 Empowering Smart <span style={{ color: "#ffc800" }}>Savings</span> & Seamless {" "}
                <span style={{ color: "#ffc800" }}>Loans</span>
              </h1>
              <p className="wow fadeInUp delay-0-5s">
                Simplify financial operations with an all-in-one platform designed for managing savings,
                loans, member records, and real-time digital payments across multiple organizations.
              </p>
              <div className="hero-btns mt-40 wow fadeInUp delay-0-8s">
                {/* <a href="/login" className="theme-btn style-four">
                  Get Started <i className="fas fa-arrow-right" />
                </a> */}
                {/* <a href="about.html" className="theme-btn style-five">
                  Learn More <i className="fas fa-arrow-right" />
                </a> */}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="section-alpha-text mb-250">GlansaSLMS</div>
      <img className='dots-shape' src={WhiteDots} alt="Shape" />
      <img className='tringle-shape' src={WhiteTringle} alt="Shape" />
      <img className='close-shape' src={WhiteClose} alt="Shape" />


      <div className="left-circles" />
      <div className="right-circles" />
    </section>
    {/*====== Hero Section End ======*/}
    {/*====== Partners Section Start ======*/}
    <section className="partners-section-two rel bg-gray pb-60 rpb-30">
      <div className="container">
        <div className="partner-dashboard mb-75">
          <div className="hero-btns mb-40 wow fadeInUp delay-0-8s text-center">
                <a href="/login" className="theme-btn style-four">
                  Get Started <i className="fas fa-arrow-right" />
                </a>
                {/* <a href="about.html" className="theme-btn style-five">
                  Learn More <i className="fas fa-arrow-right" />
                </a> */}
              </div>
          <img src={Dashboard} alt="Dashboard" />
        </div>
        <div className="row justify-content-center">
          <div className="col-xl-8 col-lg-10">
            <div className="section-title text-center text-white mb-45">
              <h2>
                We’ve <span>100+</span> More Then Trusted Premium Global
                Partners
              </h2>
            </div>
          </div>
        </div>
        <div className="partner-two-wrap">
          <a
            className="partner-item wow fadeInUp delay-0-2s"
            href="project-details.html"
          >
            <img src={PartnerTwo1} alt="Partner" />
          </a>
          <a
            className="partner-item wow fadeInUp delay-0-3s"
            href="project-details.html"
          >
            <img src={PartnerTwo2} alt="Partner" />
          </a>
          <a
            className="partner-item wow fadeInUp delay-0-4s"
            href="project-details.html"
          >
            <img src={PartnerTwo3} alt="Partner" />
          </a>
          <a
            className="partner-item wow fadeInUp delay-0-5s"
            href="project-details.html"
          >
            <img src={PartnerTwo4} alt="Partner" />
          </a>
          <a
            className="partner-item wow fadeInUp delay-0-6s"
            href="project-details.html"
          >
            <img src={PartnerTwo5} alt="Partner" />
          </a>
          <a
            className="partner-item wow fadeInUp delay-0-7s"
            href="project-details.html"
          >
            <img src={PartnerTwo6} alt="Partner" />
          </a>
          {/* <a
            className="partner-item wow fadeInUp delay-0-8s"
            href="project-details.html"
          >
            <img src={PartnerTwo7} alt="Partner" />
          </a> */}
        </div>
      </div>
      <div className="bg-yellow-shape" />
    </section>
    {/*====== Partners Section End ======*/}
    {/*====== Solutions Section Start ======*/}
    <section class="solutions-section-two rel z-1 pt-130 rpt-100 pb-80 rpb-50" id="features">
  <div class="container">
    <div class="row align-items-end mb-10">
      <div class="col-xl-7 col-lg-8">
        <div class="section-title mb-20">
          <span class="sub-title">Our Special Solutions</span>
          <h2>Smarter Tools for Managing Savings & Loans</h2>
        </div>
      </div>
      <div class="col-xl-5 col-lg-4">
        <div class="section-title-btns text-lg-right mb-50 rmb-20">
          <a href="single-service.html" class="theme-btn">Start Demo <i class="fas fa-arrow-right"></i></a>
        </div>
      </div>
    </div>

    <div class="row align-items-center">
      <div class="col-xl-3 col-md-6">
        <div class="solution-item-two wow fadeInUp delay-0-2s">
          <span class="number">01</span>
          <i class="fas fa-check"></i>
          <h4>Automated Savings Management</h4>
          <p>Track and manage member savings with automated interest calculations, flexible deposit types, and detailed statements.</p>
        </div>
      </div>

      <div class="col-xl-3 col-md-6">
        <div class="solution-item-two color-two wow fadeInUp delay-0-4s">
          <span class="number">02</span>
          <i class="fas fa-check"></i>
          <h4>Flexible Loan Processing</h4>
          <p>Create, approve, and disburse loans with custom interest rates, repayment terms, and real-time EMI tracking.</p>
        </div>
      </div>

      <div class="col-xl-3 col-md-6">
        <div class="solution-item-two color-three wow fadeInUp delay-0-6s">
          <span class="number">03</span>
          <i class="fas fa-check"></i>
          <h4>Real-Time Payment Monitoring</h4>
          <p>Monitor all loan repayments and savings deposits in real-time with detailed reporting and automated notifications.</p>
        </div>
      </div>

      <div class="col-xl-3 col-md-6">
        <div class="solution-item-two color-four wow fadeInUp delay-0-8s">
          <span class="number">04</span>
          <i class="fas fa-check"></i>
          <h4>Member Portal & Transparency</h4>
          <p>Provide your members with a secure portal to view balances, apply for loans, download receipts, and stay updated.</p>
        </div>
      </div>
    </div>
  </div>
</section>

    {/*====== Solutions Section End ======*/}
    {/*====== Core Features Start ======*/}
  

    {/*====== Core Features End ======*/}
    {/*====== Counter Section Start ======*/}
    <div className="counter-section-two rel z-2">
      <div className="container">
        <div
          className="counter-inner-two bg-blue bgs-cover text-white rel z-3"
          style={{
            backgroundImage: `url(${CounterBg})`,
          }}
        >
          <div className="row">
  <div className="col-xl-3 col-md-6">
    <div className="success-item style-two wow fadeInUp delay-0-2s">
      <i className="flaticon-market" />
      <span className="count-text">Smart Dashboard</span>
      <p>View savings, loans, payments, and analytics at a glance.</p>
    </div>
  </div>
  <div className="col-xl-3 col-md-6">
    <div className="success-item style-two wow fadeInUp delay-0-4s">
      <i className="flaticon-group" />
      <span className="count-text">Member Management</span>
      <p>Manage members, their savings, loans, and activity logs easily.</p>
    </div>
  </div>
  <div className="col-xl-3 col-md-6">
    <div className="success-item style-two wow fadeInUp delay-0-6s">
      <i className="flaticon-software" />
      <span className="count-text">Loan Processing</span>
      <p>Automate loan issue, EMI tracking, and repayment history.</p>
    </div>
  </div>
  <div className="col-xl-3 col-md-6">
    <div className="success-item style-two wow fadeInUp delay-0-8s">
      <i className="flaticon-trophy" />
      <span className="count-text">Razorpay Integration</span>
      <p>Enable secure online payments and digital receipts.</p>
    </div>
  </div>
</div>

          {/* <div className="row">
            <div className="col-xl-3 col-md-6">
              <div className="success-item style-two wow fadeInUp delay-0-2s">
                <i className="flaticon-market" />
                <span className="count-text" data-speed={3000} data-stop={250}>
                  0
                </span>
                <p>Happy Clients</p>
              </div>
            </div>
            <div className="col-xl-3 col-md-6">
              <div className="success-item style-two wow fadeInUp delay-0-4s">
                <i className="flaticon-software" />
                <span className="count-text" data-speed={3000} data-stop={843}>
                  0
                </span>
                <p>Download Apps</p>
              </div>
            </div>
            <div className="col-xl-3 col-md-6">
              <div className="success-item style-two wow fadeInUp delay-0-6s">
                <i className="flaticon-trophy" />
                <span className="count-text" data-speed={3000} data-stop={965}>
                  0
                </span>
                <p>Awards Winning</p>
              </div>
            </div>
            <div className="col-xl-3 col-md-6">
              <div className="success-item style-two wow fadeInUp delay-0-8s">
                <i className="flaticon-group" />
                <span className="count-text" data-speed={3000} data-stop={753}>
                  0
                </span>
                <p>Team Members</p>
              </div>
            </div>
          </div> */}
          <div className="white-circle">
            <img src={WhiteCircle} alt="Shape" />
          </div>
        </div>
      </div>
      <div className="bg-yellow-shape" />
    </div>
    {/*====== Counter Section End ======*/}
    {/*====== Customizing Section Start ======*/}

      <section className="core-features rel z-1 pb-130 rpb-100 mt-4">
  <div className="container">
    <div className="row align-items-center">
      <div className="col-xl-5 col-lg-6">
        <div className="core-feature-content rmb-55 wow fadeInLeft delay-0-2s">
          <div className="section-title mb-25">
            <span className="sub-title">Core Features</span>
            <h2>Empowering Savings & Loan Management</h2>
          </div>
          <p>
            Our smart and secure platform makes it easy to manage member savings, automate loan processes, and monitor transactions with real-time analytics. Built for cooperatives, microfinance, and finance teams who want full control with less manual work.
          </p>
          <a href="/login" className="theme-btn style-three mt-25">
            Get Started <i className="fas fa-arrow-right" />
          </a>
        </div>
      </div>
      <div className="col-xl-7 col-lg-6">
        <div className="core-feature-image text-lg-right wow fadeInRight delay-0-2s">
          <img src={FeatureRight} alt="Savings and Loan Features" />
        </div>
      </div>
    </div>
  </div>
</section>

    {/* <section className="customizing-section rel z-1 pt-130 rpt-100">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-xl-7 col-lg-6">
            <div className="customizing-image rmb-55 wow fadeInRight delay-0-2s">
              <img src={FeatureLeft} alt="Feature" />;
            </div>
          </div>
          <div className="col-xl-5 col-lg-6">
            <div className="customizing-content wow fadeInLeft delay-0-2s">
              <div className="section-title mb-25">
                <span className="sub-title">Customizing Website</span>
                <h2>Creates Unique and Rare UI Kits With Tailwinds</h2>
              </div>
              <p>
                Sed ut perspiciatis unde omnis iste natus error voluptatem
                accusan tium doloremque laudantium totam rem aperiam eaque quae
                ainvtore veritatis et quasi architecto beatae vitae dicta sunt
                explicabo. Nemo enim ipsam voluptatem quia voluptas sit
                aspernatur
              </p>
              <a href="about.html" className="theme-btn style-three mt-25">
                Get Started <i className="fas fa-arrow-right" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section> */}
    {/*====== Customizing Section End ======*/}
    {/*====== Services Solutions Start ======*/}
   
    {/*====== Services Solutions End ======*/}
    {/*====== Pricing Section Start ======*/}
   
    {/*====== Pricing Section End ======*/}
    {/*====== Feedback Section Start ======*/}
   
    {/*====== Feedback Section End ======*/}
    {/*====== Contact Section Start ======*/}
    <div className="contact-section pb-160 rpb-100" id="contact">
      <div className="container">
        <div className="contact-map">
          <iframe 
          src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3806.4302581044585!2d78.387391!3d17.439109!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb9a3e6c6874dd%3A0x7abfee772aee3875!2sGlansa%20Solutions!5e0!3m2!1sen!2sus!4v1749890926943!5m2!1sen!2sus"
            height={685}
            style={{ border: 0, width: "100%" }}
            allowFullScreen=""
            loading="lazy"
          />
        </div>
        <div className="row justify-content-center">
          <div className="col-lg-10 col-11">
            <form
              id="contactForm"
              className="contact-form bg-white"
              name="contactForm"
              action="#"
              method="post"
            >
              <div className="row clearfix">
                <div className="col-xl-4 col-md-6">
                  <div className="form-group">
                    <label htmlFor="name">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="form-control"
                      placeholder="Type your name"
                      required=""
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="col-xl-4 col-md-6">
                  <div className="form-group">
                    <label htmlFor="number">phone number</label>
                    <input
                      type="text"
                      id="number"
                      name="number"
                      className="form-control"
                      placeholder="Type your phone number"
                      value={formData.number}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="col-xl-4 col-md-6">
                  <div className="form-group">
                    <label htmlFor="company">Company</label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      className="form-control"
                      placeholder="Type your Company"
                      value={formData.company}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="col-xl-4 col-md-6">
                  <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="form-control"
                      placeholder="Type your Email Address"
                      required=""
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="col-xl-4 col-md-6">
                  <div className="form-group">
                    <label htmlFor="subject">subject</label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      className="form-control"
                      placeholder="I would like to ........."
                      value={formData.subject}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="col-xl-4 col-md-6">
                  <div className="form-group">
                    <label htmlFor="website">website</label>
                    <input
                      type="url"
                      id="website"
                      name="website"
                      className="form-control"
                      placeholder="Type your website"
                      value={formData.website}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="form-group">
                    <label htmlFor="message">message</label>
                    <textarea
                      name="message"
                      id="message"
                      rows={4}
                      placeholder="Write message"
                      required=""
                      defaultValue={""}
                      value={formData.message}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="form-group text-center mb-0">
                    <button className="theme-btn" type="submit" onClick={handleSubmit}>
                      send us message <i className="fas fa-arrow-right" />
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    {/*====== Contact Section End ======*/}
    {/*====== Footer Section Start ======*/}
    <footer className="footer-section bg-lighter rel z-1 mt-220">
      <div className="container">
        <div className="newsletter-inner bg-blue bgs-cover text-white rel z-3">
          <div className="for-adjust-spacing" />
          <div className="row  align-items-center align-items-xl-start">
           <div className="col-lg-6">
  <div className="newsletter-content p-60 wow fadeInUp delay-0-2s">
    <div className="section-title mb-30">
      <span className="sub-title">Why Choose Us</span>
      <h4>All-in-One Solution for Managing Savings & Loans</h4>
    </div>
    <p className="mb-3">
      Our application is designed to simplify and streamline financial operations
      for organizations and cooperative societies. From managing members and tracking
      loans to handling payments and savings — everything is in one secure place.
    </p>
    <ul className="list-style-two">
      <li>✔ Manage multiple companies and member accounts with ease</li>
      <li>✔ Track savings, loans, and repayments in real-time</li>
      <li>✔ Integrated Razorpay for fast and secure payments</li>
      <li>✔ Role-based login system for Admin, Employees, and Members</li>
    </ul>
    <p className="mt-3 text-white">
      Built for scalability, security, and efficiency — this platform empowers your
      financial operations with confidence.
    </p>
  </div>
</div>

            <div className="col-lg-6">
              <div className="newsletter-images wow fadeInUp delay-0-4s">
                <img src={Newsletter} alt='Newsletter' />
                <img src={NewsletterCircle} alt='shape'   className="circle slideUpRight"/>
                <img src={NewsletterDots} className="dots slideLeftRight" alt='shape' />

              </div>
            </div>
          </div>
        </div>
        <div className="row justify-content-between">
          <div className="col-xl-4 col-sm-6 col-7 col-small">
            <div className="footer-widget about-widget1">
              <div className="footer-logo mb-20">
                 <h4 className="footer-title">About</h4>
              </div>
              <p>
              Glansa is a globally recognized for its Business and Technology Solutions.We provide all the cooperate solutions
               i.e., Designing, Development, Branding through a 
              deep industry experience and help the clients to create successful and adaptive Business !!
              </p>
            </div>
          </div>
          <div className="col-xl-2 col-sm-4 col-5 col-small">
            <div className="footer-widget link-widget">
              {/* <h4 className="footer-title">About</h4> */}
                 <a href="index.html">
                  <img src={LogoHome} alt="Logo" />
                </a>
            </div>
             <div className="footer-widget contact-widget">
              <div className="social-style-one mt-25">
                <a href="https://www.facebook.com/GlansaSolution/" target="_blank">
                  <i className="fab fa-facebook-f" />
                </a>
                <a href="https://www.linkedin.com/company/glansa-solutions/posts/?feedView=all" target='_blank'>
                  <i className="fab fa-linkedin-in" />
                </a>
                <a href="https://www.instagram.com/glansasolutions__/" target="_blank">
                  <i className="fab fa-instagram" />
                </a>
              </div>
            </div>
          </div>
          
          <div className="col-xl-4 col-md-4">
            <div className="footer-widget contact-widget">
              <h4 className="footer-title">Get in Touch</h4>
              <ul className="list-style-three">
                <li>
                  <i className="fas fa-map-marker-alt" />#B1 Spaces & More Business Park #M3 Dr.No.#1-89/A/8, C/2, Vittal Rao Nagar Rd, Madhapur, Telangana 500081
                </li>
                <li>
                  <i className="fas fa-envelope-open" />{" "}
                  <a href="mailto:info@glansa.com">info@glansa.com</a>
                </li>
                <li>
                  <i className="fas fa-phone" /> Call :{" "}
                  <a href="callto:+91-988-565-3865 ">+91-988-565-3865 </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="copyright-area text-center">
          <p>
            © 2025 <a href="glansa.com">Glansa Solutions PVT LTD.</a> All rights reserved
          </p>
        </div>
      </div>
      <img
        className="dots-shape"
        src={WhiteDots}
        alt="Shape"
      />
      <img
        className="tringle-shape"
        src={Tringle2}
        alt="Shape"
      />
      <img
        className="circle-shape"
        src={Circle2}
        alt="Shape"
      />
      <div className="left-circles" />
      <div className="right-circles" />
      <div className="bg-yellow-shape" />

         <div className="bg-yellow-shape" />
    
    </footer>
    {/*====== Footer Section End ======*/}
  </div>
  {/*End pagewrapper--
   */}
</>

    </Container>
  );
};

export default LandingPage;

