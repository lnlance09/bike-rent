import "./style.css"
import { Container, Grid, Header, List, Segment } from "semantic-ui-react"
import React, { Component } from "react"
import PropTypes from "prop-types"

class Footer extends Component {
	componentDidMount() {}

	render() {
		const { footerData } = this.props
		const { firstList, inverted, secondList, subtitle, title } = footerData
		const isInverted = inverted === 1

		return (
			<Segment className="footerSegment" inverted={isInverted} vertical>
				<Container>
					<Grid divided inverted={isInverted} stackable>
						<Grid.Row>
							<Grid.Column width={3}>
								<Header as="h4" content={firstList.title} inverted={isInverted} />
								<List inverted={isInverted}>
									{firstList.items.map((item, i) => (
										<List.Item
											key={`${item.text}${i}`}
											onClick={() => this.props.history.push(item.link)}
										>
											{item.text}
										</List.Item>
									))}
								</List>
							</Grid.Column>
							<Grid.Column width={3}>
								<Header as="h4" content={secondList.title} inverted={isInverted} />
								<List inverted={isInverted}>
									{secondList.items.map((item, i) => (
										<List.Item
											key={`${item.text}${i}`}
											onClick={() => this.props.history.push(item.link)}
										>
											{item.text}
										</List.Item>
									))}
								</List>
							</Grid.Column>
							<Grid.Column width={7}>
								<Header as="h4" content={title} inverted={isInverted} />
								<p>{subtitle}</p>
							</Grid.Column>
						</Grid.Row>
					</Grid>
				</Container>
			</Segment>
		)
	}
}

Footer.propTypes = {
	footerData: PropTypes.object
}

Footer.defaultProps = {}

export default Footer
