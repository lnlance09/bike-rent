import "./style.css"
import { getBikes, getBikesByStore, toggleLoading } from "./actions"
import { connect, Provider } from "react-redux"
import { Card, Button, Header, Item, Segment, Visibility } from "semantic-ui-react"
import React, { Component } from "react"
import LazyLoad from "components/lazyLoad/v1/"
import PropTypes from "prop-types"
import ResultItem from "components/item/v1/"
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
			this.props.getBikes({ page: 0 })
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
			this.props.toggleLoading()
			this.props.retrieveItems()
		}
	}

	render() {
		const { emptyMsgContent, itemsPerRow, results, useCards } = this.props

		const RenderItems = ({ props }) => {
			console.log("render items")
			console.log(props)
			return props.results.map((result, i) => {
				if (result.id) {
					return (
						<ResultItem
							description={result.description}
							extra={<Button color="green" content="Get some wheels now" fluid />}
							history={props.history}
							id={`${props.key}${i}`}
							img={props.showPics ? result.image : null}
							key={`${props.key}${i}`}
							meta={result.meta}
							redirect
							tags={[result.tags]}
							title={result.name}
							url={result.url}
							useCard={useCards}
						/>
					)
				}

				return <LazyLoad card={useCards} key={`${props.key}${i}`} segment={false} />
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
	bikesByStore: PropTypes.bool,
	count: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	emptyMsgContent: PropTypes.string,
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
	storeId: PropTypes.string,
	toggleLoading: PropTypes.func,
	useCards: PropTypes.bool,
	useInternally: PropTypes.bool
}

BikesList.defaultProps = {
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
