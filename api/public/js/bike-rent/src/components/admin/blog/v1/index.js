import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"
import "./style.css"
import { adjustTimezone } from "utils/dateFunctions"
import { fetchCities } from "utils/selectOptions"
import { addBlog, deleteBlog, editBlog, toggleEditBlogModal } from "redux/actions/app"
import { connect } from "react-redux"
import { Editor } from "react-draft-wysiwyg"
import { EditorState, ContentState, convertFromHTML } from "draft-js"
import { stateToHTML } from "draft-js-export-html"
import {
	Button,
	Divider,
	Dropdown,
	Form,
	Header,
	Input,
	Item,
	Label,
	Message,
	Modal
} from "semantic-ui-react"
import React, { Component } from "react"
import Moment from "react-moment"
import PropTypes from "prop-types"

class AdminBlog extends Component {
	constructor(props) {
		super(props)

		this.state = {
			blogTitle: "",
			cityId: "",
			currentBlogId: 0,
			currentBlogTitle: "",
			currentEditorState: EditorState.createEmpty(),
			editorState: EditorState.createEmpty(),
			options: []
		}
	}

	async componentDidMount() {
		const options = await fetchCities("")
		this.setState({ options })
	}

	onChangeBlogTitle = (e, { value }) => this.setState({ blogTitle: value })

	onChangeCity = (e, { value }) => this.setState({ cityId: value })

	onChangeCurrentBlogTitle = (e, { value }) => this.setState({ currentBlogTitle: value })

	onCurrentEditorStateChange = editorState => this.setState({ currentEditorState: editorState })

	onEditorStateChange = editorState => this.setState({ editorState })

	render() {
		const {
			blogTitle,
			cityId,
			currentBlogId,
			currentBlogTitle,
			currentEditorState,
			editorState,
			options
		} = this.state
		const { bearer, blogs, createNewBlog, error, errorMsg, modalOpen } = this.props

		const AddBlogPanel = (
			<Form error={error}>
				<Input
					fluid
					onChange={this.onChangeBlogTitle}
					placeholder="Title"
					value={blogTitle}
				/>
				<Divider />

				<Editor
					editorClassName="editorContainer"
					editorState={editorState}
					onEditorStateChange={this.onEditorStateChange}
					toolbar={{
						options: [
							"inline",
							"blockType",
							"list",
							"link",
							"emoji",
							"image",
							"remove",
							"history"
						]
					}}
					toolbarClassName="editorToolbar"
					wrapperClassName="editorWrapper"
				/>

				<Divider />

				<Dropdown
					fluid
					onChange={this.onChangeCity}
					options={options}
					placeholder="Select a city"
					search
					selection
					value={cityId}
				/>

				<Divider />

				<Button
					color="blue"
					content="Publish"
					fluid
					onClick={() => {
						const rawHtml = stateToHTML(editorState.getCurrentContent())
						this.props.addBlog({
							bearer,
							cityId,
							entry: rawHtml,
							title: blogTitle
						})
					}}
				/>

				{error && <Message content={errorMsg} error />}
			</Form>
		)

		const EditBlogModal = (
			<Modal
				centered={false}
				closeIcon
				onClose={() => this.props.toggleEditBlogModal()}
				open={modalOpen}
				size="large"
			>
				<Modal.Content>
					<Form error={error}>
						<Input
							fluid
							onChange={this.onChangeCurrentBlogTitle}
							placeholder="Title"
							value={currentBlogTitle}
						/>
						<Divider />
						<Editor
							editorClassName="editorContainer"
							editorState={currentEditorState}
							onEditorStateChange={this.onCurrentEditorStateChange}
							toolbar={{
								options: [
									"inline",
									"blockType",
									"list",
									"link",
									"emoji",
									"image",
									"remove",
									"history"
								]
							}}
							toolbarClassName="editorToolbar"
							wrapperClassName="editorWrapper"
						/>
						<Divider />
						<Dropdown
							fluid
							onChange={this.onChangeCity}
							options={options}
							placeholder="Select a city"
							search
							selection
							value={cityId}
						/>
					</Form>
				</Modal.Content>
				<Modal.Actions>
					<Button
						color="red"
						onClick={() => {
							this.props.deleteBlog({ bearer, id: currentBlogId })
						}}
					>
						Delete
					</Button>
					<Button
						color="green"
						onClick={() => {
							const rawHtml = stateToHTML(currentEditorState.getCurrentContent())
							this.props.editBlog({
								bearer,
								cityId,
								entry: rawHtml,
								id: currentBlogId,
								title: currentBlogTitle
							})
						}}
					>
						Edit
					</Button>
				</Modal.Actions>
			</Modal>
		)

		const DisplayBlogPosts = (
			<Item.Group divided relaxed="very">
				{blogs.results.map((blog, i) => (
					<Item
						className="blogListItem"
						key={`${blog.title}${i}`}
						onClick={() => {
							const html = EditorState.createWithContent(
								ContentState.createFromBlockArray(convertFromHTML(blog.entry))
							)
							this.setState(
								{
									cityId: blog.city_id,
									currentBlogId: blog.id,
									currentBlogTitle: blog.title,
									currentEditorState: html
								},
								() => {
									this.props.toggleEditBlogModal()
								}
							)
						}}
					>
						<Item.Content>
							<Item.Header>{blog.title}</Item.Header>
							<Item.Meta>
								<Moment
									date={adjustTimezone(blog.date_created)}
									fromNow
									interval={60000}
								/>
							</Item.Meta>
							<Item.Description
								className="blogItemEntry"
								dangerouslySetInnerHTML={{ __html: blog.entry }}
							/>
							<Item.Extra>
								<Label basic color="blue">{blog.city}, {blog.state}</Label>
							</Item.Extra>
						</Item.Content>
					</Item>
				))}
			</Item.Group>
		)

		return (
			<div className="adminBlog">
				<Header size="huge">Blogs</Header>

				{createNewBlog && <div>{AddBlogPanel}</div>}

				{!createNewBlog && <div>{DisplayBlogPosts}</div>}

				{EditBlogModal}
			</div>
		)
	}
}

AdminBlog.propTypes = {
	addBlog: PropTypes.func,
	bearer: PropTypes.string,
	blogs: PropTypes.shape({
		count: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
		hasMore: PropTypes.bool,
		loadingMore: PropTypes.bool,
		page: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
		results: PropTypes.arrayOf(
			PropTypes.shape({
				city: PropTypes.string,
				date_created: PropTypes.string,
				date_updated: PropTypes.string,
				entry: PropTypes.string,
				state: PropTypes.string,
				title: PropTypes.string
			})
		)
	}),
	createNewBlog: PropTypes.bool,
	deleteBlog: PropTypes.func,
	editBlog: PropTypes.func,
	error: PropTypes.bool,
	errorMsg: PropTypes.string,
	modalOpen: PropTypes.bool,
	toggleEditBlogModal: PropTypes.func
}

AdminBlog.defaultProps = {
	addBlog,
	blogs: {
		count: "0",
		hasMore: false,
		loadingMore: false,
		page: 0,
		results: [{}, {}, {}, {}]
	},
	createNewBlog: false,
	deleteBlog,
	editBlog,
	error: false,
	modalOpen: false,
	toggleEditBlogModal
}

const mapStateToProps = (state, ownProps) => ({
	...state.app.blog,
	...ownProps
})

export default connect(mapStateToProps, {
	addBlog,
	deleteBlog,
	editBlog,
	toggleEditBlogModal
})(AdminBlog)
