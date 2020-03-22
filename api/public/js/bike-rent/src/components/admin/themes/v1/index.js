import "./style.css"
// import { fetchData } from "./actions"
import { connect } from "react-redux"
import { Button, Card, Divider, Image } from "semantic-ui-react"
import { capitalizeWord } from "utils/textFunctions"
import React, { Component } from "react"
import PropTypes from "prop-types"

class AdminThemes extends Component {
	constructor(props) {
		super(props)

		this.state = {}
	}

	render() {
		const { bearer, themes } = this.props

		return (
			<div className="adminThemes">
				<Card.Group itemsPerRow={3}>
					{themes.map((item, i) => (
						<Card>
							<Image src={item.img} wrapped ui={false} />
							<Card.Content>
								<Card.Header>{capitalizeWord(item.title)}</Card.Header>
								<Card.Description>{item.tag}</Card.Description>
							</Card.Content>
							<Card.Content extra>
								<Button color="green" fluid>
									Use this theme
								</Button>
							</Card.Content>
						</Card>
					))}
				</Card.Group>
			</div>
		)
	}
}

AdminThemes.propTypes = {
	bearer: PropTypes.string,
	themes: PropTypes.array
}

AdminThemes.defaultProps = {}

const mapStateToProps = (state, ownProps) => ({
	...state.app,
	...ownProps
})

export default connect(mapStateToProps, {
	// fetchData
})(AdminThemes)
