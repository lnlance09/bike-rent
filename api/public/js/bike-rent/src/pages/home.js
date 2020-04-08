import "react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css"
import { connect, Provider } from "react-redux"
import { DisplayMetaTags } from "utils/metaFunctions"
import { fetchCities } from "utils/selectOptions"
import { Button, Grid, Input, Select } from "semantic-ui-react"
import React, { Component } from "react"
import PageFooter from "components/footer/v1/"
import PageHeader from "components/header/v1/"
import PropTypes from "prop-types"
import SemanticDatepicker from "react-semantic-ui-datepickers"
import store from "store"

class Home extends Component {
	constructor(props) {
		super(props)

		const currentState = store.getState()
		const user = currentState.user
		const auth = user.authenticated
		const bearer = user.bearer

		this.state = {
			auth,
			bearer,
			city: "",
			cityOptions: [],
			citySlug: "",
			date: new Date()
		}
	}

	async componentDidMount() {
		const cityOptions = await fetchCities("")
		this.setState({ cityOptions })
	}

	onChangeCity = (e, { value }) => {
		const { cityOptions } = this.state
		const { name } = cityOptions.find(city => city.value === value)
		this.setState({ city: value, citySlug: `${name.toLowerCase()}-${value}` })
	}

	onChangeDate = (e, { value }) => this.setState({ date: value })

	render() {
		const { auth, city, cityOptions, citySlug, date } = this.state
		const { settings } = this.props
		const { homePage } = settings

		const BookingForm = (
			<Grid columns={3} stackable>
				<Grid.Row>
					<Grid.Column className="datePicker" stretched width={6}>
						<SemanticDatepicker
							datePickerOnly
							format="MMM Do, YYYY"
							locale="en-US"
							onChange={this.onChangeDate}
							type="basic"
							value={date}
						/>
					</Grid.Column>
					<Grid.Column width={6}>
						<Select
							className="cityDropdown"
							fluid
							onChange={this.onChangeCity}
							options={cityOptions}
							placeholder="City"
						/>
					</Grid.Column>
					<Grid.Column width={4}>
						<Button
							color="blue"
							content="Let's go"
							fluid
							onClick={() => {
								if (city !== "") {
									this.props.history.push(`/cities/${citySlug}`)
								}
							}}
							size="big"
						/>
					</Grid.Column>
				</Grid.Row>
			</Grid>
		)

		return (
			<Provider store={store}>
				<DisplayMetaTags
					page="home"
					props={this.props}
					seo={homePage.seo}
					state={this.state}
				/>

				<div className="mainWrapper homePage">
					<PageHeader
						activeItem="home"
						authenticated={auth}
						content={BookingForm}
						backgroundColor={settings.header.backgroundColor}
						backgroundImage={homePage.hero.img}
						headerOne={homePage.hero.headerOne}
						headerTwo={homePage.hero.headerTwo}
						items={settings.header.items}
						language={settings.language}
						languages={settings.languages}
						showMainContent={homePage.useHeroImage === "1"}
						signInButton={settings.header.signInButton}
						signUpButton={settings.header.signUpButton}
						{...this.props}
					/>

					<div dangerouslySetInnerHTML={{ __html: homePage.content }} />

					<PageFooter footerData={settings.footer} history={this.props.history} />
				</div>
			</Provider>
		)
	}
}

Home.propTypes = {
	settings: PropTypes.object
}

Home.defaultProps = {}

const mapStateToProps = (state, ownProps) => {
	return {
		...state.app,
		...ownProps
	}
}

export default connect(mapStateToProps, {})(Home)
