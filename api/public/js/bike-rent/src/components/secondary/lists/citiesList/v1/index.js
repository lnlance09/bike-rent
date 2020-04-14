import "./style.css"
import { getCities, toggleLoading } from "./actions"
import { connect, Provider } from "react-redux"
import { Card, Header, Item, Segment, Visibility } from "semantic-ui-react"
import React, { Component } from "react"
import LazyLoad from "components/primary/lazyLoad/v1/"
import PropTypes from "prop-types"
import ResultItem from "components/primary/item/v1/"
import store from "store"

class CitiesList extends Component {
	constructor(props) {
		super(props)

		this.state = {
			loadingMore: false
		}
	}

	componentDidMount() {
		this.props.getCities({ page: 0, showHidden: 0 })
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
		const { emptyMsgContent, extra, itemsPerRow, results, useCards } = this.props

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
							meta={result.meta}
							redirect
							tags={[result.tags]}
							title={result.title}
							url={`/cities/${result.slug}-${result.location_id}`}
							useCard={useCards}
						/>
					)
				}

				return <LazyLoad card={useCards} key={`${props.key}${i}`} segment={false} />
			})
		}

		return (
			<Provider store={store}>
				<div className="citiesList">
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

CitiesList.propTypes = {
	count: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	emptyMsgContent: PropTypes.string,
	getCities: PropTypes.func,
	hasMore: PropTypes.bool,
	itemsPerRow: PropTypes.number,
	key: PropTypes.string,
	loadingMore: PropTypes.bool,
	page: PropTypes.number,
	results: PropTypes.array,
	showPics: PropTypes.bool,
	toggleLoading: PropTypes.func,
	useCards: PropTypes.bool
}

CitiesList.defaultProps = {
	count: 10,
	emptyMsgContent: "There are no results",
	getCities,
	itemsPerRow: 3,
	loadingMore: false,
	page: 0,
	results: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
	showPics: true,
	toggleLoading,
	useCards: true
}

const mapStateToProps = (state, ownProps) => ({
	...state.cities,
	...ownProps
})

export default connect(mapStateToProps, {
	getCities,
	toggleLoading
})(CitiesList)
