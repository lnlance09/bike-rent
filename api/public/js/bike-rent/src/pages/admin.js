import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"
import { connect, Provider } from "react-redux"
import { Link } from "react-router-dom"
import { Editor as BlogEditor } from "react-draft-wysiwyg"
import { EditorState } from "draft-js"
import { Accordion, Button, Container, Divider, Dropdown, Grid, Icon, Input, Menu, Responsive, Segment } from "semantic-ui-react"
import React, { Component } from "react"
import AceEditor from "react-ace"
import config from "config.json"
import PageFooter from "components/footer/v1/"
import PageHeader from "components/header/v1/"
import PropTypes from "prop-types"
import store from "store"
import "ace-builds/src-noconflict/mode-css"
import "ace-builds/src-noconflict/theme-textmate"

class Admin extends Component {
	constructor(props) {
		super(props)

		const currentState = store.getState()
		const user = currentState.user
		const auth = user.authenticated
		const bearer = user.bearer

		this.state = {
			activeItem: "change themes",
			blogTitle: "",
			cssCode: "",
			editorState: EditorState.createEmpty(),
			tagOptions: [],
			tagValue: ""
		}
	}

	componentDidMount() {}

	handleItemClick = (e, { name }) => {
		this.setState({ activeItem: name })
	}

	onChangeBlogTitle = (e, { value }) => this.setState({ blogTitle: value })

	onEditorStateChange = editorState => this.setState({ editorState })

	render() {
		const { activeItem, blogTitle, cssCode, editorState, tagOptions, tagValue } = this.state
		const {} = this.props

		const AdminMenu = props => (
			<Accordion as={Menu} borderless className="adminMenu" fluid vertical>
				<Menu.Item>
					Apperance
					<Menu.Menu>
						<Menu.Item
							active={activeItem === "change themes"}
							name="change themes"
							onClick={this.handleItemClick}
						>
							Change themes
						</Menu.Item>
					</Menu.Menu>
				</Menu.Item>
				<Menu.Item>
					Blog
					<Menu.Menu>
						<Menu.Item
							active={activeItem === "add a new post"}
							name="add a new post"
							onClick={this.handleItemClick}
						>
							Add a new post
						</Menu.Item>
						<Menu.Item
							active={activeItem === "blog posts"}
							name="blog posts"
							onClick={this.handleItemClick}
						/>
					</Menu.Menu>
				</Menu.Item>
				<Menu.Item>
					Cities
					<Menu.Menu>
						<Menu.Item
							active={activeItem === "feature a new city"}
							name="feature a new city"
							onClick={this.handleItemClick}
						>
							Feature a new city
						</Menu.Item>
						<Menu.Item
							active={activeItem === "view featured cities"}
							name="view featured cities"
							onClick={this.handleItemClick}
						>
							View featured cities
						</Menu.Item>
					</Menu.Menu>
				</Menu.Item>
				<Menu.Item>
					Components
					<Menu.Menu>
						<Menu.Item
							active={activeItem === "header"}
							name="header"
							onClick={this.handleItemClick}
						/>
						<Menu.Item
							active={activeItem === "footer"}
							name="footer"
							onClick={this.handleItemClick}
						/>
					</Menu.Menu>
				</Menu.Item>
				<Menu.Item>
					CSS
					<Menu.Menu>
						<Menu.Item
							active={activeItem === "add custom styling"}
							name="add custom styling"
							onClick={this.handleItemClick}
						>
							Add custom styling
						</Menu.Item>
					</Menu.Menu>
				</Menu.Item>
				<Menu.Item>
					Emails
					<Menu.Menu>
						<Menu.Item
							active={activeItem === "confirm your email"}
							name="confirm your email"
							onClick={this.handleItemClick}
						>
							Confirm your email
						</Menu.Item>
						<Menu.Item
							active={activeItem === "order confirmation"}
							name="order confirmation"
							onClick={this.handleItemClick}
						>
							Order confirmation
						</Menu.Item>
						<Menu.Item
							active={activeItem === "refund"}
							name="refund"
							onClick={this.handleItemClick}
						>
							Refund
						</Menu.Item>
					</Menu.Menu>
				</Menu.Item>
				<Menu.Item>
					Orders
					<Menu.Menu>
						<Menu.Item
							active={activeItem === "all orders"}
							name="all orders"
							onClick={this.handleItemClick}
						>
							All orders
						</Menu.Item>
						<Menu.Item
							active={activeItem === "refunded orders"}
							name="refunded orders"
							onClick={this.handleItemClick}
						>
							Refunded orders
						</Menu.Item>
					</Menu.Menu>
				</Menu.Item>
				<Menu.Item>
					SEO
					<Menu.Menu>
						<Menu.Item
							active={activeItem === "home page"}
							name="home page"
							onClick={this.handleItemClick}
						>
							Home page
						</Menu.Item>
						<Menu.Item
							active={activeItem === "bikes page"}
							name="bikes page"
							onClick={this.handleItemClick}
						>
							Bikes page
						</Menu.Item>
						<Menu.Item
							active={activeItem === "cities page"}
							name="cities page"
							onClick={this.handleItemClick}
						>
							Cities page
						</Menu.Item>
						<Menu.Item
							active={activeItem === "stores page"}
							name="stores page"
							onClick={this.handleItemClick}
						>
							Stores page
						</Menu.Item>
					</Menu.Menu>
				</Menu.Item>
				<Menu.Item>
					Stores
					<Menu.Menu>
						<Menu.Item
							active={activeItem === "all stores"}
							name="all stores"
							onClick={this.handleItemClick}
						>
							All stores
						</Menu.Item>
						<Menu.Item
							active={activeItem === "highest grossing"}
							name="highest grossing"
							onClick={this.handleItemClick}
						>
							Highest grossing
						</Menu.Item>
					</Menu.Menu>
				</Menu.Item>
			</Accordion>
		)

		const MainContent = () => {
			if (activeItem === "add a new post") {
				return (
					<Segment>
						<Input
							fluid
							onChange={this.onChangeBlogTitle}
							placeholder="Title"
							value={blogTitle}
						/>
						<Divider />
						
						<BlogEditor
							editorClassName="blogEditorContainer"
							editorState={editorState}
							onEditorStateChange={this.onEditorStateChange}
							toolbar={{
								options: ['inline', 'blockType', 'list', 'textAlign', 'colorPicker', 'link', 'embedded', 'emoji', 'image', 'remove', 'history'],
							}}
							toolbarClassName="toolbarClassName"
							wrapperClassName="wrapperClassName"
						/>

						<Divider />
						<Dropdown
							allowAdditions
							fluid
							multiple
							onAddItem={this.handleAddition}
							onChange={this.handleChange}
							options={tagOptions}
							placeholder="Add tags"
							search
							selection
							value={tagValue}
						/>

						<Divider />
						<Button
							color="green"
							content="Publish"
							fluid
						/>
					</Segment>
				)
			}

			if (activeItem === "add custom styling") {
				return (
					<Segment>
						<AceEditor
							// editorProps={{ $blockScrolling: true }}
							highlightActiveLine={false}
							fontSize={16}
							mode="css"
							name="UNIQUE_ID_OF_DIV"
							onChange={cssCode => this.setState({ cssCode })}
							theme="textmate"
							value={cssCode}
						/>
						<Divider />
						<Button
							color="blue"
							content="Update"
							fluid
						/>
					</Segment>
				)
			}

			if (activeItem === "all orders") {
				return (
					<Segment>

					</Segment>
				)
			}

			if (activeItem === "all stores") {
				return (
					<Segment>

					</Segment>
				)
			}

			if (activeItem === "bikes page") {
				return (
					<Segment>

					</Segment>
				)
			}

			if (activeItem === "blog posts") {
				return (
					<Segment>

					</Segment>
				)
			}

			if (activeItem === "change themes") {
				return (
					<Segment>

					</Segment>
				)
			}

			if (activeItem === "cities page") {
				return (
					<Segment>

					</Segment>
				)
			}

			if (activeItem === "confirm your email") {
				return (
					<Segment>

					</Segment>
				)
			}

			if (activeItem === "feature a new city") {
				return (
					<Segment>

					</Segment>
				)
			}

			if (activeItem === "footer") {
				return (
					<Segment>

					</Segment>
				)
			}

			if (activeItem === "header") {
				return (
					<Segment>

					</Segment>
				)
			}

			if (activeItem === "highest grossing") {
				return (
					<Segment>

					</Segment>
				)
			}

			if (activeItem === "home page") {
				return (
					<Segment>

					</Segment>
				)
			}

			if (activeItem === "order confirmation") {
				return (
					<Segment>

					</Segment>
				)
			}

			if (activeItem === "refund") {
				return (
					<Segment>

					</Segment>
				)
			}

			if (activeItem === "refunded orders") {
				return (
					<Segment>

					</Segment>
				)
			}

			if (activeItem === "stores page") {
				return (
					<Segment>

					</Segment>
				)
			}

			if (activeItem === "view featured cities") {
				return (
					<Segment>

					</Segment>
				)
			}
		}

		return (
			<Provider store={store}>
				<div className="adminPage">
					<PageHeader activeItem="admin" {...this.props} />

					<Container className="mainContainer" textAlign="left">
						<Responsive maxWidth={1024}>
							<Grid>
								<Grid.Row>{AdminMenu(this.props)}</Grid.Row>
								<Grid.Row></Grid.Row>
							</Grid>
						</Responsive>

						<Responsive minWidth={1025}>
							<Grid>
								<Grid.Column width={4}>{AdminMenu(this.props)}</Grid.Column>
								<Grid.Column className="rightSide" width={12}>
									{MainContent()}
								</Grid.Column>
							</Grid>
						</Responsive>
					</Container>

					<PageFooter />
				</div>
			</Provider>
		)
	}
}

Admin.propTypes = {}

Admin.defaultProps = {}

const mapStateToProps = (state, ownProps) => {
	return {
		...state.Admin,
		...ownProps
	}
}

export default connect(mapStateToProps, {})(Admin)
