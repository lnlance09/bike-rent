import "./style.css"
import { submitFooterForm } from "redux/actions/app"
import { connect } from "react-redux"
import { Button, Divider, Form, Header, Input, Radio, Select } from "semantic-ui-react"
import React, { Component } from "react"
import PropTypes from "prop-types"
import store from "store"

class AdminFooter extends Component {
	constructor(props) {
		super(props)

		const { footerData } = this.props

		const currentState = store.getState()
		const user = currentState.user
		const bearer = user.bearer

		this.state = {
			bearer,
			inverted: footerData.inverted,
			listOneItems: footerData.firstList.items,
			listOneTitle: footerData.firstList.title,
			listTwoItems: footerData.secondList.items,
			listTwoTitle: footerData.secondList.title,
			subTitle: footerData.subtitle,
			title: footerData.title
		}

		this.toggleFooterInversion = this.toggleFooterInversion.bind(this)
	}

	addListOneItem() {
		this.setState({ listOneItems: [...this.state.listOneItems, { link: "", text: "" }] })
	}

	addListTwoItem() {
		this.setState({ listTwoItems: [...this.state.listTwoItems, { link: "", text: "" }] })
	}

	handleFirstChangeLink(e, index) {
		this.state.listOneItems[index].link = e.target.value
		this.setState({ listOneItems: this.state.listOneItems })
	}

	handleFirstChangeText(e, index) {
		this.state.listOneItems[index].text = e.target.value
		this.setState({ listOneItems: this.state.listOneItems })
	}

	handleFirstRemove(index) {
		this.state.listOneItems.splice(index, 1)
		this.setState({ listOneItems: this.state.listOneItems })
	}

	handleSecondChangeLink(e, index) {
		this.state.listTwoItems[index].link = e.target.value
		this.setState({ listTwoItems: this.state.listTwoItems })
	}

	handleSecondChangeText(e, index) {
		this.state.listTwoItems[index].text = e.target.value
		this.setState({ listTwoItems: this.state.listTwoItems })
	}

	handleSecondRemove(index) {
		this.state.listTwoItems.splice(index, 1)
		this.setState({ listTwoItems: this.state.listTwoItems })
	}

	onChangeHeader = (e, { value }) => this.setState({ title: value })

	onChangeListOneTitle = (e, { value }) => this.setState({ listOneTitle: value })

	onChangeListTwoTitle = (e, { value }) => this.setState({ listTwoTitle: value })

	onChangeSubHeader = (e, { value }) => this.setState({ subTitle: value })

	toggleFooterInversion = (e, { value }) => this.setState({ inverted: value === "on" ? 1 : 0 })

	render() {
		const {
			bearer,
			inverted,
			listOneItems,
			listOneTitle,
			listTwoItems,
			listTwoTitle,
			subTitle,
			title
		} = this.state

		return (
			<div className="adminFooter">
				<Form>
					<Form.Field>
						Inverted: <b>This will make the footer appear dark</b>
					</Form.Field>
					<Form.Field>
						<Radio
							checked={inverted === 1}
							label="Inverted"
							name="inverted"
							onChange={this.toggleFooterInversion}
							value="on"
						/>
					</Form.Field>
					<Form.Field>
						<Radio
							checked={inverted === 0}
							label="Not inverted"
							name="inverted"
							onChange={this.toggleFooterInversion}
							value="off"
						/>
					</Form.Field>
					<Divider hidden />

					<Form.Field>
						<Header size="big">List One</Header>
					</Form.Field>
					<Form.Field>
						<label>Title</label>
						<Input
							onChange={this.onChangeListOneTitle}
							placeholder="Title"
							value={listOneTitle}
						/>
					</Form.Field>
					<Divider />
					{listOneItems.map((item, i) => (
						<Form.Group key={`firstListItem${i}`}>
							<Form.Field width={1}>
								<Button
									color="red"
									icon="close"
									onClick={() => this.handleFirstRemove(i)}
								/>
							</Form.Field>
							<Form.Field width={8}>
								<Input
									onChange={e => this.handleFirstChangeText(e, i)}
									placeholder="Text"
									value={item.text}
								/>
							</Form.Field>
							<Form.Field width={7}>
								<Input
									onChange={e => this.handleFirstChangeLink(e, i)}
									placeholder="Link"
									value={item.link}
								/>
							</Form.Field>
						</Form.Group>
					))}
					<Form.Field>
						<Button
							color="blue"
							content="Add item"
							onClick={e => this.addListOneItem(e)}
						/>
					</Form.Field>
					<Divider hidden />

					<Form.Field>
						<Header size="big">List Two</Header>
					</Form.Field>
					<Form.Field>
						<label>Title</label>
						<Input
							onChange={this.onChangeListTwoTitle}
							placeholder="Title"
							value={listTwoTitle}
						/>
					</Form.Field>
					<Divider />
					{listTwoItems.map((item, i) => (
						<Form.Group key={`secondListItem${i}`}>
							<Form.Field width={1}>
								<Button
									color="red"
									icon="close"
									onClick={() => this.handleSecondRemove(i)}
								/>
							</Form.Field>
							<Form.Field width={8}>
								<Input
									onChange={e => this.handleSecondChangeText(e, i)}
									placeholder="Text"
									value={item.text}
								/>
							</Form.Field>
							<Form.Field width={7}>
								<Input
									onChange={e => this.handleSecondChangeLink(e, i)}
									placeholder="Link"
									value={item.link}
								/>
							</Form.Field>
						</Form.Group>
					))}
					<Form.Field>
						<Button
							color="blue"
							content="Add item"
							onClick={e => this.addListTwoItem(e)}
						/>
					</Form.Field>

					<Divider hidden />

					<Form.Field>
						<Header size="big">Right side</Header>
					</Form.Field>
					<Form.Field>
						<label>Header</label>
						<Input onChange={this.onChangeHeader} placeholder="Header" value={title} />
					</Form.Field>
					<Form.Field>
						<label>Subheader</label>
						<Input
							onChange={this.onChangeSubHeader}
							placeholder="Sub header"
							value={subTitle}
						/>
					</Form.Field>

					<Divider />

					<Button
						color="blue"
						content="Submit"
						fluid
						onClick={() =>
							this.props.submitFooterForm({
								bearer,
								inverted,
								listOneItems,
								listOneTitle,
								listTwoItems,
								listTwoTitle,
								subTitle,
								title
							})
						}
					/>
				</Form>
			</div>
		)
	}
}

AdminFooter.propTypes = {
	footerData: PropTypes.object,
	submitFooterForm: PropTypes.func
}

AdminFooter.defaultProps = {
	submitFooterForm
}

const mapStateToProps = (state, ownProps) => ({
	...state.app.footer,
	...ownProps
})

export default connect(mapStateToProps, {
	submitFooterForm
})(AdminFooter)
