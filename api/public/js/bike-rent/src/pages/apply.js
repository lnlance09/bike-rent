import { submitApplication } from "redux/actions/app"
import { connect, Provider } from "react-redux"
import { DisplayMetaTags } from "utils/metaFunctions"
import {
	Button,
	Container,
	Form,
	Header,
	Input,
	Message,
	Segment,
	TextArea
} from "semantic-ui-react"
import PageFooter from "components/primary/footer/v1/"
import PageHeader from "components/primary/header/v1/"
import React, { Component } from "react"
import PropTypes from "prop-types"
import store from "store"

class Apply extends Component {
	constructor(props) {
		super(props)

		const currentState = store.getState()
		const user = currentState.user
		const auth = user.authenticated
		const bearer = user.bearer

		this.state = {
			auth,
			bearer,
			email: "",
			msg: "",
			name: ""
		}
	}

	componentDidMount() {}

	onChangeEmail = (e, { value }) => this.setState({ email: value })

	onChangeMsg = (e, { value }) => this.setState({ msg: value })

	onChangeName = (e, { value }) => this.setState({ name: value })

	resetState = () => {
		this.setState({ email: "", msg: "", name: "" })
	}

	render() {
		const { auth, email, msg, name } = this.state
		const { error, errorMsg, settings } = this.props
		const { applyPage } = settings

		return (
			<Provider store={store}>
				<DisplayMetaTags
					page="apply"
					props={this.props}
					seo={applyPage.seo}
					state={this.state}
				/>

				<div className="mainWrapper applyPage">
					<PageHeader
						activeItem="apply"
						authenticated={auth}
						backgroundColor={settings.header.backgroundColor}
						backgroundImage={applyPage.hero.img}
						headerOne={applyPage.hero.headerOne}
						headerTwo={applyPage.hero.headerTwo}
						items={settings.header.items}
						language={settings.language}
						languages={settings.languages}
						logo={settings.header.logo}
						logoText={settings.header.logoText}
						showMainContent={applyPage.useHeroImage === "1"}
						signInButton={settings.header.signInButton}
						signUpButton={settings.header.signUpButton}
						{...this.props}
					/>

					<Container className="mainContainer">
						<Header as="h1">
							{applyPage.title}
							<Header.Subheader>{applyPage.description}</Header.Subheader>
						</Header>

						<Segment>
							<Form error={error}>
								<Form.Field>
									<Input
										onChange={this.onChangeName}
										placeholder="Name"
										value={name}
									/>
								</Form.Field>
								<Form.Field>
									<Input
										onChange={this.onChangeEmail}
										placeholder="Email"
										value={email}
									/>
								</Form.Field>
								<Form.Field>
									<TextArea
										onChange={this.onChangeMsg}
										placeholder="Tell us why you're applying"
										rows={10}
										value={msg}
									/>
								</Form.Field>
								<Form.Field>
									<Button
										color="blue"
										content="Apply"
										fluid
										onClick={() =>
											this.props.submitApplication({
												callback: this.resetState,
												email,
												msg,
												name
											})
										}
										type="submit"
									/>
								</Form.Field>
								{error && <Message content={errorMsg} error />}
							</Form>
						</Segment>

						<div dangerouslySetInnerHTML={{ __html: applyPage.content }} />
					</Container>

					<PageFooter footerData={settings.footer} history={this.props.history} />
				</div>
			</Provider>
		)
	}
}

Apply.propTypes = {
	error: PropTypes.bool,
	errorMsg: PropTypes.string,
	settings: PropTypes.object,
	submitApplication: PropTypes.func
}

Apply.defaultProps = {
	error: false,
	submitApplication
}

const mapStateToProps = (state, ownProps) => {
	return {
		...state.app.apply,
		...ownProps
	}
}

export default connect(mapStateToProps, {
	submitApplication
})(Apply)
