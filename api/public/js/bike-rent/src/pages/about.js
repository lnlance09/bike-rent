import { connect, Provider } from "react-redux"
import { Container } from "semantic-ui-react"
import { DisplayMetaTags } from "utils/metaFunctions"
import PageFooter from "components/footer/v1/"
import PageHeader from "components/header/v1/"
import React, { Component } from "react"
import PropTypes from "prop-types"
import store from "store"

class About extends Component {
	constructor(props) {
		super(props)

		const currentState = store.getState()
		const user = currentState.user
		const auth = user.authenticated
		const bearer = user.bearer

		this.state = {
			auth,
			bearer
		}
	}

	componentDidMount() {}

	render() {
		const { auth } = this.state
		const { settings } = this.props
		const { aboutPage } = settings

		return (
			<Provider store={store}>
				<DisplayMetaTags
					page="about"
					props={this.props}
					seo={aboutPage.seo}
					state={this.state}
				/>

				<div className="mainWrapper aboutPage">
					<PageHeader
						activeItem="about"
						authenticated={auth}
						backgroundColor={settings.header.backgroundColor}
						backgroundImage={aboutPage.hero.img}
						headerOne={aboutPage.hero.headerOne}
						headerTwo={aboutPage.hero.headerTwo}
						items={settings.header.items}
						language={settings.language}
						languages={settings.languages}
						logo={settings.header.logo}
						logoText={settings.header.logoText}
						showMainContent={aboutPage.useHeroImage === "1"}
						signInButton={settings.header.signInButton}
						signUpButton={settings.header.signUpButton}
						{...this.props}
					/>

					<Container className="mainContainer">
						<div dangerouslySetInnerHTML={{ __html: aboutPage.content }} />
					</Container>

					<PageFooter footerData={settings.footer} history={this.props.history} />
				</div>
			</Provider>
		)
	}
}

About.propTypes = {
	settings: PropTypes.object
}

About.defaultProps = {}

const mapStateToProps = (state, ownProps) => {
	return {
		...state.app,
		...ownProps
	}
}

export default connect(mapStateToProps, {})(About)
