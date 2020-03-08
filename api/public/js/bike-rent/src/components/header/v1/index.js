import "./style.css"
import { logout } from "components/authentication/v1/actions"
import { Provider, connect } from "react-redux"
import { Link } from "react-router-dom"
import { ReactSVG } from "react-svg"
import {
	Button,
	Container,
	Divider,
	Dropdown,
	Grid,
	Icon,
	Image,
	Input,
	Menu,
	Responsive,
	Sidebar
} from "semantic-ui-react"
import LoadingBar from "react-redux-loading-bar"
import Logo from "./images/logo.svg"
import PropTypes from "prop-types"
import React, { Component } from "react"
import store from "store"
import Url from "url-parse"

class Header extends Component {
	constructor(props) {
		super(props)
		this.state = {
			activeItem: "",
			value: "",
			visible: false
		}

		this.onLogout = this.onLogout.bind(this)
	}

	handleItemClick = (key, name) => {
		this.setState({ activeItem: name, visible: false })
		this.props.history.push(`/fallacies/${key}`)
	}

	onLogout() {
		this.props.logout()
		const parsed = new Url(window.location)
		if (parsed.pathname !== "/") {
			window.location.reload()
		}
	}

	render() {
		const { activeItem, value, visible } = this.state

		const languageOptions = [
			{ key: 'Arabic', text: 'Arabic', value: 'Arabic' },
			{ key: 'Chinese', text: 'Chinese', value: 'Chinese' },
			{ key: 'Danish', text: 'Danish', value: 'Danish' },
			{ key: 'Dutch', text: 'Dutch', value: 'Dutch' },
			{ key: 'English', text: 'English', value: 'English' },
			{ key: 'French', text: 'French', value: 'French' },
			{ key: 'German', text: 'German', value: 'German' }
		]

		const LoginButton = props => {
			if (props.authenticated) {
				const trigger = (
					<Image
						avatar
						bordered
						circular
						// onError={i => (i.target.src = ImagePic)}
						rounded
						// src={props.data.img ? props.data.img : ImagePic}
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
								<Dropdown.Divider />
								<Dropdown.Item
									onClick={() =>
										props.history.push(
											`/users/${props.data.username}orders`
										)
									}
									text="My Orders"
								/>
								<Dropdown.Divider />
								<Dropdown.Item
									onClick={() => props.history.push(`/settings`)}
									text="Settings"
								/>
								<Dropdown.Item onClick={this.onLogout} text="Log out" />
							</Dropdown.Menu>
						</Dropdown>
					</Menu.Item>
				)
			} else {
				return (
					<Menu.Item position="right">
						{TranslationDropdown}
						<Button
							content="Sign Up"
							onClick={() => props.history.push("/signin?type=join")}
							primary
						/>
						<Button
							className="signInBtn"
							color="blue"
							content="Sign In"
							onClick={() => props.history.push("/signin?type=signin")}
							secondary
						/>
					</Menu.Item>
				)
			}
		}

		const TranslationDropdown = (
			<Dropdown
				className="translationDropdown"
				options={languageOptions}
				text="English"
			/>
		)

		return (
			<Provider store={store}>
				<div className="pageHeader">
					<Menu borderless className="globalHeader" fitted="vertically">
						<Container className="headerContainer">
							<Responsive className="responsive" maxWidth={1024}>
								<Menu.Item className="headerMenuItem">

								</Menu.Item>
								<Menu.Item className="sidebarItem" position="right">
									<Icon
										name="sidebar"
										onClick={() =>
											this.setState({
												visible: !visible
											})
										}
										size="large"
									/>
								</Menu.Item>
							</Responsive>

							<Responsive className="responsive" minWidth={1025}>
								<Menu.Item className="headerMenuItem">
									<ReactSVG
										className="headerLogo"
										evalScripts="always"
										onClick={() => {
											this.props.history.push("/")
										}}
										src={Logo}
										svgClassName="svgHeaderLogo"
									/>
								</Menu.Item>
								{LoginButton(this.props)}
							</Responsive>
						</Container>
					</Menu>
					<LoadingBar className="loadingBar" />
				</div>
			</Provider>
		)
	}
}

Header.defaultProps = {
	authenticated: false,
	logout
}

Header.propTypes = {
	authenticated: PropTypes.bool,
	logout: PropTypes.func
}

const mapStateToProps = (state, ownProps) => ({
	...state.user,
	...ownProps
})

export default connect(mapStateToProps, { logout })(Header)