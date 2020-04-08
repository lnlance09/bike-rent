import "./style.css"
import {
	submitGoogleForm,
	submitLoginForm,
	submitRegistrationForm,
	switchTab,
	verifyEmail
} from "./actions"
import { Provider, connect } from "react-redux"
import { Redirect } from "react-router-dom"
import { FacebookProvider, Login } from "react-facebook"
import { Button, Divider, Form, Header, Icon, Input, Message, Segment } from "semantic-ui-react"
import React, { Component, Fragment } from "react"
import PropTypes from "prop-types"
import store from "store"

class Authentication extends Component {
	constructor(props) {
		super(props)

		const isSignIn = this.props.type === "signin"

		this.state = {
			email: "",
			headerText: this.props.verify ? "Verify your email" : isSignIn ? "Sign In" : "Sign Up",
			loadingLogin: false,
			loadingRegistration: false,
			login: isSignIn,
			name: "",
			password: "",
			regButton: isSignIn ? "Create an account" : "Sign In",
			regEmail: "",
			regPassword: "",
			regText: isSignIn ? "New to bikerent.com?" : "Already have an account?",
			user: {},
			username: "",
			verificationCode: "",
			verify: false
		}

		this.googleResponse = this.googleResponse.bind(this)
		this.onChangeEmail = this.onChangeEmail.bind(this)
		this.onChangePassword = this.onChangePassword.bind(this)

		this.onRegChangeName = this.onRegChangeName.bind(this)
		this.onRegChangeEmail = this.onRegChangeEmail.bind(this)
		this.onRegChangePassword = this.onRegChangePassword.bind(this)
		this.onRegChangeUsername = this.onRegChangeUsername.bind(this)
		this.onChangeVerificationCode = this.onChangeVerificationCode.bind(this)

		this.onClick = this.onClick.bind(this)
		this.redirectToUrl = this.redirectToUrl.bind(this)
		this.submitLoginForm = this.submitLoginForm.bind(this)
		this.submitRegistrationForm = this.submitRegistrationForm.bind(this)
		this.submitEmailVerificationForm = this.submitEmailVerificationForm.bind(this)
	}

	componentDidMount() {}

	googleResponse(e) {
		const accessToken = e.tokenObj.access_token
		const email = e.profileObj.email
		const id = e.profileObj.googleId
		const idToken = e.tokenObj.id_token
		const img = e.profileObj.imageUrl
		const name = e.profileObj.name

		this.props.submitGoogleForm({
			accessToken,
			email,
			id,
			idToken,
			img,
			name
		})
	}

	onClick() {
		const { login } = this.state
		let headerText = "Please verify your email"
		let regButton = ""
		let regText = ""

		if (!this.props.verify) {
			headerText = login ? "Sign Up" : "Sign In"
			regButton = login ? "Sign In" : "Create an account"
			regText = login ? "Already have an account?" : "New to bikerent.com?"
		}

		this.setState(
			{
				headerText,
				loadingLogin: false,
				loadingRegistration: false,
				login: !login,
				regButton,
				regText
			},
			() => {
				this.props.switchTab(login)
			}
		)
	}

	onChangeEmail = (e, { value }) => this.setState({ email: value })

	onChangePassword = (e, { value }) => this.setState({ password: value })

	onChangeVerificationCode = (e, { value }) => this.setState({ verificationCode: value })

	onRegChangeEmail = (e, { value }) => this.setState({ regEmail: value })

	onRegChangeName = (e, { value }) => this.setState({ name: value })

	onRegChangePassword = (e, { value }) => this.setState({ regPassword: value })

	onRegChangeUsername = (e, { value }) => this.setState({ username: value })

	redirectToUrl = url => {
		if (url) {
			window.open(url, "_self")
		}
	}

	submitEmailVerificationForm(e) {
		e.preventDefault()
		if (this.state.verificationCode.length > 3) {
			this.props.verifyEmail({
				bearer: this.props.bearer,
				code: this.state.verificationCode
			})
		}
	}

	submitLoginForm() {
		const { email, password } = this.state
		if (email.length > 0 && password.length > 0) {
			this.setState({ loadingLogin: true }, () => {
				this.props.submitLoginForm({
					email,
					password
				})
			})
		}
	}

	submitRegistrationForm() {
		this.setState({ loadingRegistration: true }, () => {
			this.props.submitRegistrationForm({
				email: this.state.regEmail,
				name: this.state.name,
				password: this.state.regPassword,
				username: this.state.username
			})
		})
	}

	render() {
		const {
			email,
			headerText,
			loadingLogin,
			loadingRegistration,
			login,
			name,
			password,
			regButton,
			regEmail,
			regPassword,
			regText,
			username,
			verificationCode
		} = this.state

		const ErrorMsg = props => {
			if (props.loginError && props.loginErrorMsg) {
				return <Message content={props.loginErrorMsg} error />
			}

			return null
		}

		const FacebookLogin = props => (
			<FacebookProvider appId="123456789">
				<Login scope="email" onCompleted={this.handleResponse} onError={this.handleError}>
					{({ loading, handleClick, error, data }) => {
						return (
							<Fragment>
								<Button
									color="facebook"
									content="Login with Facebook"
									fluid
									onClick={this.handleClick}
								/>
								{loading && <span>Loading...</span>}
							</Fragment>
						)
					}}
				</Login>
			</FacebookProvider>
		)

		const GoogleLogin = props => (
			<Button
				className="googleBtn"
				color="red"
				fluid
				onClick={() => this.redirectToUrl(props.data.user.googleUrl)}
			>
				<Icon name="google" /> {login ? "Sign in" : "Sign up"} with Google
			</Button>
		)

		const MainForm = props => {
			if (props.verify) {
				return (
					<Form onSubmit={this.submitEmailVerificationForm}>
						<Form.Field>
							<Input
								onChange={this.onChangeVerificationCode}
								placeholder="Verification code"
								value={verificationCode}
							/>
						</Form.Field>
						<Button color="green" content="Verify" fluid type="submit" />
					</Form>
				)
			}

			if (login && !props.verify) {
				return (
					<Form loading={loadingLogin && !props.loginError}>
						<Form.Field>
							<Input
								onChange={this.onChangeEmail}
								placeholder="Email or username"
								value={email}
							/>
						</Form.Field>
						<Form.Field>
							<Input
								onChange={this.onChangePassword}
								placeholder="Password"
								type="password"
								value={password}
							/>
						</Form.Field>
						<Form.Field>
							<Button
								color="blue"
								content="Sign in"
								fluid
								onClick={this.submitLoginForm}
								type="submit"
							/>
						</Form.Field>
					</Form>
				)
			}

			if (!login && !props.verify) {
				return (
					<Form loading={loadingRegistration && !props.loginError}>
						<Form.Field>
							<Input
								onChange={this.onRegChangeEmail}
								placeholder="Email"
								value={regEmail}
							/>
						</Form.Field>
						<Form.Field>
							<Input
								onChange={this.onRegChangePassword}
								value={regPassword}
								placeholder="Password"
								type="password"
							/>
						</Form.Field>
						<Form.Field>
							<Input
								autoComplete="off"
								onChange={this.onRegChangeName}
								placeholder="Full name"
								value={name}
							/>
						</Form.Field>
						<Form.Field>
							<Input
								onChange={this.onRegChangeUsername}
								placeholder="Username"
								value={username}
							/>
						</Form.Field>
						<Form.Field>
							<Button
								color="blue"
								content="Create an account"
								fluid
								onClick={this.submitRegistrationForm}
								type="submit"
							/>
						</Form.Field>
					</Form>
				)
			}

			return null
		}

		return this.props.data.user.emailVerified ? (
			<Redirect to="/" />
		) : (
			<Provider store={store}>
				<div className="authComponent">
					<Header as="h1">{headerText}</Header>
					<Segment>
						{MainForm(this.props)}
						{ErrorMsg(this.props)}

						{!this.props.verify && (
							<Fragment>
								<Divider />

								<Segment basic className="registerText" style={{ padding: 0 }}>
									{regText}{" "}
									<span className="registerLink" onClick={this.onClick}>
										{regButton}
									</span>
								</Segment>
							</Fragment>
						)}
					</Segment>

					{!this.props.verify && (
						<Fragment>
							<Divider horizontal>Or</Divider>
							<Segment>
								{GoogleLogin(this.props)}
								<Divider />
								{FacebookLogin(this.props)}
							</Segment>
						</Fragment>
					)}
				</div>
			</Provider>
		)
	}
}

Authentication.propTypes = {
	authenticated: PropTypes.bool,
	bearer: PropTypes.string,
	data: PropTypes.shape({
		cart: PropTypes.array,
		user: PropTypes.shape({
			dateCreated: PropTypes.string,
			email: PropTypes.string,
			emailVerified: PropTypes.bool,
			name: PropTypes.string,
			id: PropTypes.string,
			img: PropTypes.string,
			privilege: PropTypes.string,
			username: PropTypes.string
		})
	}),
	loadingLogin: PropTypes.bool,
	loadingRegistration: PropTypes.bool,
	loginError: PropTypes.bool,
	loginErrorMsg: PropTypes.string,
	submitGoogleForm: PropTypes.func,
	submitLoginForm: PropTypes.func.isRequired,
	submitRegistrationForm: PropTypes.func.isRequired,
	switchTab: PropTypes.func.isRequired,
	type: PropTypes.string,
	verificationCode: PropTypes.string,
	verify: PropTypes.bool,
	verifyEmail: PropTypes.func
}

Authentication.defaultProps = {
	data: {
		user: {}
	},
	submitGoogleForm,
	submitLoginForm,
	submitRegistrationForm,
	switchTab,
	type: "signin",
	verifyEmail
}

const mapStateToProps = (state, ownProps) => ({
	...state.user,
	...ownProps
})

export default connect(mapStateToProps, {
	submitGoogleForm,
	submitLoginForm,
	submitRegistrationForm,
	switchTab,
	verifyEmail
})(Authentication)
