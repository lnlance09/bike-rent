import "./style.css"
import "semantic/dist/semantic.min.css"
import { logout } from "components/authentication/v1/actions"
import { Provider, connect } from "react-redux"
import { ReactSVG } from "react-svg"
import {
	Button,
	Container,
	Dropdown,
	Form,
	Grid,
	Header,
	Icon,
	Image,
	Input,
	Menu,
	Responsive,
	Segment,
	Select,
	Sidebar,
	Visibility
} from "semantic-ui-react"
import { timeOptions } from "utils/timeOptions"
import DatePicker from "react-datepicker"
// import ImagePic from "images/images/image-square.png"
// import TrumpPic from "images/images/maga-cap-square.jpeg"
import Logo from "./images/logo.svg"
import PropTypes from "prop-types"
import React, { Component } from "react"
import store from "store"
import Url from "url-parse"

const getWidth = () => {
	const isSSR = typeof window === "undefined"
	return isSSR ? Responsive.onlyTablet.minWidth : window.innerWidth
}

class AppHeader extends Component {
	constructor(props) {
		super(props)
		this.state = {
			fixed: false,
			sidebarOpened: false,
			startDate: new Date()
		}

		this.onLogout = this.onLogout.bind(this)
	}

	handleChange = date => {
		this.setState({ startDate: date })
	}

	handleSidebarHide = () => this.setState({ sidebarOpened: false })

	handleToggle = () => this.setState({ sidebarOpened: true })

	hideFixedMenu = () => this.setState({ fixed: false })

	onLogout() {
		this.props.logout()
		const parsed = new Url(window.location)
		if (parsed.pathname !== "/") {
			window.location.reload()
		}
	}

	showFixedMenu = () => this.setState({ fixed: true })

	render() {
		const { fixed, sidebarOpened, startDate } = this.state

		const CustomDateInput = ({ value, onClick }) => (
			<Input
				fluid
				icon="calendar"
				iconPosition="left"
				onClick={onClick}
				placeholder="Pick a date"
				size="big"
				value={value}
			/>
		)

		const BookingForm = (
			<Grid columns={4} stackable>
				<Grid.Row>
					<Grid.Column stretched width={4}>
						<DatePicker
							customInput={<CustomDateInput />}
							minDate={new Date()}
							onChange={this.handleChange}
						/>
					</Grid.Column>

					<Grid.Column>
						<Dropdown
							className="timeDropdown"
							fluid
							icon="clock"
							options={timeOptions}
							placeholder="Time"
							selection
						/>
					</Grid.Column>

					<Grid.Column>
						<Dropdown
							className="storeDropdown"
							fluid
							icon="clock"
							options={timeOptions}
							placeholder="Store"
							selection
						/>
					</Grid.Column>

					<Grid.Column>
						<Button
							color="blue"
							content="Let's go"
							fluid
							size="big"
						/>
					</Grid.Column>
				</Grid.Row>
			</Grid>
		)

		const HeroContent = (
			<Container className="heroContainer">
				<Header as="h1" className="heroHeaderOne" content="Call Out Liberal Propaganda" />
				<Header
					as="h2"
					className="heroHeaderTwo"
					content="We won't let liberals bully us anymore"
				/>
				<Container>
					<Segment className="heroSegment">
						{BookingForm}
					</Segment>
				</Container>
			</Container>
		)

		const LoginButton = props => {
			if (props.authenticated) {
				const trigger = (
					<Image
						avatar
						bordered
						circular
						// onError={i => (i.target.src = ImagePic)}
						rounded
						// src={props.data.img ? props.data.img : TrumpPic}
					/>
				)

				return (
					<Menu.Item position="right">
						<Dropdown
							className="dropDownMenu"
							icon={false}
							pointing="top right"
							trigger={trigger}
						>
							<Dropdown.Menu>
								<Dropdown.Item
									onClick={() =>
										props.history.push(`/users/${props.data.username}`)
									}
									text={props.data.name}
								/>
								<Dropdown.Item onClick={this.onLogout} text="Sign out" />
							</Dropdown.Menu>
						</Dropdown>
					</Menu.Item>
				)
			}

			return (
				<Menu.Item className="signInLink" direction="right" position="right">
					<Button
						content="Sign In"
						inverted
						onClick={() => props.history.push("/signin?type=signin")}
					/>
					<Button
						content="Sign Up"
						inverted
						onClick={() => props.history.push("/signin?type=join")}
						style={{ marginLeft: "0.5em" }}
					/>
				</Menu.Item>
			)
		}

		const DesktopHeader = (
			<Responsive getWidth={getWidth} minWidth={Responsive.onlyTablet.minWidth}>
				<Visibility
					onBottomPassed={this.showFixedMenu}
					onBottomPassedReverse={this.hideFixedMenu}
					once={false}
				>
					<Segment
						className="desktopSegment"
						style={{ minHeight: this.props.minHeight }}
						textAlign="center"
						vertical
					>
						<Menu
							className="globalHeaderMenu"
							fixed={fixed ? "top" : null}
							inverted={!fixed}
							secondary={false}
							size="large"
						>
							<Container>
								<Menu.Item
									onClick={() => {
										this.props.history.push("/")
									}}
									style={{ padding: "7px" }}
								>
									<ReactSVG
										beforeInjection={svg => {
											svg.classList.add("svgHeaderLogo")
											svg.setAttribute("style", "height: 50px; width: 50px")
										}}
										className="headerLogo"
										evalScripts="always"
										src={Logo}
									/>
									<span className="logoText">Bike Rent</span>
								</Menu.Item>
								<Menu.Item
									active={this.props.activeItem === "cities"}
									className="headerLink"
									name="cities"
									onClick={() => this.props.history.push("/cities")}
								/>
								<Menu.Item
									active={this.props.activeItem === "stores"}
									className="headerLink"
									name="stores"
									onClick={() => this.props.history.push("/stores")}
								/>
								<Menu.Item
									active={this.props.activeItem === "bikes"}
									className="headerLink"
									name="bikes"
									onClick={() => this.props.history.push("/bikes")}
								/>
								{LoginButton(this.props)}
							</Container>
						</Menu>
						{this.props.activeItem === "home" && HeroContent}
					</Segment>
				</Visibility>
			</Responsive>
		)

		const MobileHeader = (
			<Responsive
				as={Sidebar.Pushable}
				getWidth={getWidth}
				maxWidth={Responsive.onlyMobile.maxWidth}
			>
				<Sidebar.Pusher dimmed={sidebarOpened}>
					<Segment
						className="mobileSegment"
						style={{ minHeight: this.props.minHeight }}
						textAlign="center"
						vertical
					>
						<Container className="sidebarContainer">
							<Menu className="globalHeaderMenu" size="large">
								<Menu.Item
									onClick={() => {
										this.props.history.push("/")
									}}
									style={{ padding: "7px" }}
								>
									<ReactSVG
										beforeInjection={svg => {
											svg.classList.add("svgHeaderLogo")
											svg.setAttribute("style", "height: 36px; width: 36px")
										}}
										className="headerLogo"
										evalScripts="always"
										src={Logo}
									/>
									<span className="logoText">Bike Rent</span>
								</Menu.Item>
								<Menu.Item position="right" onClick={this.handleToggle}>
									<Icon name="sidebar" size="large" />
								</Menu.Item>
							</Menu>
						</Container>
						{this.props.activeItem === "home" && HeroContent}
					</Segment>
				</Sidebar.Pusher>
			</Responsive>
		)

		return (
			<Provider store={store}>
				<div className="pageHeader">
					{DesktopHeader}
					{MobileHeader}
				</div>
				<Sidebar
					animation="push"
					as={Menu}
					inverted
					onHide={this.handleSidebarHide}
					size="large"
					vertical
					visible={sidebarOpened}
				>
					<Menu.Item
						onClick={() => {
							if (this.props.authenticated) {
								this.onLogout()
							} else {
								this.props.history.push("/signin")
							}
						}}
					>
						{this.props.authenticated ? "Sign Out" : "Sign In"}
					</Menu.Item>
					<Menu.Item onClick={() => this.props.history.push("/cities")}>
						Cities
					</Menu.Item>
					<Menu.Item onClick={() => this.props.history.push("/stores")}>
						Stores
					</Menu.Item>
					<Menu.Item onClick={() => this.props.history.push("/bikes")}>
						Bikes
					</Menu.Item>
				</Sidebar>
			</Provider>
		)
	}
}

AppHeader.defaultProps = {
	activeItem: "home",
	authenticated: false,
	logout,
	minHeight: "0px"
}

AppHeader.propTypes = {
	activeItem: PropTypes.string,
	authenticated: PropTypes.bool,
	logout: PropTypes.func,
	minHeight: PropTypes.string
}

const mapStateToProps = (state, ownProps) => ({
	...state.user,
	...ownProps
})

export default connect(mapStateToProps, { logout })(AppHeader)
