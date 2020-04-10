import "./style.css"
import { logout } from "components/authentication/v1/actions"
import { Provider, connect } from "react-redux"
import {
	Button,
	Container,
	Dropdown,
	Header,
	Icon,
	Image,
	Label,
	Menu,
	Placeholder,
	Responsive,
	Segment,
	Sidebar,
	Visibility
} from "semantic-ui-react"
import React, { Component, Fragment } from "react"
import ImagePic from "images/avatar/small/christian.jpg"
import PropTypes from "prop-types"
import SubHeader from "./subheader"
import store from "store"

const getWidth = () => {
	const isSSR = typeof window === "undefined"
	return isSSR ? Responsive.onlyTablet.minWidth : window.innerWidth
}

const HeroContent = ({ backgroundImage, content, headerOne, headerTwo, visible }) =>
	visible ? (
		<Container
			className="heroContainer"
			style={{ backgroundImage: `url('${backgroundImage}'` }}
		>
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
	) : (
		<Placeholder fluid style={{ height: "420px" }}>
			<Placeholder.Image />
		</Placeholder>
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

	onLogout = () => {
		this.props.logout()
		window.location.reload()
	}

	toggleFixedMenu = () => this.setState({ fixed: !this.state.fixed })

	toggleSidebar = () => this.setState({ sidebarOpened: !this.state.sidebarOpened })

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
			imgVisible,
			items,
			language,
			languages,
			logo,
			logoText,
			showMainContent,
			signInButton,
			signUpButton
		} = this.props
		const { cart, user } = data

		const LoginButton = props => {
			if (props.authenticated) {
				const trigger = (
					<Image
						avatar
						bordered
						circular
						onError={i => (i.target.src = ImagePic)}
						rounded
						src={props.data.user.img ? props.data.user.img : ImagePic}
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
								{user.privilege === "1" && (
									<Dropdown.Item
										onClick={() => props.history.push(`/admin`)}
										text="Admin Panel"
									/>
								)}
								<Dropdown.Item
									onClick={() => props.history.push(`/profile/purchases`)}
									text="My Purchases"
								/>
								<Dropdown.Item
									onClick={() => props.history.push(`/profile/reviews`)}
									text="My Reviews"
								/>
								<Dropdown.Item
									onClick={() => props.history.push(`/profile/payment-methods`)}
									text="My Account"
								/>
								<Dropdown.Divider />
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
					onBottomPassed={this.toggleFixedMenu}
					onBottomPassedReverse={this.toggleFixedMenu}
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
									<Image className="headerLogo" src={logo} />
									<span className="logoText">{logoText}</span>
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
						<SubHeader
							history={this.props.history}
							items={cart.items}
							language={language}
							languages={languages}
						/>
						{showMainContent && (
							<HeroContent
								backgroundImage={backgroundImage}
								content={content}
								headerOne={headerOne}
								headerTwo={headerTwo}
								visible={imgVisible}
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
							<Menu className="globalHeaderMenu" color={backgroundColor} inverted size="large">
								<Menu.Item
									onClick={() => {
										this.props.history.push("/")
									}}
									style={{ padding: "7px" }}
								>
									<Image className="headerLogo" src={logo} />
									<span className="logoText">{logoText}</span>
								</Menu.Item>
								<Menu.Item position="right" onClick={this.toggleSidebar}>
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
								visible={imgVisible}
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
					borderless
					onHide={this.toggleSidebar}
					size="large"
					vertical
					visible={sidebarOpened}
				>
					<Menu.Item
						className="logoListItem"
						onClick={() => {
							this.props.history.push("/")
						}}
					>
						<Image className="headerLogo" inline size="mini" src={logo} />{" "}
						<span className="logoText">{logoText}</span>
					</Menu.Item>
					{authenticated ? (
						<Fragment>
							<Menu.Item
								onClick={() => {
									this.props.history.push("/profile")
								}}
							>
								{this.props.data.user.name}
							</Menu.Item>
							<Menu.Menu size="large" style={{ marginLeft: "10px" }} vertical>
								<Menu.Item
									name="My Purchases"
									onClick={() => this.props.history.push(`/profile/purchases`)}
								/>
								<Menu.Item
									name="My Reviews"
									onClick={() => this.props.history.push(`/profile/reviews`)}
								/>
								<Menu.Item
									name="My Account"
									onClick={() =>
										this.props.history.push(`/profile/payment-methods`)
									}
								/>
								<Menu.Item onClick={() => this.onLogout()}>Sign Out</Menu.Item>
							</Menu.Menu>
						</Fragment>
					) : (
						<Fragment>
							<Menu.Item onClick={() => this.props.history.push("/signin")}>
								Sign In
							</Menu.Item>
						</Fragment>
					)}
					{items.map((item, i) => (
						<Menu.Item
							active={activeItem === item.text}
							key={`${item.link}${i}`}
							name={item.text}
							onClick={() => this.props.history.push(`/${item.link}`)}
						/>
					))}
					<Menu.Item
						key="cart"
						name="cart"
						onClick={() => this.props.history.push("/checkout")}
					>
						<Label circular color="olive">
							{cart.items.length}
						</Label>{" "}
						Cart
					</Menu.Item>
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
	imgVisible: PropTypes.bool,
	inverted: PropTypes.bool,
	items: PropTypes.arrayOf(
		PropTypes.shape({
			link: PropTypes.string,
			text: PropTypes.string
		})
	),
	languages: PropTypes.array,
	logo: PropTypes.string,
	logoText: PropTypes.string,
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
	imgVisible: true,
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
