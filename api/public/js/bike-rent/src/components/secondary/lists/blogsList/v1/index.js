import "./style.css"
import { adjustTimezone } from "utils/dateFunctions"
import { getBlogs, toggleLoading } from "./actions"
import { connect, Provider } from "react-redux"
import { Header, Item, Segment, Visibility } from "semantic-ui-react"
import React, { Component } from "react"
import LazyLoad from "components/primary/lazyLoad/v1/"
import Moment from "react-moment"
import PropTypes from "prop-types"
import store from "store"

class BlogsList extends Component {
	constructor(props) {
		super(props)

		this.state = {
			loadingMore: false
		}
	}

	componentDidMount() {
		this.props.getBlogs({
			cityId: this.props.cityId,
			page: 0
		})
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
		const { emptyMsgContent, results } = this.props

		const RenderItems = ({ props }) => {
			return props.results.map((result, i) => {
				const { date_created, entry, id, title } = result
				if (id) {
					return (
						<Item
							onClick={() => this.props.onClickItem(result)}
							style={{ cursor: "pointer" }}
						>
							<Item.Content>
								<Item.Header as="a">{title}</Item.Header>
								<Item.Meta>
									<Moment
										date={adjustTimezone(date_created)}
										fromNow
										interval={60000}
									/>
								</Item.Meta>
								<Item.Description
									className="blogItemEntry"
									dangerouslySetInnerHTML={{ __html: entry }}
								/>
							</Item.Content>
						</Item>
					)
				}

				return <LazyLoad card={false} key={`${props.key}${i}`} segment />
			})
		}

		return (
			<Provider store={store}>
				<div className="blogsList">
					{results.length > 0 ? (
						<div>
							<Visibility
								className="listWrapper"
								continuous
								onBottomVisible={this.loadMore}
							>
								<Item.Group divided>
									<RenderItems props={this.props} />
								</Item.Group>
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

BlogsList.propTypes = {
	cityId: PropTypes.string,
	count: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	emptyMsgContent: PropTypes.string,
	getBlogs: PropTypes.func,
	hasMore: PropTypes.bool,
	history: PropTypes.object,
	loadingMore: PropTypes.bool,
	onClickItem: PropTypes.func,
	page: PropTypes.number,
	results: PropTypes.array,
	toggleLoading: PropTypes.func
}

BlogsList.defaultProps = {
	cityId: "",
	count: 10,
	emptyMsgContent: "There are no blog posts",
	getBlogs,
	loadingMore: false,
	page: 0,
	results: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
	toggleLoading
}

const mapStateToProps = (state, ownProps) => ({
	...state.blogs,
	...ownProps
})

export default connect(mapStateToProps, {
	getBlogs,
	toggleLoading
})(BlogsList)
