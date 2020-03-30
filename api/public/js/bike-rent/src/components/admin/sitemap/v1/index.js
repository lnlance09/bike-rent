import "./style.css"
import { connect } from "react-redux"
import { editSitemap } from "redux/actions/app"
import { Button, Divider, Header, List } from "semantic-ui-react"
import React, { Component } from "react"
import AceEditor from "react-ace"
import PropTypes from "prop-types"
import "ace-builds/src-noconflict/mode-xml"
import "ace-builds/src-noconflict/theme-monokai"

class AdminSitemap extends Component {
	constructor(props) {
		super(props)

		this.state = {
			code: this.props.sitemap,
			edited: false
		}
	}

	componentDidMount() {}

	render() {
		const { code } = this.state
		const { bearer } = this.props

		return (
			<div className="adminSitemap">
				<Header size="huge">Important Links</Header>

				<List relaxed size="big">
					<List.Item>
						<b>Live Sitemap</b>:{" "}
						<a href={this.props.sitemapUrl} rel="noopener noreferrer" target="_blank">
							{window.location.origin}/api/seo/sitemap.xml
						</a>
					</List.Item>
					<List.Item>
						<b>Google Webmaster Console</b>:{" "}
						<a
							href="https://search.google.com/search-console"
							rel="noopener noreferrer"
							target="_blank"
						>
							https://search.google.com/search-console
						</a>
					</List.Item>
				</List>
				<AceEditor
					fontSize={16}
					highlightActiveLine
					mode="xml"
					name="sitemapEditor"
					onChange={code => this.setState({ code, edited: true })}
					setOptions={{
						enableBasicAutocompletion: true,
						enableLiveAutocompletion: false,
						enableSnippets: false
					}}
					theme="monokai"
					value={code}
				/>
				<Divider />
				<Button
					color="blue"
					content="Update sitemap"
					fluid
					onClick={() => {
						this.props.editSitemap({ bearer, sitemap: code })
					}}
					size="big"
				/>
			</div>
		)
	}
}

AdminSitemap.propTypes = {
	bearer: PropTypes.string,
	editSitemap: PropTypes.func,
	sitemap: PropTypes.string,
	sitemapUrl: PropTypes.string
}

AdminSitemap.defaultProps = {
	editSitemap
}

const mapStateToProps = (state, ownProps) => ({
	...state.app,
	...ownProps
})

export default connect(mapStateToProps, {
	editSitemap
})(AdminSitemap)
