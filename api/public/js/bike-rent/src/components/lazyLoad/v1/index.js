import "./style.css"
import { Card, Placeholder, Segment } from "semantic-ui-react"
import React, { Component } from "react"
import PropTypes from "prop-types"

class LazyLoad extends Component {
	render() {
		const { card, header, segment } = this.props

		if (segment) {
			return (
				<Segment className="placeholderSegment">
					<Placeholder fluid>
						{header && (
							<Placeholder.Header image>
								<Placeholder.Line length="medium" />
								<Placeholder.Line length="very short" />
							</Placeholder.Header>
						)}
						<Placeholder.Paragraph>
							<Placeholder.Line length="full" />
							<Placeholder.Line length="very long" />
							<Placeholder.Line length="full" />
						</Placeholder.Paragraph>
					</Placeholder>
				</Segment>
			)
		}

		if (card) {
			return (
				<Card key={card.header}>
					<Placeholder>
						<Placeholder.Image square />
					</Placeholder>

					<Card.Content>
						<Placeholder>
							<Placeholder.Header>
								<Placeholder.Line length="very short" />
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

		return (
			<Placeholder fluid>
				{header && (
					<Placeholder.Header image>
						<Placeholder.Line length="medium" />
						<Placeholder.Line length="very short" />
					</Placeholder.Header>
				)}
				<Placeholder.Paragraph>
					<Placeholder.Line length="full" />
					<Placeholder.Line length="very long" />
					<Placeholder.Line length="full" />
				</Placeholder.Paragraph>
			</Placeholder>
		)
	}
}

LazyLoad.propTypes = {
	card: PropTypes.bool,
	header: PropTypes.bool,
	segment: PropTypes.bool
}

LazyLoad.defaultProps = {
	card: false,
	header: true,
	segment: true
}

export default LazyLoad
