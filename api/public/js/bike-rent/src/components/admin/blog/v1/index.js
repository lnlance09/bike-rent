import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"
import "./style.css"
// import { fetchData } from "./actions"
import { connect } from "react-redux"
import { Editor } from "react-draft-wysiwyg"
import { EditorState } from "draft-js"
import { Button, Divider, Dropdown, Form, Input } from "semantic-ui-react"
import React, { Component } from "react"
import PropTypes from "prop-types"

class AdminBlog extends Component {
	constructor(props) {
		super(props)

		this.state = {
			blogTitle: "",
			editorState: EditorState.createEmpty(),
			tagOptions: [],
			tagValue: ""
		}
	}

	onChangeBlogTitle = (e, { value }) => this.setState({ blogTitle: value })

	onEditorStateChange = editorState => this.setState({ editorState })

	render() {
		const { blogTitle, editorState, tagOptions, tagValue } = this.state
		const { createNewBlog } = this.props

		const AddBlogPabel = (
			<Form size="big">
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
				<Button color="green" content="Publish" fluid size="big" />
			</Form>
		)

		const DisplayBlogPosts = <div></div>

		return (
			<div className="adminBlog">
				{createNewBlog && AddBlogPabel}

				{!createNewBlog && DisplayBlogPosts}
			</div>
		)
	}
}

AdminBlog.propTypes = {
	bearer: PropTypes.string,
	createNewBlog: PropTypes.bool
}

AdminBlog.defaultProps = {
	createNewBlog: false
}

const mapStateToProps = (state, ownProps) => ({
	...state.app,
	...ownProps
})

export default connect(mapStateToProps, {
	// fetchData
})(AdminBlog)
