import "./style.css"
import { getBikes, getBikesByStore, toggleLoading } from "./actions"
import { connect, Provider } from "react-redux"
import { Card, Header, Icon, Item, Segment, Visibility } from "semantic-ui-react"
import React, { Component } from "react"
import LazyLoad from "components/primary/lazyLoad/v1/"
import PropTypes from "prop-types"
import ResultItem from "components/primary/item/v1/"
import store from "store"

class BikesList extends Component {
	constructor(props) {
		super(props)

		this.state = {
			loadingMore: false
		}
	}

	componentDidMount() {
		if (this.props.bikesByStore) {
			this.props.getBikesByStore({
				page: 0,
				storeId: this.props.storeId
			})
		} else {
			this.props.getBikes({})
		}
	}

	componentDidUpdate(prevProps) {
		if (prevProps !== this.props) {
			// this.props.retrieveItems()
		}
	}

	loadMore = () => {
		if (this.props.hasMore && !this.props.loadingMore) {
			// const newPage = parseInt(this.props.page + 1, 10)
		}
	}

	render() {
		const {
			addToCart,
			cartFunction,
			emptyMsgContent,
			extra,
			itemsPerRow,
			results,
			useCards
		} = this.props
		const _store = this.props.store

		const RenderItems = ({ props }) => {
			return props.results.map((result, i) => {
				let { bike_id, description, hourlyRate, id, image, meta, name, quantity } = result
				if (quantity < 10 && quantity > 0) {
					meta = (
						<span className="error">
							<Icon color="red" name="warning sign" /> Only {quantity} left
						</span>
					)
				}
				if (quantity === "0") {
					meta = (
						<span className="error">
							<Icon color="red" name="warning sign" /> This item is sold out
						</span>
					)
				}

				if (id) {
					return (
						<ResultItem
							addToCart={addToCart}
							cartData={{
								bike: {
									description,
									hourlyRate,
									quantity,
									id,
									name
								},
								store: _store
							}}
							cartFunction={cartFunction}
							description={description}
							extra={extra}
							history={props.history}
							id={`${props.key}${i}`}
							img={props.showPics ? image : null}
							key={`${props.key}${i}`}
							meta={meta}
							redirect
							// tags={[result.tags]}
							title={name}
							url={`/bikes/${bike_id}`}
							useCard={useCards}
						/>
					)
				}

				return <LazyLoad card={useCards} key={`${props.key}${i}`} segment={!useCards} />
			})
		}

		return (
			<Provider store={store}>
				<div className="bikesList">
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
								<Header icon>{emptyMsgContent}</Header>
							</Segment>
						</div>
					)}
				</div>
			</Provider>
		)
	}
}

BikesList.propTypes = {
	addToCart: PropTypes.bool,
	bikesByStore: PropTypes.bool,
	cartFunction: PropTypes.func,
	count: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	emptyMsgContent: PropTypes.string,
	extra: PropTypes.func,
	getBikes: PropTypes.func,
	getBikesByStore: PropTypes.func,
	hasMore: PropTypes.bool,
	history: PropTypes.object,
	itemsPerRow: PropTypes.number,
	key: PropTypes.string,
	loadingMore: PropTypes.bool,
	page: PropTypes.number,
	results: PropTypes.array,
	showPics: PropTypes.bool,
	store: PropTypes.shape({
		address: PropTypes.string,
		city: PropTypes.string,
		id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
		lat: PropTypes.string,
		lon: PropTypes.string,
		name: PropTypes.string,
		state: PropTypes.string
	}),
	toggleLoading: PropTypes.func,
	useCards: PropTypes.bool,
	useInternally: PropTypes.bool
}

BikesList.defaultProps = {
	addToCart: false,
	bikesByStore: false,
	count: 10,
	emptyMsgContent: "",
	getBikes,
	getBikesByStore,
	itemsPerRow: 3,
	loadingMore: false,
	page: 0,
	results: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
	showPics: true,
	store: {},
	toggleLoading,
	useCards: true,
	useInternally: true
}

const mapStateToProps = (state, ownProps) => ({
	...state.bikes,
	...ownProps
})

export default connect(mapStateToProps, {
	getBikes,
	getBikesByStore,
	toggleLoading
})(BikesList)
