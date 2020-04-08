import { connect, Provider } from "react-redux"
import { sendContactMsg } from "redux/actions/app"
import { DisplayMetaTags } from "utils/metaFunctions"
import { Button, Container, Form, Header, TextArea } from "semantic-ui-react"
import PageFooter from "components/footer/v1/"
import PageHeader from "components/header/v1/"
import React, { Component } from "react"
import PropTypes from "prop-types"
import store from "store"

class Contact extends Component {
	constructor(props) {
		super(props)

		const currentState = store.getState()
		const user = currentState.user
		const auth = user.authenticated
		const bearer = user.bearer

		this.state = {
			auth,
			bearer,
			msg: ""
		}
	}

	componentDidMount() {}

	onChangeMsg = (e, { value }) => this.setState({ msg: value })

	render() {
		const { auth, msg } = this.state
		const { settings } = this.props
		const { contactPage } = settings

		return (
			<Provider store={store}>
				<DisplayMetaTags
					page="contact"
					props={this.props}
					seo={contactPage.seo}
					state={this.state}
				/>

				<div className="mainWrapper contactPage">
					<PageHeader
						activeItem="contact"
						authenticated={auth}
						backgroundColor={settings.header.backgroundColor}
						backgroundImage={contactPage.hero.img}
						headerOne={contactPage.hero.headerOne}
						headerTwo={contactPage.hero.headerTwo}
						items={settings.header.items}
						language={settings.language}
						languages={settings.languages}
						logo={settings.header.logo}
						logoText={settings.header.logoText}
						showMainContent={contactPage.useHeroImage === "1"}
						signInButton={settings.header.signInButton}
						signUpButton={settings.header.signUpButton}
						{...this.props}
					/>

					<Container className="mainContainer">
						<Header size="huge">
							{contactPage.title}
							<Header.Subheader>{contactPage.description}</Header.Subheader>
						</Header>

						<Form>
							<Form.Field>
								<TextArea
									onChange={this.onChangeMsg}
									placeholder={contactPage.placeholderText}
									rows={8}
									value={msg}
								/>
							</Form.Field>
							<Button
								color="blue"
								content="Send"
								disabled={msg.length < 15}
								onClick={() => {
									if (msg.length > 15) {
										this.props.sendContactMsg({
											callback: () => {
												this.setState({ msg: "" })
											},
											msg,
											toastMsg: contactPage.toastMsg
										})
									}
								}}
							/>
						</Form>

						<div dangerouslySetInnerHTML={{ __html: contactPage.content }} />
					</Container>

					<PageFooter footerData={settings.footer} history={this.props.history} />
				</div>
			</Provider>
		)
	}
}

Contact.propTypes = {
	sendContactMsg: PropTypes.func,
	settings: PropTypes.object
}

Contact.defaultProps = {
	sendContactMsg
}

const mapStateToProps = (state, ownProps) => {
	return {
		...state.app,
		...ownProps
	}
}

export default connect(mapStateToProps, {
	sendContactMsg
})(Contact)
