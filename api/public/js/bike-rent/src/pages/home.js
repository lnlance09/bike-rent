import "react-datepicker/dist/react-datepicker.css"
import { connect, Provider } from "react-redux"
import { DisplayMetaTags } from "utils/metaFunctions"
import {
	Button,
	Container,
	Divider,
	Grid,
	Header,
	Image,
	Input,
	Segment,
	Select
} from "semantic-ui-react"
import React, { Component, Fragment } from "react"
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

		const HomePageContent = (
			<div>
				<Segment className="homePageSegment paddedSegment" vertical>
					<Grid container stackable verticalAlign="middle">
						<Grid.Row>
							<Grid.Column width={8}>
								{homePage.firstSection.items.map(item => (
									<Fragment>
										<Header as="h3">{item.title}</Header>
										<p>{item.subtitle}</p>
									</Fragment>
								))}
							</Grid.Column>
							<Grid.Column floated="right" width={6}>
								<Image
									bordered
									rounded
									size="large"
									src={homePage.firstSection.img}
								/>
							</Grid.Column>
						</Grid.Row>
						<Grid.Row>
							<Grid.Column textAlign="center">
								<Button
									basic={homePage.firstSection.button.basic}
									color={homePage.firstSection.button.color}
									inverted={homePage.firstSection.button.inverted}
									onClick={() => {
										this.props.history.push(homePage.firstSection.button.link)
									}}
									size="huge"
								>
									{homePage.firstSection.button.text}
								</Button>
							</Grid.Column>
						</Grid.Row>
					</Grid>
				</Segment>

				<Segment className="homePageSegment notPaddedSegment" vertical>
					<Grid celled="internally" columns="equal" stackable>
						<Grid.Row textAlign="center">
							<Grid.Column>
								<Header as="h3">{homePage.secondSection.leftItem.title}</Header>
								<p>{homePage.secondSection.leftItem.subtitle}</p>
							</Grid.Column>
							<Grid.Column>
								<Header as="h3">{homePage.secondSection.rightItem.title}</Header>
								<p>{homePage.secondSection.rightItem.subtitle}</p>
							</Grid.Column>
						</Grid.Row>
					</Grid>
				</Segment>

				<Segment className="homePageSegment paddedSegment" vertical>
					<Container text>
						<Header as="h3">{homePage.thirdSection.firstItem.title}</Header>
						<p>{homePage.thirdSection.firstItem.subtitle}</p>

						<Divider as="h4" className="header" horizontal>
							{homePage.thirdSection.divider.text}
						</Divider>

						<Header as="h3">{homePage.thirdSection.secondItem.title}</Header>
						<p>{homePage.thirdSection.secondItem.subtitle}</p>
					</Container>
				</Segment>
			</div>
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
						content={BookingForm}
						items={settings.header.items}
						language={settings.language}
						languages={settings.languages}
						showMainContent
						signInButton={settings.header.signInButton}
						signUpButton={settings.header.signUpButton}
						{...this.props}
					/>

					{HomePageContent}

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
