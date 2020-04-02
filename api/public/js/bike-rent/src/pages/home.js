import "react-datepicker/dist/react-datepicker.css"
import { connect, Provider } from "react-redux"
import { DisplayMetaTags } from "utils/metaFunctions"
import { Button, Grid, Input, Select } from "semantic-ui-react"
import React, { Component } from "react"
import DatePicker from "react-datepicker"
import PageFooter from "components/footer/v1/"
import PageHeader from "components/header/v1/"
import PropTypes from "prop-types"
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
			startDate: new Date()
		}
	}

	componentDidMount() {}

	render() {
		const { auth } = this.state
		const { settings } = this.props
		const { homePage } = settings

		const CustomDateInput = ({ value, onClick }) => (
			<Input
				fluid
				icon="calendar"
				iconPosition="left"
				onClick={onClick}
				placeholder="Pick a date"
				value={value}
			/>
		)

		const BookingForm = (
			<Grid columns={3} stackable>
				<Grid.Row>
					<Grid.Column stretched width={6}>
						<DatePicker
							customInput={<CustomDateInput />}
							minDate={new Date()}
							onChange={this.handleChange}
						/>
					</Grid.Column>
					<Grid.Column width={6}>
						<Select
							className="cityDropdown"
							fluid
							// options={timeOptions}
							placeholder="City"
						/>
					</Grid.Column>
					<Grid.Column width={4}>
						<Button color="blue" content="Let's go" fluid size="big" />
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
