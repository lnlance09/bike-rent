import "./style.css"
import { adjustTimezone } from "utils/dateFunctions"
import { getPayments, makeDefault } from "./actions"
import { connect, Provider } from "react-redux"
import { Header, Icon, List, Radio, Segment, Visibility } from "semantic-ui-react"
import React, { Component } from "react"
import LazyLoad from "components/primary/lazyLoad/v1/"
import Moment from "react-moment"
import PropTypes from "prop-types"
import store from "store"

class PaymentsList extends Component {
	constructor(props) {
		super(props)

		this.state = {
			loadingMore: false
		}
	}

	componentDidMount() {
		this.props.getPayments({
			bearer: this.props.bearer,
			page: 0,
			visible: 1
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
			this.props.toggleLoading()
		}
	}

	render() {
		const { activeItem } = this.state
		const { bearer, canMakeDefault, emptyMsgContent, results } = this.props

		const RenderItems = ({ props }) => {
			return props.results.map((result, i) => {
				const { created_at, id, number, preferred, type } = result
				const showCheckmark = activeItem === i && !canMakeDefault

				if (id) {
					let icon = "credit card"
					if (type === "Mastercard") {
						icon = "cc mastercard"
					}

					if (type === "Visa") {
						icon = "cc visa"
					}

					if (type === "American Express") {
						icon = "cc amex"
					}

					if (type === "JCB") {
						icon = "cc jcb"
					}

					return (
						<List.Item
							active={activeItem === i}
							key={`paymentMethod${i}`}
							onClick={() => {
								this.setState({ activeItem: i }, () => {
									props.onClick(result.id)
								})
							}}
						>
							{showCheckmark && (
								<List.Content floated="right">
									<Icon color="green" name="checkmark" />
								</List.Content>
							)}
							<List.Icon
								color="blue"
								name={icon}
								size="large"
								verticalAlign="middle"
							/>
							<List.Content>
								<List.Header>
									**** **** **** {number.slice(number.length - 4)}
								</List.Header>
								<List.Description>
									Added{" "}
									<Moment
										date={adjustTimezone(created_at)}
										fromNow
										interval={60000}
									/>
									{canMakeDefault && (
										<span style={{ marginLeft: "16px" }}>
											<Radio
												checked={preferred === "1"}
												label="Make default"
												name="defaultCreditCard"
												onChange={() => {
													this.props.makeDefault({
														bearer,
														id
													})
												}}
											/>
										</span>
									)}
								</List.Description>
							</List.Content>
						</List.Item>
					)
				}

				return <LazyLoad key={`paymentMethod${i}`} segment />
			})
		}

		return (
			<Provider store={store}>
				<div className="paymentsList">
					{results.length > 0 ? (
						<div>
							<Visibility
								className="listWrapper"
								continuous
								onBottomVisible={this.loadMore}
							>
								<List divided relaxed="very" selection size="big">
									<RenderItems props={this.props} />
								</List>
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

PaymentsList.propTypes = {
	bearer: PropTypes.string,
	canMakeDefault: PropTypes.bool,
	count: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	emptyMsgContent: PropTypes.string,
	getPayments: PropTypes.func,
	history: PropTypes.object,
	makeDefault: PropTypes.func,
	onClick: PropTypes.func,
	results: PropTypes.array
}

PaymentsList.defaultProps = {
	canMakeDefault: false,
	count: 10,
	emptyMsgContent: "You haven't added any payment methods",
	getPayments,
	makeDefault,
	onClick: () => null,
	results: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}]
}

const mapStateToProps = (state, ownProps) => ({
	...state.payments,
	...ownProps
})

export default connect(mapStateToProps, {
	getPayments,
	makeDefault
})(PaymentsList)
