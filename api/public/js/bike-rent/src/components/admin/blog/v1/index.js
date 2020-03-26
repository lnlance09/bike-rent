import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"
import "./style.css"
import { adjustTimezone } from "utils/dateFunctions"
import { addBlog, editBlog, toggleEditBlogModal } from "redux/actions/app"
import { connect } from "react-redux"
import { Editor } from "react-draft-wysiwyg"
import { EditorState, ContentState, convertFromHTML } from "draft-js"
import { stateToHTML } from "draft-js-export-html"
import {
	Button,
	Divider,
	Form,
	Icon,
	Input,
	Item,
	Message,
	Modal,
	Segment
} from "semantic-ui-react"
import React, { Component } from "react"
import Moment from "react-moment"
import PropTypes from "prop-types"

class AdminBlog extends Component {
	constructor(props) {
		super(props)

		this.state = {
			blogTitle: "",
			currentBlogId: 0,
			currentBlogTitle: "",
			currentEditorState: EditorState.createEmpty(),
			editorState: EditorState.createEmpty()
		}
	}

	onChangeBlogTitle = (e, { value }) => this.setState({ blogTitle: value })

	onChangeCurrentBlogTitle = (e, { value }) => this.setState({ currentBlogTitle: value })

	onCurrentEditorStateChange = editorState => this.setState({ currentEditorState: editorState })

	onEditorStateChange = editorState => this.setState({ editorState })

	render() {
		const {
			blogTitle,
			currentBlogId,
			currentBlogTitle,
			currentEditorState,
			editorState
		} = this.state
		const { bearer, blogs, createNewBlog, error, errorMsg, modalOpen } = this.props

		const AddBlogPanel = (
			<Form error={error} size="big">
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

				<Button
					color="green"
					content="Publish"
					fluid
					onClick={() => {
						const rawHtml = stateToHTML(editorState.getCurrentContent())
						this.props.addBlog({
							bearer,
							entry: rawHtml,
							title: blogTitle
						})
					}}
					size="big"
				/>

				{error && <Message content={errorMsg} error />}
			</Form>
		)

		const EditBlogModal = (
			<Modal centered={false} open={modalOpen} size="large">
				<Modal.Content>
					<Form error={error} size="big">
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
					</Form>
				</Modal.Content>
				<Modal.Actions>
					<Button color="red" onClick={() => this.props.toggleEditBlogModal()}>
						Cancel
					</Button>
					<Button
						color="green"
						onClick={() => {
							const rawHtml = stateToHTML(currentEditorState.getCurrentContent())
							this.props.editBlog({
								bearer,
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
								<Icon name="clock outline" />{" "}
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
						</Item.Content>
					</Item>
				))}
			</Item.Group>
		)

		return (
			<div className="adminBlog">
				{createNewBlog && <Segment>{AddBlogPanel}</Segment>}

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
				date_created: PropTypes.string,
				date_updated: PropTypes.string,
				entry: PropTypes.string,
				title: PropTypes.string
			})
		)
	}),
	createNewBlog: PropTypes.bool,
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
	editBlog,
	toggleEditBlogModal
})(AdminBlog)
