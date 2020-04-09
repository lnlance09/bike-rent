import { connect, Provider } from "react-redux"
import { getCity } from "redux/actions/city"
import { adjustTimezone } from "utils/dateFunctions"
import { formatPlural } from "utils/textFunctions"
import { DisplayMetaTags } from "utils/metaFunctions"
import { Button, Container, Divider, Grid, Header, Icon, Image } from "semantic-ui-react"
import React, { Component, Fragment } from "react"
import BlogsList from "components/blogsList/v1/"
import CitiesList from "components/citiesList/v1/"
import Logo from "components/header/v1/images/logo.svg"
import MapBox from "components/mapBox/v1/"
import Moment from "react-moment"
import PageFooter from "components/footer/v1/"
import PageHeader from "components/header/v1/"
import PropTypes from "prop-types"
import store from "store"
import StoresList from "components/storesList/v1/"

class Cities extends Component {
	constructor(props) {
		super(props)

		const params = this.props.match.params
		let { slug, tab } = params
		let id = slug ? this.getId(slug) : false

		const currentState = store.getState()
		const user = currentState.user
		const auth = user.authenticated
		const bearer = user.bearer

		this.state = {
			auth,
			bearer,
			currentBlog: null,
			id,
			imgVisible: false,
			slug: slug ? slug : "",
			storeId: "0",
			tab,
			zoom: 8
		}
	}

	async componentDidMount() {
		const { id } = this.state
		if (id) {
			this.props.getCity({
				callback: () => this.setState({ imgVisible: true }),
				id
			})
		}
	}

	getId = slug => {
		const split = slug.split("-")
		return split[split.length - 1]
	}

	onClickBlog = blog => this.setState({ currentBlog: blog })

	render() {
		const { auth, currentBlog, id, imgVisible, slug, storeId, tab, zoom } = this.state
		const { city, error, settings } = this.props
		const { citiesPage } = settings
		const { ctaButton } = citiesPage

		const CtaButton = (
			<Button
				basic={ctaButton.basic === "1"}
				color={ctaButton.color}
				content={ctaButton.text}
				inverted={ctaButton.inverted === "1"}
				fluid
			/>
		)

		const RenderStoresList = ({ props }) => {
			return (
				<div style={{ textAlign: "left" }}>
					<StoresList
						cityId={id}
						extra={ctaButton.visible === "1" ? CtaButton : null}
						history={props.history}
						itemsPerRow={2}
						key="store"
						storeId={storeId}
						storesByBike={false}
						useCards={true}
					/>
				</div>
			)
		}

		const SingleCity = props => {
			const { city, description, lat, lon, storeCount, stores } = props.city
			const showMap = lat && lon

			return (
				<Grid stackable>
					<Grid.Column width={11}>
						{tab === "blog" ? (
							<Fragment>
								<Header as="h1" size="huge">
									{currentBlog ? currentBlog.title : "Blog Entries"}
									{currentBlog && (
										<Header.Subheader>
											<Moment
												date={adjustTimezone(currentBlog.date_created)}
												fromNow
												interval={60000}
											/>
										</Header.Subheader>
									)}
								</Header>
								{currentBlog && (
									<span
										className="goBack"
										onClick={() => this.setState({ currentBlog: null })}
									>
										<Icon name="arrow left" />
										See all
									</span>
								)}
								<Divider hidden />
								{currentBlog ? (
									<Container
										dangerouslySetInnerHTML={{ __html: currentBlog.entry }}
									/>
								) : (
									<BlogsList
										cityId={id}
										onClickItem={blog => this.onClickBlog(blog)}
									/>
								)}
							</Fragment>
						) : (
							<Fragment>
								<Header as="h1" size="huge">
									About this city
								</Header>
								<Header as="p" size="medium">
									{description}
								</Header>
								<Divider hidden />
								<Header size="large">Stores</Header>
								<RenderStoresList props={props} />
							</Fragment>
						)}
					</Grid.Column>
					<Grid.Column width={5}>
						<Header size="large">
							{storeCount !== undefined &&
								`${storeCount} ${formatPlural(storeCount, "store")} in ${city}`}
						</Header>

						<Divider hidden />

						{showMap && (
							<MapBox
								height="300px"
								lat={lat}
								lng={lon}
								markers={stores}
								onClickMarker={(id, lat, lon) => {
									this.setState({ storeId: id, lat, lon, zoom: 12 })
								}}
								width="100%"
								zoom={zoom}
							/>
						)}

						<Divider />

						<Button
							color="blue"
							content={tab === "blog" ? "View Stores" : "View Blog"}
							fluid
							onClick={() =>
								this.props.history.push(
									`/cities/${slug}${tab === "blog" ? "" : "/blog"}`
								)
							}
						/>
					</Grid.Column>
				</Grid>
			)
		}

		return (
			<Provider store={store}>
				<DisplayMetaTags
					page="cities"
					props={this.props}
					seo={citiesPage.seo}
					state={this.state}
				/>

				<div className={`mainWrapper citiesPage ${slug}`}>
					<PageHeader
						activeItem="cities"
						authenticated={auth}
						backgroundColor={settings.header.backgroundColor}
						backgroundImage={city.image}
						headerOne={city.city}
						imgVisible={imgVisible}
						items={settings.header.items}
						language={settings.language}
						languages={settings.languages}
						logo={settings.header.logo}
						logoText={settings.header.logoText}
						showMainContent={slug ? true : false}
						signInButton={settings.header.signInButton}
						signUpButton={settings.header.signUpButton}
						{...this.props}
					/>

					<Container className="mainContainer">
						{id ? (
							<Fragment>
								{!error ? (
									SingleCity(this.props)
								) : (
									<Container textAlign="center">
										<Image centered size="small" src={Logo} />
										<Header as="h1">This city does not exist</Header>
									</Container>
								)}
							</Fragment>
						) : (
							<Fragment>
								<Header size="huge">
									{citiesPage.title}
									<Header.Subheader>{citiesPage.description}</Header.Subheader>
								</Header>

								<Divider hidden />

								<CitiesList
									emptyMsgContent="There are no featured cities"
									extra={ctaButton.visible === "1" ? CtaButton : null}
									history={this.props.history}
									key="city"
									useCards={citiesPage.useCards === "1"}
								/>
							</Fragment>
						)}
					</Container>

					<PageFooter footerData={settings.footer} history={this.props.history} />
				</div>
			</Provider>
		)
	}
}

Cities.propTypes = {
	city: PropTypes.shape({
		city: PropTypes.string,
		county: PropTypes.string,
		description: PropTypes.string,
		image: PropTypes.string,
		lat: PropTypes.string,
		lon: PropTypes.string,
		name: PropTypes.string,
		slug: PropTypes.string,
		state: PropTypes.string,
		storeCount: PropTypes.number,
		stores: PropTypes.arrayOf(
			PropTypes.shape({
				lat: PropTypes.number,
				lon: PropTypes.number
			})
		)
	}),
	error: PropTypes.bool,
	getCity: PropTypes.func,
	settings: PropTypes.object
}

Cities.defaultProps = {
	city: {
		stores: []
	},
	error: false,
	getCity
}

const mapStateToProps = (state, ownProps) => {
	return {
		...state.city,
		...ownProps
	}
}

export default connect(mapStateToProps, {
	getCity
})(Cities)
