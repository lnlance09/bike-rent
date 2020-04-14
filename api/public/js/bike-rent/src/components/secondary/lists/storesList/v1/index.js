import "./style.css"
import { fetchCities } from "utils/selectOptions"
import { getStores, getStoresByBike, toggleLoading } from "./actions"
import { connect, Provider } from "react-redux"
import { Card, Divider, Dropdown, Header, Item, List, Segment, Visibility } from "semantic-ui-react"
import React, { Component, Fragment } from "react"
import LazyLoad from "components/primary/lazyLoad/v1/"
import PropTypes from "prop-types"
import ResultItem from "components/primary/item/v1/"
import store from "store"

class StoresList extends Component {
	constructor(props) {
		super(props)

		this.state = {
			cityId: "",
			loadingMore: false,
			options: []
		}
	}

	async componentDidMount() {
		const options = await fetchCities("")
		this.setState({ options })

		if (this.props.storesByBike) {
			this.props.getStoresByBike({
				bikeId: this.props.bikeId,
				cityId: this.props.cityId,
				page: 0,
				showHidden: 0,
				storeId: this.props.storeId
			})
		} else {
			this.props.getStores({
				cityId: this.props.cityId,
				page: 0,
				showHidden: 0,
				storeId: this.props.storeId
			})
		}
	}

	loadMore = () => {
		if (this.props.hasMore && !this.props.loadingMore) {
			// const newPage = parseInt(this.props.page + 1, 10)
			this.props.toggleLoading()
			this.props.getStore({ page: 0 })
		}
	}

	onChangeCity = (e, { value }) => {
		this.setState({ cityId: value }, () => {
			this.props.getStores({
				cityId: value,
				page: 0
			})
		})
	}

	render() {
		const { options } = this.state
		const {
			emptyMsgContent,
			extra,
			itemsPerRow,
			results,
			showCityFilter,
			useCards
		} = this.props

		const RenderItems = ({ props }) => {
			return props.results.map((result, i) => {
				if (result.id) {
					return (
						<ResultItem
							description={result.description}
							extra={extra}
							history={props.history}
							id={`${props.key}${i}`}
							img={props.showPics ? result.image : null}
							key={`${props.key}${i}`}
							meta={
								<List>
									<List.Item>{result.address}</List.Item>
									<List.Item>
										{result.city}, {result.state}
									</List.Item>
								</List>
							}
							redirect
							tags={[result.tags]}
							title={result.name}
							url={`/stores/${result.id}`}
							useCard={useCards}
						/>
					)
				}

				return <LazyLoad card={useCards} key={`${props.key}${i}`} segment={false} />
			})
		}

		return (
			<Provider store={store}>
				<div className="storesList">
					{showCityFilter && (
						<Fragment>
							<div className="ui form big">
								<Dropdown
									fluid
									onChange={this.onChangeCity}
									options={options}
									placeholder="Select a city"
									search
									selection
								/>
							</div>
							<Divider />
						</Fragment>
					)}

					{results.length > 0 ? (
						<div>
							<Visibility
								className="listWrapper"
								continuous
								onBottomVisible={this.loadMore}
							>
								{useCards ? (
									<Card.Group itemsPerRow={itemsPerRow} stackable>
										<RenderItems props={this.props} />
									</Card.Group>
								) : (
									<Item.Group divided>
										<RenderItems props={this.props} />
									</Item.Group>
								)}
							</Visibility>
						</div>
					) : (
						<div className="emptyContainer">
							<Segment placeholder>
								<Header>{emptyMsgContent}</Header>
							</Segment>
						</div>
					)}
				</div>
			</Provider>
		)
	}
}

StoresList.propTypes = {
	bikeId: PropTypes.string,
	cityId: PropTypes.string,
	count: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	emptyMsgContent: PropTypes.string,
	extra: PropTypes.func,
	getStores: PropTypes.func,
	getStoresByBike: PropTypes.func,
	hasMore: PropTypes.bool,
	history: PropTypes.object,
	itemsPerRow: PropTypes.number,
	key: PropTypes.string,
	loadingMore: PropTypes.bool,
	page: PropTypes.number,
	results: PropTypes.array,
	showCityFilter: PropTypes.bool,
	showPics: PropTypes.bool,
	storeId: PropTypes.string,
	storesByBike: PropTypes.bool,
	toggleLoading: PropTypes.func,
	useCards: PropTypes.bool
}

StoresList.defaultProps = {
	count: 10,
	emptyMsgContent: "There are no stores in this city",
	getStores,
	getStoresByBike,
	itemsPerRow: 3,
	loadingMore: false,
	page: 0,
	results: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
	showCityFilter: false,
	showPics: true,
	storesByBike: false,
	toggleLoading,
	useCards: true
}

const mapStateToProps = (state, ownProps) => ({
	...state.stores,
	...ownProps
})

export default connect(mapStateToProps, {
	getStores,
	getStoresByBike,
	toggleLoading
})(StoresList)
