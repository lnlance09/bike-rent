import "react-datepicker/dist/react-datepicker.css"
import { connect, Provider } from "react-redux"
import { Link } from "react-router-dom"
import {
	Button,
	Container,
	Divider,
	Form,
	Grid,
	Header,
	Icon,
	Image,
	Input,
	List,
	Message,
	Segment,
	Select,
	TextArea
} from "semantic-ui-react"
import { timeOptions } from "utils/timeOptions"
import DatePicker from "react-datepicker"
import PageFooter from "components/footer/v1/"
import PageHeader from "components/header/v1/"
import PropTypes from "prop-types"
import React, { Component } from "react"
import store from "store"

class Home extends Component {
	constructor(props) {
		super(props)

		const currentState = store.getState()
		const user = currentState.user
		const auth = user.authenticated
		const bearer = user.bearer

		this.state = {
			startDate: new Date()
		}
	}

	componentDidMount() {}

	handleChange = date => {
		this.setState({ startDate: date })
	}

	render() {
		const { startDate } = this.state
		const {} = this.props

		const CustomDateInput = ({ value, onClick }) => (
			<Input
				className="example-custom-input"
				icon="calendar"
				iconPosition="left"
				onClick={onClick}
				value={value}
			/>
		)

		const BookingForm = (
			<Form size="big">
				<Form.Group widths='equal'>
					<div className="field">
						<DatePicker
							customInput={<CustomDateInput />}
							minDate={new Date()}
							onChange={this.handleChange}
							selected={startDate}
						/>
					</div>
					<Form.Field
						control={Select}
						icon="clock"
						iconPosition="left"
						options={timeOptions}
						placeholder="Time"
					/>
					<Form.Field
						control={Select}
						// options={genderOptions}
						placeholder='Gender'
						search
						searchInput={{ id: 'form-select-control-gender' }}
					/>
					<Form.Field>
						<Button
							color="blue"
							content="Let's go"
							fluid
							size="big"
						/>
					</Form.Field>
				</Form.Group>
			</Form>
		)

		const HomePageContent = (
			<div>
				<Segment className="homePageSegment paddedSegment" vertical>
					<Grid container stackable verticalAlign='middle'>
						<Grid.Row>
							<Grid.Column width={8}>
								<Header as='h3'>
									We Help Companies and Companions
								</Header>
								<p>
									We can give your company superpowers to do things that they never thought possible.
									Let us delight your customers and empower your needs... through pure data analytics.
								</p>
								<Header as='h3'>
									We Make Bananas That Can Dance
								</Header>
								<p>
									Yes that's right, you thought it was the stuff of dreams, but even bananas can be
									bioengineered.
								</p>
							</Grid.Column>
							<Grid.Column floated='right' width={6}>
								<Image bordered rounded size='large' src='/images/wireframe/white-image.png' />
							</Grid.Column>
						</Grid.Row>
						<Grid.Row>
							<Grid.Column textAlign='center'>
								<Button size='huge'>Check Them Out</Button>
							</Grid.Column>
						</Grid.Row>
					</Grid>
				</Segment>

				<Segment className="homePageSegment notPaddedSegment" vertical>
					<Grid celled='internally' columns='equal' stackable>
						<Grid.Row textAlign='center'>
							<Grid.Column>
								<Header as='h3'>
									"What a Company"
								</Header>
								<p>That is what they all say about us</p>
							</Grid.Column>
							<Grid.Column>
								<Header as='h3'>
									"I shouldn't have gone with their competitor."
								</Header>
								<p>
									<Image avatar src='/images/avatar/large/nan.jpg' />
									<b>Nan</b> Chief Fun Officer Acme Toys
								</p>
							</Grid.Column>
						</Grid.Row>
					</Grid>
				</Segment>

				<Segment className="homePageSegment paddedSegment" vertical>
					<Container text>
						<Header as='h3'>
							Breaking The Grid, Grabs Your Attention
						</Header>
						<p>
							Instead of focusing on content creation and hard work, we have learned how to master the
							art of doing nothing by providing massive amounts of whitespace and generic content that
							can seem massive, monolithic and worth your attention.
						</p>
						<Button as='a' size='large'>
							Read More
						</Button>

						<Divider
							as='h4'
							className='header'
							horizontal
						>
							<a href='#'>Case Studies</a>
						</Divider>

						<Header as='h3'>
							Did We Tell You About Our Bananas?
						</Header>
						<p>
							Yes I know you probably disregarded the earlier boasts as non-sequitur filler content, but
							it's really true. It took years of gene splicing and combinatory DNA research, but our
							bananas can really dance.
						</p>
						<Button as='a' size='large'>
							I'm Still Quite Interested
						</Button>
					</Container>
				</Segment>
			</div>
		)

		return (
			<Provider store={store}>
				<div className="homePage">
					<PageHeader {...this.props} />

					<div className="assignContainer">
						<Container className="mainContainer" textAlign="center">
							<Header as="h1" className="heroHeader" size="huge">
								Pick up a bike today
							</Header>
							<Segment className="heroSegment">
								{BookingForm}
							</Segment>
						</Container>
					</div>

					{HomePageContent}

					<PageFooter />
				</div>
			</Provider>
		)
	}
}

Home.propTypes = {}

Home.defaultProps = {}

const mapStateToProps = (state, ownProps) => {
	return {
		...state.home,
		...ownProps
	}
}

export default connect(mapStateToProps, {})(Home)