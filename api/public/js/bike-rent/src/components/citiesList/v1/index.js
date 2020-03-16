import "./style.css"
import { getCities, toggleLoading, updateSearchTerm } from "./actions"
import { adjustTimezone } from "utils/dateFunctions"
import { formatPlural } from "utils/textFunctions"
import { DebounceInput } from "react-debounce-input"
import { connect, Provider } from "react-redux"
import {
	Card,
	Dropdown,
	Form,
	Header,
	Icon,
	Image,
	Item,
	Label,
	Message,
	Placeholder,
	Segment,
	Visibility
} from "semantic-ui-react"
import ImagePic from "images/avatar/brain-fart.gif"
import LazyLoad from "components/lazyLoad/v1/"
import Marked from "marked"
import Moment from "react-moment"
import PropTypes from "prop-types"
import React, { Component } from "react"
import ResultItem from "components/item/v1/"
import store from "store"

class CitiesList extends Component {
	constructor(props) {
		super(props)

		const showFilter = this.props.source !== "fallacy"
		let value = this.props.fallacies ? this.props.fallacies : ""
		if (this.props.source === "tag") {
			value = this.props.assignedTo
		}

		this.state = {
			loadingMore: false,
			options: [],
			showFilter,
			sortValue: "date",
			value
		}

		this.onChangeSearch = this.onChangeSearch.bind(this)
		this.onChangeSort = this.onChangeSort.bind(this)
	}

	componentDidMount() {
		this.props.updateSearchTerm({ q: "" })

		this.props.getCities({
			page: 0
		})
	}

	componentDidUpdate(prevProps) {
		if (prevProps !== this.props) {
			this.props.getCities({
				page: newPage,
				sort: this.state.sortValue
			})
		}
	}

	loadMore = () => {
		if (this.props.hasMore && !this.props.loadingMore) {
			const newPage = parseInt(this.props.page + 1, 10)
			this.props.toggleLoading()
			this.props.getCities({
				page: newPage,
				sort: this.state.sortValue
			})
		}
	}

	onChangeInput = q => {
		this.props.updateSearchTerm({ q })
		this.props.getFallacies({
			page: 0,
			sort: this.state.sortValue
		})
	}

	onChangeSearch = (e, { text, value }) => {
		this.setState({ value }, () => {
			this.props.getFallacies({
				page: 0,
				sort: this.state.sortValue
			})
		})
	}

	onChangeSort = (e, { value }) => {
		this.setState({ value }, () => {
			this.props.getFallacies({
				page: 0,
				sort: this.state.sortValue
			})
		})
	}

	redirectToUrl = (e, url) => {
		if (!e.metaKey) {
			this.props.history.push(url)
		} else {
			window.open(url, "_blank").focus()
		}
	}

	render() {
		const { options, showFilter, sortValue, value } = this.state
		const { q, source } = this.props
		const placeholder = source === "tag" ? "Filter by page" : "Filter by fallacy"

		const FilterSection = props => {
			const filterVisible = showFilter && !showTargets
			return (
				<div className="fallacyFilter">
					{source === "users" && (
						<Message
							className="targetMsg"
							content={
								<div>
									{props.targets.count}{" "}
									{formatPlural(props.targets.count, "target")} -{" "}
									<span
										className="viewAllTargets"
										onClick={e => {
											e.preventDefault()
											this.setState({ showTargets: showTargets === false })
										}}
									>
										{showTargets ? "View all fallacies" : "View all targets"}
									</span>
								</div>
							}
							header={`See who has been on ${props.name}'s radar`}
							icon="crosshairs"
						/>
					)}
					{filterVisible && (
						<div>
							<Form>
								<Form.Field>
									<div className="ui icon input">
										<DebounceInput
											debounceTimeout={300}
											minLength={2}
											onChange={e => this.onChangeInput(e.target.value)}
											placeholder="Search..."
											value={q}
										/>
										<i aria-hidden="true" className="search icon" />
									</div>
								</Form.Field>
								<Form.Group widths="equal">
									<Form.Field
										clearable
										control={Dropdown}
										fluid
										lazyLoad
										onChange={this.onChangeSearch}
										options={options}
										placeholder={placeholder}
										selection
										value={value}
									/>
									<Form.Field
										control={Dropdown}
										fluid
										lazyLoad
										onChange={this.onChangeSort}
										options={[
											{ key: "date", text: "Date", value: "date" },
											{ key: "views", text: "Views", value: "views" }
										]}
										placeholder="Sort by"
										selection
										value={sortValue}
									/>
								</Form.Group>
							</Form>
							<div style={{ margin: "16px 0" }}>
								{value && (
									<FallacyRef
										canScreenshot={false}
										className="fallacyRef"
										id={parseInt(value, 10)}
									/>
								)}
							</div>
						</div>
					)}
				</div>
			)
		}

		const RenderFallacies = ({ props }) => {
			return props.results.map((result, i) => {
				if (props.useCards) {
					if (result.id) {
						let img = result.page_profile_pic ? result.page_profile_pic : ImagePic
						let meta = (
							<div>
								<p>
									<b>{result.user_name}</b>{" "}
									<Icon color="green" name="arrow right" />{" "}
									<b>{result.page_name}</b>
								</p>
							</div>
						)
						const url = `/fallacies/${result.slug}`
						return (
							<Card key={result.id} onClick={e => this.redirectToUrl(e, url)}>
								{props.usePics && (
									<div className="image parent">
										<div
											className="one"
											style={{ backgroundImage: `url(${img})` }}
										/>
										<div
											className="two"
											style={{ backgroundImage: `url(${result.user_img})` }}
										/>
									</div>
								)}
								<Card.Content>
									{!props.usePics && (
										<Image
											bordered
											circular
											floated="right"
											onError={i => (i.target.src = ImagePic)}
											size="mini"
											src={img}
										/>
									)}
									<Card.Header>{result.title}</Card.Header>
									<Card.Meta>{meta}</Card.Meta>
									<Card.Meta>
										{result.network === "youtube" && (
											<b>
												<Icon className="youtubeIcon" name="youtube" />{" "}
											</b>
										)}
										{result.network === "twitter" && (
											<b>
												<Icon className="twitterIcon" name="twitter" />{" "}
											</b>
										)}
										<Moment
											date={adjustTimezone(result.date_created)}
											fromNow
										/>
									</Card.Meta>
									<Card.Description
										dangerouslySetInnerHTML={{
											__html:
												result.explanation !== undefined &&
												result.explanation !== null
													? Marked(result.explanation)
													: null
										}}
									/>
								</Card.Content>
								<Card.Content extra>
									<span style={{ lineHeight: "1.7" }}>
										<Icon name="eye" />
										<b>{result.view_count} views</b>
									</span>{" "}
									<span style={{ float: "right" }}>
										<Label basic>{result.fallacy_name}</Label>
									</span>
								</Card.Content>
							</Card>
						)
					} else {
						return (
							<Card key={`fallacyCard${i}`}>
								{props.usePics && (
									<Placeholder>
										<Placeholder.Image square />
									</Placeholder>
								)}
								<Card.Content>
									<Placeholder>
										<Placeholder.Header>
											<Placeholder.Line length="very long" />
											<Placeholder.Line length="medium" />
										</Placeholder.Header>
										<Placeholder.Paragraph>
											<Placeholder.Line length="short" />
										</Placeholder.Paragraph>
									</Placeholder>
								</Card.Content>
							</Card>
						)
					}
				}

				if (result.id) {
					let img =
						props.assignedBy || source === "fallacy" || source === "tag"
							? result.page_profile_pic
							: result.user_img
					let meta = (
						<div>
							<p>
								<b>{result.page_name}</b> <Icon color="green" name="arrow left" />{" "}
								<b>{result.user_name}</b>
							</p>
							<p>
								<Icon name="clock outline" />
								<Moment date={adjustTimezone(result.date_created)} fromNow />
							</p>
						</div>
					)

					return (
						<ResultItem
							description={result.explanation}
							history={props.history}
							id={`fallacy_${i}`}
							img={props.showPics ? img : null}
							key={`fallacy_${i}`}
							meta={meta}
							tags={[result.fallacy_name]}
							title={result.title}
							type="fallacy"
							url={`/fallacies/${result.slug}`}
							useMarked
						/>
					)
				}

				return <LazyLoad key={`target_${i}`} />
			})
		}

		return (
			<Provider store={store}>
				<div className="fallaciesList">
					{FilterSection(this.props)}
					{this.props.results.length > 0 ? (
						<div>
							<Visibility
								className="fallaciesWrapper"
								continuous
								onBottomVisible={this.loadMore}
							>
								{showTargets ? (
									<div style={{ marginTop: "16px" }}>
										{this.props.useCards ? (
											<Card.Group
												itemsPerRow={this.props.itemsPerRow}
												stackable
											>
												<RenderTargets props={this.props} />
											</Card.Group>
										) : (
											<Item.Group divided>
												<RenderTargets props={this.props} />
											</Item.Group>
										)}
									</div>
								) : this.props.useCards ? (
									<Card.Group itemsPerRow={this.props.itemsPerRow} stackable>
										<RenderFallacies props={this.props} />
									</Card.Group>
								) : (
									<Item.Group className="fallacyItems" divided>
										<RenderFallacies props={this.props} />
									</Item.Group>
								)}
							</Visibility>
						</div>
					) : (
						<div className="emptyFallaciesContainer">
							<Segment placeholder>
								<Header icon>
									<Icon
										className={`${this.props.icon}Icon`}
										name={this.props.icon}
									/>
									{this.props.emptyMsgContent}
								</Header>
							</Segment>
						</div>
					)}
				</div>
			</Provider>
		)
	}
}

CitiesList.propTypes = {
	changeUrl: PropTypes.bool,
	commentId: PropTypes.string,
	emptyMsgContent: PropTypes.string,
	exclude: PropTypes.array,
	fallacies: PropTypes.string,
	fallacyId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	getFallacies: PropTypes.func,
	getTargets: PropTypes.func,
	hasMore: PropTypes.bool,
	icon: PropTypes.string,
	itemsPerRow: PropTypes.number,
	loadingMore: PropTypes.bool,
	name: PropTypes.string,
	network: PropTypes.string,
	objectId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	page: PropTypes.number,
	q: PropTypes.string,
	results: PropTypes.array,
	setFallacyId: PropTypes.func,
	showPics: PropTypes.bool,
	shuffle: PropTypes.bool,
	source: PropTypes.string,
	tagId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	targets: PropTypes.shape({
		count: PropTypes.number,
		hasMore: PropTypes.bool,
		loadingMore: PropTypes.bool,
		page: PropTypes.number,
		pages: PropTypes.number,
		results: PropTypes.array
	}),
	toggleLoading: PropTypes.func,
	updateSearchTerm: PropTypes.func,
	useCards: PropTypes.bool
}

CitiesList.defaultProps = {
	changeUrl: false,
	emptyMsgContent: "Try searching something else...",
	fallacies: "",
	getFallacies,
	icon: "tweet",
	itemsPerRow: 3,
	loadingMore: false,
	page: 0,
	q: "",
	results: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
	showPics: true,
	toggleLoading,
	updateSearchTerm,
	useCards: true
}

const mapStateToProps = (state, ownProps) => ({
	...state.cities,
	...ownProps
})

export default connect(
	mapStateToProps,
	{ getCities, toggleLoading, updateSearchTerm }
)(CitiesList)
