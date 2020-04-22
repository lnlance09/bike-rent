import "./style.css"
import { logout } from "components/secondary/authentication/v1/actions"
import { Provider, connect } from "react-redux"
import { Container, Dropdown, Label, Menu, Segment } from "semantic-ui-react"
import React, { Component } from "react"
import Cart from "components/primary/cart/v1/"
import PropTypes from "prop-types"
import store from "store"

class SubHeader extends Component {
	constructor(props) {
		super(props)

		this.state = {}
	}

	render() {
		const { items, language, languages } = this.props

		const CartDropdown = (
			<Menu.Menu position="right">
				<Dropdown
					pointing="top right"
					trigger={
						<span>
							{items !== undefined && (
								<Label circular color="olive" style={{ marginRight: "8px" }}>
									{items.length}
								</Label>
							)}{" "}
							Your cart
						</span>
					}
				>
					<Dropdown.Menu as={Segment} style={{ padding: "16px" }}>
						<Cart
							editable={false}
							history={this.props.history}
							items={items}
							showCheckoutBtn
							size="medium"
						/>
					</Dropdown.Menu>
				</Dropdown>
			</Menu.Menu>
		)

		const LanguageSelection = (
			<Dropdown
				className="languageMenu"
				defaultValue="English"
				inline
				pointing="top"
				text={language}
			>
				<Dropdown.Menu>
					{languages.map(item => (
						<Dropdown.Item key={item} text={item} value={item} />
					))}
				</Dropdown.Menu>
			</Dropdown>
		)

		return (
			<Provider store={store}>
				<Menu className="languageMenu">
					<Container className="languageContainer">
						{LanguageSelection}
						{CartDropdown}
					</Container>
				</Menu>
			</Provider>
		)
	}
}

SubHeader.propTypes = {
	inverted: PropTypes.bool,
	items: PropTypes.arrayOf(
		PropTypes.shape({
			link: PropTypes.string,
			text: PropTypes.string
		})
	),
	languages: PropTypes.array
}

SubHeader.defaultProps = {
	items: [],
	languages: []
}

const mapStateToProps = (state, ownProps) => ({
	...state.user,
	...ownProps
})

export default connect(mapStateToProps, { logout })(SubHeader)
