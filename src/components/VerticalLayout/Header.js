import React, { Component } from "react";

import { connect } from "react-redux";
import {
    Row,
    Col,
    Form,
    FormGroup,
    InputGroup,
    Input,
    Button,
    Dropdown,
    DropdownToggle,
    DropdownMenu,
} from "reactstrap";

import { Link } from "react-router-dom";

// Import menuDropdown
import LanguageDropdown from "../CommonForBoth/TopbarDropdown/LanguageDropdown";
import NotificationDropdown from "../CommonForBoth/TopbarDropdown/NotificationDropdown";
import ProfileMenu from "../CommonForBoth/TopbarDropdown/ProfileMenu";

//Import i18n
import { withTranslation } from "react-i18next";

//Import Megamenu
import MegaMenu from "./MegaMenu";

// Redux Store
import { toggleRightSidebar } from "../../store/actions";

//Import logo Images
import logosmdark from "../../assets/images/logo-sm-dark.png";
import logodark from "../../assets/images/logo-dark.png";
import logosmlight from "../../assets/images/logo-sm-light.png";
import logolight from "../../assets/images/logo-light.png";

//Import Social Profile Images
import github from "../../assets/images/brands/github.png";
import bitbucket from "../../assets/images/brands/bitbucket.png";
import dribbble from "../../assets/images/brands/dribbble.png";
import dropbox from "../../assets/images/brands/dropbox.png";
import mail_chimp from "../../assets/images/brands/mail_chimp.png";
import slack from "../../assets/images/brands/slack.png";

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isSearch: false,
            isSocialPf: false
        };
        this.toggleMenu = this.toggleMenu.bind(this);
        this.toggleRightbar = this.toggleRightbar.bind(this);
        this.toggleFullscreen = this.toggleFullscreen.bind(this);
    }
    /**
     * Toggle sidebar
     */
    toggleMenu() {
        this.props.toggleMenuCallback();
    }

    /**
     * Toggles the sidebar
     */
    toggleRightbar() {
        this.props.toggleRightSidebar();
    }


    toggleFullscreen() {
        if (
            !document.fullscreenElement &&
      /* alternative standard method */ !document.mozFullScreenElement &&
            !document.webkitFullscreenElement
        ) {
            // current working methods
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen();
            } else if (document.documentElement.mozRequestFullScreen) {
                document.documentElement.mozRequestFullScreen();
            } else if (document.documentElement.webkitRequestFullscreen) {
                document.documentElement.webkitRequestFullscreen(
                    Element.ALLOW_KEYBOARD_INPUT
                );
            }
        } else {
            if (document.cancelFullScreen) {
                document.cancelFullScreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitCancelFullScreen) {
                document.webkitCancelFullScreen();
            }
        }
    }

    render() {
        return (
            <React.Fragment>
                <header id="page-topbar">
                    <div className="navbar-header">
                        <div className="d-flex">

                            <div className="navbar-brand-box">
                                <Link to="#" className="logo logo-dark">
                                    <span className="logo-sm">
                                        <img src={logosmdark} alt="" height="40" />
                                    </span>
                                    <span className="logo-lg">
                                        <img src={logodark} alt="" height="50" />
                                    </span>
                                </Link>

                                <Link to="#" className="logo logo-light">
                                    <span className="logo-sm">
                                        <img src={logosmlight} alt="" height="40" />
                                    </span>
                                    <span className="logo-lg">
                                        <img src={logolight} alt="" height="50" />
                                    </span>
                                </Link>
                            </div>

                            <Button size="sm" color="none" type="button" onClick={this.toggleMenu} className="px-3 font-size-24 header-item waves-effect" id="vertical-menu-btn">
                                <i className="ri-menu-2-line align-middle"></i>
                            </Button>

                            <Form className="app-search d-none d-lg-block">
                                <div className="position-relative">
                                    <Input type="text" className="form-control" placeholder={this.props.t('Search')} />
                                    <span className="ri-search-line"></span>
                                </div>
                            </Form>

                            {/* <MegaMenu /> */}
                        </div>

                        <div className="d-flex">
                            <div className="dropdown d-inline-block d-lg-none ms-2">
                                <button type="button" onClick={() => { this.setState({ isSearch: !this.state.isSearch }); }} className="btn header-item noti-icon waves-effect" id="page-header-search-dropdown">
                                    <i className="ri-search-line"></i>
                                </button>
                                <div className={this.state.isSearch === true ? "dropdown-menu dropdown-menu-lg dropdown-menu-end p-0 show" : "dropdown-menu dropdown-menu-lg dropdown-menu-end p-0"}
                                    aria-labelledby="page-header-search-dropdown">

                                    <Form className="p-3">
                                        <FormGroup className="m-0">
                                            <InputGroup>
                                                <Input type="text" className="form-control" placeholder={this.props.t('Search')} />
                                                <div className="input-group-append">
                                                    <Button color="primary" type="submit"><i className="ri-search-line"></i></Button>
                                                </div>
                                            </InputGroup>
                                        </FormGroup>
                                    </Form>
                                </div>
                            </div>

                            {/* <LanguageDropdown /> */}

                            {/* <Dropdown isOpen={this.state.isSocialPf} toggle={() => this.setState({ isSocialPf: !this.state.isSocialPf })} className="d-none d-lg-inline-block ms-1">
                                <DropdownToggle tag="button" className="btn header-item noti-icon waves-effect">
                                    <i className="ri-apps-2-line"></i>
                                </DropdownToggle>
                                <DropdownMenu className="dropdown-menu-lg dropdown-menu-end">
                                    <div className="px-lg-2">
                                        <Row className="g-0">
                                            <Col>
                                                <Link className="dropdown-icon-item" to="#">
                                                    <img src={github} alt="Github" />
                                                    <span>{this.props.t('GitHub')}</span>
                                                </Link>
                                            </Col>
                                            <Col>
                                                <Link className="dropdown-icon-item" to="#">
                                                    <img src={bitbucket} alt="bitbucket" />
                                                    <span>{this.props.t('Bitbucket')}</span>
                                                </Link>
                                            </Col>
                                            <Col>
                                                <Link className="dropdown-icon-item" to="#">
                                                    <img src={dribbble} alt="dribbble" />
                                                    <span>{this.props.t('Dribbble')}</span>
                                                </Link>
                                            </Col>
                                        </Row>

                                        <Row className="g-0">
                                            <Col>
                                                <Link className="dropdown-icon-item" to="#">
                                                    <img src={dropbox} alt="dropbox" />
                                                    <span>{this.props.t('Dropbox')}</span>
                                                </Link>
                                            </Col>
                                            <Col>
                                                <Link className="dropdown-icon-item" to="#">
                                                    <img src={mail_chimp} alt="mail_chimp" />
                                                    <span>{this.props.t('Mail Chimp')}</span>
                                                </Link>
                                            </Col>
                                            <Col>
                                                <Link className="dropdown-icon-item" to="#">
                                                    <img src={slack} alt="slack" />
                                                    <span>{this.props.t('Slack')}</span>
                                                </Link>
                                            </Col>
                                        </Row>
                                    </div>
                                </DropdownMenu>
                            </Dropdown> */}

                            <Button
        color="none"
        type="button"
        className="header-item noti-icon waves-effect"
        title="Start Tour"
        onClick={() => {
            if (typeof window.startJoyrideTour === "function") {
                window.startJoyrideTour();
            }
        }}
    >
        <i className="ri-question-line"></i> {/* or any icon you like */}
    </Button>

    {/* <button class="react-joyride__beacon" data-test-id="button-beacon" type="button" aria-label="Open the dialog" title="Open the dialog" fdprocessedid="m3gm4" style="background-color: transparent; border: 0px; border-radius: 0px; color: rgb(85, 85, 85); cursor: pointer; font-size: 16px; line-height: 1; padding: 8px; appearance: none; display: inline-block; height: 36px; position: relative; width: 36px; z-index: 9999;">
        <span style="animation: 1.2s ease-in-out 0s infinite normal none running joyride-beacon-inner; background-color: rgb(76, 175, 80); border-radius: 50%; display: block; height: 50%; left: 50%; opacity: 0.7; position: absolute; top: 50%; transform: translate(-50%, -50%); width: 50%;"></span>
    <span style="animation: 1.2s ease-in-out 0s infinite normal none running joyride-beacon-outer; background-color: rgba(76, 175, 80, 0.2); border: 2px solid rgb(76, 175, 80); border-radius: 50%; box-sizing: border-box; display: block; height: 100%; left: 0px; opacity: 0.9; position: absolute; top: 0px; transform-origin: center center; width: 100%;">
        </span></button> */}

                            <div className="dropdown d-none d-lg-inline-block ms-1">
                                <Button color="none" data-test-id="button-beacon"  type="button" className="header-item noti-icon waves-effect react-joyride__beacon" onClick={this.toggleFullscreen}>
                                    <i className="ri-fullscreen-line"></i>
                                </Button>
                            </div>

                            <NotificationDropdown />

                            <ProfileMenu />

                            {/* <div className="dropdown d-inline-block">
                                <Button color="none" onClick={this.toggleRightbar} type="button" className="header-item noti-icon right-bar-toggle waves-effect">
                                    <i className="ri-settings-2-line"></i>
                                </Button>
                            </div> */}
                        </div>
                    </div>
                </header>
            </React.Fragment>
        );
    }
}

const mapStatetoProps = state => {
    const { layoutType } = state.Layout;
    return { layoutType };
};

export default connect(mapStatetoProps, { toggleRightSidebar })(withTranslation()(Header));
