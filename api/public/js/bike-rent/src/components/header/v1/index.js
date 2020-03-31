import "./style.css"
import { logout } from "components/authentication/v1/actions"
import { Provider, connect } from "react-redux"
import { ReactSVG } from "react-svg"
import {
	Button,
	Container,
	Dropdown,
	Header,
	Icon,
	Image,
	Label,
	List,
	Menu,
	Responsive,
	Segment,
	Sidebar,
	Visibility
} from "semantic-ui-react"
import React, { Component } from "react"
import _ from "lodash"
import ImagePic from "images/avatar/default-profile.jpg"
import Logo from "./images/logo.svg"
import PropTypes from "prop-types"
import store from "store"
import Url from "url-parse"

const getWidth = () => {
	const isSSR = typeof window === "undefined"
	return isSSR ? Responsive.onlyTablet.minWidth : window.innerWidth
}

const HeroContent = ({ backgroundImage, content, headerOne, headerTwo }) => (
	<Container className="heroContainer" style={{ backgroundImage: `url('${backgroundImage}'` }}>
		<Header as="h1" className="heroHeaderOne" content={headerOne} />
		<Header as="h2" className="heroHeaderTwo" content={headerTwo} />
		{content && (
			<Container>
				<Segment className="heroSegment" raised size="big">
					{content}
				</Segment>
			</Container>
		)}
	</Container>
)

class AppHeader extends Component {
	constructor(props) {
		super(props)
		this.state = {
			fixed: false,
			sidebarOpened: false,
			startDate: new Date()
		}
	}

	handleChange = date => this.setState({ startDate: date })

	handleSidebarHide = () => this.setState({ sidebarOpened: false })

	handleToggle = () => this.setState({ sidebarOpened: true })

	hideFixedMenu = () => this.setState({ fixed: false })

	onLogout = () => {
		this.props.logout()
		window.location.reload()
	}

	showFixedMenu = () => this.setState({ fixed: true })

	render() {
		const { fixed, sidebarOpened } = this.state
		const {
			activeItem,
			authenticated,
			backgroundColor,
			backgroundImage,
			content,
			data,
			headerOne,
			headerTwo,
			items,
			language,
			languages,
			showMainContent,
			signInButton,
			signUpButton
		} = this.props
		const { cart, user } = data

		const CartDropdown = (
			<Menu.Menu position="right">
				<Dropdown
					pointing="top"
					trigger={
						<span>
							{data.cart.items !== undefined && (
								<Label circular color="olive">
									{data.cart.items.length}
								</Label>
							)}{" "}
							Your cart
						</span>
					}
				>
					<Dropdown.Menu as={Segment} style={{ padding: "16px" }}>
						<List relaxed="very" size="large">
							<List.Item>
								<b>Total</b>
							</List.Item>
							<List.Item>
								$
								{_.sumBy(data.cart.items, item => {
									if (item.bike !== undefined) {
										return parseInt(item.bike.hourlyRate, 10)
									}
								})}
							</List.Item>
						</List>

						<Dropdown.Divider />

						<Button
							color="blue"
							content="View details"
							fluid
							onClick={() => this.props.history.push("/checkout")}
						/>
					</Dropdown.Menu>
				</Dropdown>
			</Menu.Menu>
		)

		const LanguageSelection = (
			<Dropdown
				className="languageMenu"
				defaultValue="English"
				inline
				pointing="top"
				text={language}
			>
				<Dropdown.Menu>
					{languages.map(item => (
						<Dropdown.Item key={item} text={item} value={item} />
					))}
				</Dropdown.Menu>
			</Dropdown>
		)

		const LoginButton = props => {
			if (props.authenticated) {
				const trigger = (
					<Image
						avatar
						bordered
						circular
						onError={i => (i.target.src = ImagePic)}
						rounded
						src={props.data.img ? props.data.img : ImagePic}
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
										props.history.push(`/profile`)
									}
									text={user.name}
								/>
								<Dropdown.Item
									onClick={() =>
										props.history.push(`/profile/purchases`)
									}
									text="My Purchases"
								/>
								<Dropdown.Item
									onClick={() =>
										props.history.push(`/profile/reviews`)
									}
									text="My Reviews"
								/>
								<Dropdown.Item
									onClick={() =>
										props.history.push(`/profile/payments`)
									}
									text="My Account"
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
						basic={signInButton.basic === 1}
						color={signInButton.color}
						content={signInButton.text}
						inverted={signInButton.inverted === 1}
						onClick={() => props.history.push("/signin?type=signin")}
					/>
					<Button
						basic={signUpButton.basic === 1}
						color={signUpButton.color}
						content={signUpButton.text}
						inverted={signUpButton.inverted === 1}
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
							color={backgroundColor}
							className="globalHeaderMenu"
							fixed={fixed ? "top" : null}
							inverted
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
								{items.map((item, i) => (
									<Menu.Item
										active={activeItem === item.text}
										className="headerLink"
										key={`${item.link}${i}`}
										name={item.text}
										onClick={() => this.props.history.push(`/${item.link}`)}
									/>
								))}
								{LoginButton(this.props)}
							</Container>
						</Menu>
						<Menu className="languageMenu">
							<Container className="languageContainer">
								{LanguageSelection}
								{CartDropdown}
							</Container>
						</Menu>
						{showMainContent && (
							<HeroContent
								backgroundImage={backgroundImage}
								content={content}
								headerOne={headerOne}
								headerTwo={headerTwo}
							/>
						)}
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
							<Menu className="globalHeaderMenu" color={backgroundColor} size="large">
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
						{showMainContent && (
							<HeroContent
								backgroundImage={backgroundImage}
								content={content}
								headerOne={headerOne}
								headerTwo={headerTwo}
							/>
						)}
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
					color={backgroundColor}
					onHide={this.handleSidebarHide}
					size="large"
					vertical
					visible={sidebarOpened}
				>
					<Menu.Item
						onClick={() => {
							if (authenticated) {
								this.onLogout()
							} else {
								this.props.history.push("/signin")
							}
						}}
					>
						{authenticated ? "Sign Out" : "Sign In"}
					</Menu.Item>
					{items.map((item, i) => (
						<Menu.Item
							key={`${item.link}${i}`}
							onClick={() => this.props.history.push(`/${item.link}`)}
						>
							{item.text}
						</Menu.Item>
					))}
				</Sidebar>
			</Provider>
		)
	}
}

AppHeader.propTypes = {
	activeItem: PropTypes.string,
	authenticated: PropTypes.bool,
	backgroundColor: PropTypes.string,
	backgroundImage: PropTypes.string,
	content: PropTypes.oneOfType([PropTypes.bool, PropTypes.node]),
	headerOne: PropTypes.string,
	headerTwo: PropTypes.string,
	inverted: PropTypes.bool,
	items: PropTypes.arrayOf(
		PropTypes.shape({
			link: PropTypes.string,
			text: PropTypes.string
		})
	),
	languages: PropTypes.array,
	logout: PropTypes.func,
	minHeight: PropTypes.string,
	showMainContent: PropTypes.bool,
	signInButton: PropTypes.shape({
		basic: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
		color: PropTypes.string,
		inverted: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
		text: PropTypes.string
	}),
	signUpButton: PropTypes.shape({
		basic: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
		color: PropTypes.string,
		inverted: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
		text: PropTypes.string
	})
}

AppHeader.defaultProps = {
	activeItem: "home",
	authenticated: false,
	inverted: false,
	items: [],
	languages: [],
	logout,
	minHeight: "0px",
	showMainContent: false,
	signInButton: {},
	signUpButton: {}
}

const mapStateToProps = (state, ownProps) => ({
	...state.user,
	...ownProps
})

export default connect(mapStateToProps, { logout })(AppHeader)
