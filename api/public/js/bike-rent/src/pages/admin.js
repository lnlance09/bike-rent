import { connect, Provider } from "react-redux"
import { getBlogs, getCities, getCss, getEmail, getSitemap } from "redux/actions/app"
import { Accordion, Container, Grid, Menu, Responsive } from "semantic-ui-react"
import React, { Component } from "react"
import AdminBikes from "components/admin/bikes/v1/"
import AdminBlog from "components/admin/blog/v1/"
import AdminCities from "components/admin/cities/v1/"
import AdminCss from "components/admin/css/v1/"
import AdminEmail from "components/admin/email/v1/"
import AdminFooter from "components/admin/footer/v1/"
import AdminHeader from "components/admin/header/v1/"
import AdminLanguages from "components/admin/languages/v1/"
import AdminLibrary from "components/admin/library/v1/"
import AdminOrders from "components/admin/orders/v1/"
import AdminPages from "components/admin/pages/v1/"
import AdminSitemap from "components/admin/sitemap/v1/"
import AdminStores from "components/admin/stores/v1/"
import AdminThemes from "components/admin/themes/v1/"
import PropTypes from "prop-types"
import store from "store"

class Admin extends Component {
	constructor(props) {
		super(props)

		const params = this.props.match.params
		let { tab } = params

		const currentState = store.getState()
		const user = currentState.user
		const auth = user.authenticated
		const bearer = user.bearer

		this.state = {
			activeItem: tab === undefined ? "change-themes" : tab,
			auth,
			bearer
		}
	}

	componentDidMount() {
		this.props.getBlogs()
		this.props.getCities()
		this.props.getSitemap({ url: this.props.sitemapUrl })
		this.props.getCss({ url: this.props.cssUrl })
		this.props.getEmail({ type: "application-confirmation" })
		this.props.getEmail({ type: "confirm-your-email" })
		this.props.getEmail({ type: "order-confirmation" })
		this.props.getEmail({ type: "refund" })
	}

	handleItemClick = (e, { name }) => {
		this.setState({ activeItem: name }, () => {
			this.props.history.push(`/admin/${name}`)
		})
	}

	render() {
		const { activeItem, bearer } = this.state
		const { blogs, cities, css, emails, settings, sitemap, sitemapUrl } = this.props

		const AdminMenu = props => (
			<Accordion as={Menu} className="adminMenu" fluid inverted vertical>
				<Menu.Item>
					Apperance
					<Menu.Menu>
						<Menu.Item
							active={activeItem === "change-themes"}
							name="change-themes"
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
							active={activeItem === "add-a-new-post"}
							name="add-a-new-post"
							onClick={this.handleItemClick}
						>
							Add a new post
						</Menu.Item>
						<Menu.Item
							active={activeItem === "blog-posts"}
							name="blog-posts"
							onClick={this.handleItemClick}
						/>
					</Menu.Menu>
				</Menu.Item>
				<Menu.Item>
					Cities
					<Menu.Menu>
						<Menu.Item
							active={activeItem === "edit-featured-cities"}
							name="edit-featured-cities"
							onClick={this.handleItemClick}
						>
							Edit featured cities
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
							active={activeItem === "add-custom-styling"}
							name="add-custom-styling"
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
							active={activeItem === "application-confirmation"}
							name="application-confirmation"
							onClick={this.handleItemClick}
						>
							Application confirmation
						</Menu.Item>
						<Menu.Item
							active={activeItem === "confirm-your-email"}
							name="confirm-your-email"
							onClick={this.handleItemClick}
						>
							Confirm your email
						</Menu.Item>
						<Menu.Item
							active={activeItem === "order-confirmation"}
							name="order-confirmation"
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
					Languages
					<Menu.Menu>
						<Menu.Item
							active={activeItem === "languages"}
							name="languages"
							onClick={this.handleItemClick}
						>
							Edit supported languages
						</Menu.Item>
					</Menu.Menu>
				</Menu.Item>
				<Menu.Item>
					Library
					<Menu.Menu>
						<Menu.Item
							active={activeItem === "images"}
							name="images"
							onClick={this.handleItemClick}
						>
							Images
						</Menu.Item>
					</Menu.Menu>
				</Menu.Item>
				<Menu.Item>
					Orders
					<Menu.Menu>
						<Menu.Item
							active={activeItem === "view-orders"}
							name="view-orders"
							onClick={this.handleItemClick}
						>
							View orders
						</Menu.Item>
					</Menu.Menu>
				</Menu.Item>
				<Menu.Item>
					Pages
					<Menu.Menu>
						<Menu.Item
							active={activeItem === "about-page"}
							name="about-page"
							onClick={this.handleItemClick}
						>
							About page
						</Menu.Item>
						<Menu.Item
							active={activeItem === "apply-page"}
							name="apply-page"
							onClick={this.handleItemClick}
						>
							Apply page
						</Menu.Item>
						<Menu.Item
							active={activeItem === "bikes-page"}
							name="bikes-page"
							onClick={this.handleItemClick}
						>
							Bikes page
						</Menu.Item>
						<Menu.Item
							active={activeItem === "checkout-page"}
							name="checkout-page"
							onClick={this.handleItemClick}
						>
							Checkout page
						</Menu.Item>
						<Menu.Item
							active={activeItem === "cities-page"}
							name="cities-page"
							onClick={this.handleItemClick}
						>
							Cities page
						</Menu.Item>
						<Menu.Item
							active={activeItem === "contact-page"}
							name="contact-page"
							onClick={this.handleItemClick}
						>
							Contact page
						</Menu.Item>
						<Menu.Item
							active={activeItem === "faq-page"}
							name="faq-page"
							onClick={this.handleItemClick}
						>
							FAQ page
						</Menu.Item>
						<Menu.Item
							active={activeItem === "home-page"}
							name="home-page"
							onClick={this.handleItemClick}
						>
							Home page
						</Menu.Item>
						<Menu.Item
							active={activeItem === "partners-page"}
							name="partners-page"
							onClick={this.handleItemClick}
						>
							Partners page
						</Menu.Item>
						<Menu.Item
							active={activeItem === "search-page"}
							name="search-page"
							onClick={this.handleItemClick}
						>
							Search page
						</Menu.Item>
						<Menu.Item
							active={activeItem === "signin-page"}
							name="signin-page"
							onClick={this.handleItemClick}
						>
							Sign In page
						</Menu.Item>
						<Menu.Item
							active={activeItem === "stores-page"}
							name="stores-page"
							onClick={this.handleItemClick}
						>
							Stores page
						</Menu.Item>
						<Menu.Item
							active={activeItem === "terms-page"}
							name="terms-page"
							onClick={this.handleItemClick}
						>
							Terms page
						</Menu.Item>
					</Menu.Menu>
				</Menu.Item>
				<Menu.Item>
					SEO
					<Menu.Menu>
						<Menu.Item
							active={activeItem === "sitemap-editor"}
							name="sitemap-editor"
							onClick={this.handleItemClick}
						>
							Sitemap editor
						</Menu.Item>
					</Menu.Menu>
				</Menu.Item>
				<Menu.Item>
					Stores
					<Menu.Menu>
						<Menu.Item
							active={activeItem === "view-stores"}
							name="view-stores"
							onClick={this.handleItemClick}
						>
							View stores
						</Menu.Item>
					</Menu.Menu>
				</Menu.Item>
			</Accordion>
		)

		const Header = (
			<Menu borderless className="adminHeaderMenu" secondary={false} size="large">
				<Container>
					<Menu.Item
						onClick={() => {
							this.props.history.push("/admin")
						}}
						style={{ padding: "7px" }}
					>
						<span className="logoText">Admin Panel</span>
					</Menu.Item>
				</Container>
			</Menu>
		)

		const MainContent = () => {
			if (
				activeItem === "about-page" ||
				activeItem === "apply-page" ||
				activeItem === "bikes-page" ||
				activeItem === "checkout-page" ||
				activeItem === "cities-page" ||
				activeItem === "contact-page" ||
				activeItem === "faq-page" ||
				activeItem === "home-page" ||
				activeItem === "partners-page" ||
				activeItem === "search-page" ||
				activeItem === "signin-page" ||
				activeItem === "stores-page" ||
				activeItem === "terms-page"
			) {
				return (
					<div>
						<AdminPages bearer={bearer} type={activeItem} />
					</div>
				)
			}

			if (activeItem === "add-a-new-post") {
				return (
					<div>
						<AdminBlog createNewBlog />
					</div>
				)
			}

			if (activeItem === "add-custom-styling") {
				return <div>{css && <AdminCss bearer={bearer} css={css} />}</div>
			}

			if (
				activeItem === "application-confirmation" ||
				activeItem === "confirm-your-email" ||
				activeItem === "order-confirmation" ||
				activeItem === "refund"
			) {
				if (
					emails.applicationConfirmation &&
					emails.confirmYourEmail &&
					emails.orderConfirmation &&
					emails.refund
				) {
					return (
						<div>
							<AdminEmail emails={emails} type={activeItem} />
						</div>
					)
				}
			}

			if (activeItem === "blog-posts") {
				return (
					<div>
						<AdminBlog bearer={bearer} blogs={blogs} />
					</div>
				)
			}

			if (activeItem === "change-themes") {
				return (
					<div>
						<AdminThemes
							bearer={bearer}
							theme={settings.theme}
							themes={settings.themes}
						/>
					</div>
				)
			}

			if (activeItem === "edit-featured-cities") {
				return (
					<div>
						<AdminCities bearer={bearer} cities={cities} />
					</div>
				)
			}

			if (activeItem === "footer") {
				return (
					<div>
						<AdminFooter footerData={settings.footer} />
					</div>
				)
			}

			if (activeItem === "header") {
				return (
					<div>
						<AdminHeader headerData={settings.header} />
					</div>
				)
			}

			if (activeItem === "images") {
				return (
					<div>
						<AdminLibrary />
					</div>
				)
			}

			if (activeItem === "languages") {
				return (
					<div>
						<AdminLanguages bearer={bearer} languages={settings.languages} />
					</div>
				)
			}

			if (activeItem === "sitemap-editor") {
				return (
					<div>
						{sitemap && (
							<AdminSitemap
								bearer={bearer}
								sitemap={sitemap}
								sitemapUrl={sitemapUrl}
							/>
						)}
					</div>
				)
			}

			if (activeItem === "view-orders") {
				return (
					<div>
						<AdminOrders />
					</div>
				)
			}

			if (activeItem === "view-stores") {
				return (
					<div>
						<AdminStores />
					</div>
				)
			}
		}

		return (
			<Provider store={store}>
				<div className="adminPage">
					<div className="adminContainer">
						<Responsive maxWidth={1024}>
							<Grid>
								<Grid.Row>{AdminMenu(this.props)}</Grid.Row>
								<Grid.Row></Grid.Row>
							</Grid>
						</Responsive>

						<Responsive minWidth={1025}>
							<Grid>
								<Grid.Column className="leftSide" width={3}>
									{AdminMenu(this.props)}
								</Grid.Column>
								<Grid.Column className="rightSide" width={13}>
									{Header}
									<div className="mainContent">{MainContent()}</div>
								</Grid.Column>
							</Grid>
						</Responsive>
					</div>
				</div>
			</Provider>
		)
	}
}

Admin.propTypes = {
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
	cities: PropTypes.shape({
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
	css: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
	cssUrl: PropTypes.string,
	emails: PropTypes.shape({
		applicationConfirmation: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
		confirmYourEmail: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
		orderConfirmation: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
		refund: PropTypes.oneOfType([PropTypes.string, PropTypes.bool])
	}),
	getBlogs: PropTypes.func,
	getCities: PropTypes.func,
	getCss: PropTypes.func,
	getEmail: PropTypes.func,
	getSitemap: PropTypes.func,
	settings: PropTypes.object,
	sitemap: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
	sitemapUrl: PropTypes.string
}

Admin.defaultProps = {
	blogs: {
		count: "0",
		hasMore: false,
		loadingMore: false,
		page: 0,
		results: [{}, {}, {}, {}]
	},
	cities: {
		count: 0,
		hasMore: false,
		loadingMore: false,
		page: 0,
		results: [{}, {}, {}, {}]
	},
	css: false,
	cssUrl: "https://bike-rent.s3-us-west-2.amazonaws.com/css/style.css",
	emails: {
		applicationConfirmation: false,
		confirmYourEmail: false,
		orderConfirmation: false,
		refund: false
	},
	getBlogs,
	getCities,
	getCss,
	getEmail,
	getSitemap,
	sitemap: false,
	sitemapUrl: "https://bike-rent.s3-us-west-2.amazonaws.com/sitemaps/sitemap.xml"
}

const mapStateToProps = (state, ownProps) => {
	return {
		...state.app,
		...ownProps
	}
}

export default connect(mapStateToProps, {
	getBlogs,
	getCities,
	getCss,
	getEmail,
	getSitemap
})(Admin)
