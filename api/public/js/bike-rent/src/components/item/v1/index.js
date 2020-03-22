import "./style.css"
import { formatNumber, formatPlural } from "utils/textFunctions"
import { Card, Image, Item, Label, List } from "semantic-ui-react"
import React, { Component, Fragment } from "react"
import ImagePic from "images/images/image-square.png"
import LazyLoad from "components/lazyLoad/v1/"
import PropTypes from "prop-types"
import TextTruncate from "react-text-truncate"

class ResultItem extends Component {
	redirectToUrl = e => {
		if (this.props.redirect && !e.metaKey) {
			this.props.history.push(this.props.url)
		} else {
			window.open(this.props.url, "_blank").focus()
		}
	}

	render() {
		const { description, id, img, label, meta, title, useCard } = this.props

		const ItemExtra = props => {
			if (props.extra.length > 1) {
				return (
					<List className="extraList" horizontal>
						{props.extra.map((result, i) => {
							if (parseInt(result.count, 10) > 0) {
								return (
									<List.Item id={props.id} key={`itemExtra${i}`}>
										<b>{formatNumber(result.count)}</b>{" "}
										{formatPlural(result.count, result.term)}
									</List.Item>
								)
							}
							return null
						})}
					</List>
				)
			}

			if (props.extra.count > 0) {
				return `${formatNumber(props.extra.count)} ${formatPlural(
					props.extra.count,
					props.extra.term
				)}`
			}

			return props.extra
			// return null
		}

		const ItemContent = props => {
			const validDescription = props.description !== null && props.description !== undefined
			if (props.type === "lazyLoad" && !validDescription) {
				return <LazyLoad />
			}

			return (
				<Item.Content>
					<Item.Header>
						<span>{props.title}</span>
						{props.menu && <Fragment>{props.menu}</Fragment>}
					</Item.Header>
					{props.meta && <Item.Meta>{props.meta}</Item.Meta>}
					<Item.Description>
						{props.truncate ? (
							<TextTruncate line={3} text={props.description} truncateText="..." />
						) : (
							props.description
						)}
					</Item.Description>
					{props.extra && <Item.Extra>{ItemExtra(props)}</Item.Extra>}
					{props.tags && (
						<Item.Extra>
							<Label.Group>{RenderTags(props.tags)}</Label.Group>
						</Item.Extra>
					)}
				</Item.Content>
			)
		}

		const RenderTags = tags =>
			tags.map((tag, i) => (
				<Label basic key={`label${i}`}>
					{tag}
				</Label>
			))

		const FullCard = (
			<Card onClick={this.redirectToUrl}>
				{img && <Image src={img} wrapped ui={false} />}
				<Card.Content>
					<Card.Header>{title}</Card.Header>
					{meta && <Card.Meta>{meta}</Card.Meta>}
					<Card.Description>{description}</Card.Description>
				</Card.Content>
				{this.props.extra && <Card.Content extra>{ItemExtra(this.props)}</Card.Content>}
			</Card>
		)

		const FullItem = (
			<Item className="resultItem" key={id} onClick={this.redirectToUrl}>
				{img && (
					<Item.Image
						bordered
						centered
						className="cityItemImg"
						label={label}
						onError={i => (i.target.src = ImagePic)}
						rounded
						src={img}
					/>
				)}
				{ItemContent(this.props)}
			</Item>
		)

		return useCard ? FullCard : FullItem
	}
}

ResultItem.propTypes = {
	description: PropTypes.string,
	extra: PropTypes.oneOfType([PropTypes.array, PropTypes.bool, PropTypes.object]),
	img: PropTypes.string,
	id: PropTypes.string,
	key: PropTypes.string,
	label: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
	menu: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
	meta: PropTypes.oneOfType([PropTypes.bool, PropTypes.object, PropTypes.string]),
	redirect: PropTypes.bool,
	tags: PropTypes.array,
	title: PropTypes.string,
	truncate: PropTypes.bool,
	url: PropTypes.string,
	useCard: PropTypes.bool
}

ResultItem.defaultProps = {
	menu: false,
	redirect: true,
	truncate: true,
	useCard: false
}

export default ResultItem
