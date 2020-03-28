import "css/app.css"
import "semantic/dist/semantic.min.css"
import "react-toastify/dist/ReactToastify.css"
import { Provider } from "react-redux"
import { Route, Router, Switch } from "react-router-dom"
import React, { Component } from "react"
import PropTypes from "prop-types"
import ScrollToTop from "react-router-scroll-top"
import history from "history.js"
import About from "pages/about"
import Admin from "pages/admin"
import Apply from "pages/apply"
import Bikes from "pages/bikes"
import Checkout from "pages/checkout"
import Cities from "pages/cities"
import Contact from "pages/contact"
import Faq from "pages/faq"
import Home from "pages/home"
import Partners from "pages/partners"
import Search from "pages/search"
import Signin from "pages/signin"
import Stores from "pages/stores"
import Terms from "pages/terms"
import store from "store"

class App extends Component {
	constructor(props) {
		super(props)
		this.state = {
			title: ""
		}

		console.log("props")
		console.log(this.props)
	}

	componentDidMount() {
		const theme = this.props.settings.theme
		const cssUrl = `https://bike-rent.s3-us-west-2.amazonaws.com/css/themes/semantic.${theme}.min.css`
		this.addStyle(cssUrl)
	}

	addStyle = url => {
		const style = document.createElement("link")
		style.href = url
		style.rel = "stylesheet"
		style.async = true

		document.head.appendChild(style)
	}

	render() {
		const { settings } = this.props

		return (
			<Provider store={store}>
				<div className="app">
					<Router history={history}>
						<ScrollToTop>
							<Route
								exact
								path="/"
								render={props => (
									<Home
										key={window.location.pathname}
										settings={settings}
										{...props}
									/>
								)}
							/>

							<Route
								exact
								path="/about"
								render={props => (
									<About
										key={window.location.pathname}
										settings={settings}
										{...props}
									/>
								)}
							/>

							<Switch>
								<Route
									exact
									path="/admin"
									render={props => (
										<Admin
											key={window.location.pathname}
											settings={settings}
											{...props}
										/>
									)}
								/>
								<Route
									exact
									path="/admin/:tab"
									render={props => (
										<Admin
											key={window.location.pathname}
											settings={settings}
											{...props}
										/>
									)}
								/>
							</Switch>

							<Route
								exact
								path="/apply"
								render={props => (
									<Apply
										key={window.location.pathname}
										settings={settings}
										{...props}
									/>
								)}
							/>

							<Switch>
								<Route
									exact
									path="/bikes"
									render={props => (
										<Bikes
											key={window.location.pathname}
											settings={settings}
											{...props}
										/>
									)}
								/>
								<Route
									path="/bikes/:type"
									render={props => (
										<Bikes
											key={window.location.pathname}
											settings={settings}
											{...props}
										/>
									)}
								/>
							</Switch>

							<Route
								exact
								path="/checkout"
								render={props => (
									<Checkout
										key={window.location.pathname}
										settings={settings}
										{...props}
									/>
								)}
							/>

							<Switch>
								<Route
									exact
									path="/cities"
									render={props => (
										<Cities
											key={window.location.pathname}
											settings={settings}
											{...props}
										/>
									)}
								/>
								<Route
									path="/cities/:name"
									render={props => (
										<Cities
											key={window.location.pathname}
											settings={settings}
											{...props}
										/>
									)}
								/>
							</Switch>

							<Route
								exact
								path="/contact"
								render={props => (
									<Contact
										key={window.location.pathname}
										settings={settings}
										{...props}
									/>
								)}
							/>

							<Route
								exact
								path="/faq"
								render={props => (
									<Faq
										key={window.location.pathname}
										settings={settings}
										{...props}
									/>
								)}
							/>

							<Route
								exact
								path="/partners"
								render={props => (
									<Partners
										key={window.location.pathname}
										settings={settings}
										{...props}
									/>
								)}
							/>

							<Route
								exact
								path="/search"
								render={props => (
									<Search
										key={window.location.pathname}
										settings={settings}
										{...props}
									/>
								)}
							/>

							<Route
								exact
								path="/signin"
								render={props => (
									<Signin
										key={window.location.pathname}
										settings={settings}
										{...props}
									/>
								)}
							/>

							<Switch>
								<Route
									exact
									path="/stores"
									render={props => (
										<Stores
											key={window.location.pathname}
											settings={settings}
											{...props}
										/>
									)}
								/>
								<Route
									exact
									path="/stores/:id"
									render={props => (
										<Stores
											key={window.location.pathname}
											settings={settings}
											{...props}
										/>
									)}
								/>
							</Switch>

							<Route
								exact
								path="/terms"
								render={props => (
									<Terms
										key={window.location.pathname}
										settings={settings}
										{...props}
									/>
								)}
							/>
						</ScrollToTop>
					</Router>
				</div>
			</Provider>
		)
	}
}

App.propTypes = {
	settings: PropTypes.shape({
		aboutPage: PropTypes.shape({
			desciption: PropTypes.string,
			hero: PropTypes.shape({
				headerOne: PropTypes.string,
				headerTwo: PropTypes.string,
				img: PropTypes.string
			}),
			seo: PropTypes.shape({
				desciption: PropTypes.string,
				img: PropTypes.string,
				keywords: PropTypes.string,
				title: PropTypes.string
			}),
			title: PropTypes.string
		}),
		applyPage: PropTypes.shape({
			applyButton: PropTypes.shape({
				basic: PropTypes.string,
				color: PropTypes.string,
				inverted: PropTypes.bool,
				text: PropTypes.string
			}),
			backgroundImg: PropTypes.string,
			seo: PropTypes.shape({
				desciption: PropTypes.string,
				img: PropTypes.string,
				keywords: PropTypes.string,
				title: PropTypes.string
			}),
			title: PropTypes.string
		}),
		bikesPage: PropTypes.shape({
			seo: PropTypes.shape({
				desciption: PropTypes.string,
				img: PropTypes.string,
				keywords: PropTypes.string,
				title: PropTypes.string
			}),
			sort: PropTypes.string,
			title: PropTypes.string,
			useCards: PropTypes.bool,
			useList: PropTypes.bool
		}),
		checkoutPage: PropTypes.shape({
			seo: PropTypes.shape({
				desciption: PropTypes.string,
				img: PropTypes.string,
				keywords: PropTypes.string,
				title: PropTypes.string
			}),
			title: PropTypes.string
		}),
		citiesPage: PropTypes.shape({
			cityButton: PropTypes.shape({
				basic: PropTypes.string,
				color: PropTypes.string,
				inverted: PropTypes.bool,
				text: PropTypes.string
			}),
			seo: PropTypes.shape({
				desciption: PropTypes.string,
				img: PropTypes.string,
				keywords: PropTypes.string,
				title: PropTypes.string
			}),
			sort: PropTypes.string,
			title: PropTypes.string,
			useCards: PropTypes.bool,
			useList: PropTypes.bool
		}),
		contactPage: PropTypes.shape({
			placeholderText: PropTypes.string,
			seo: PropTypes.shape({
				desciption: PropTypes.string,
				img: PropTypes.string,
				keywords: PropTypes.string,
				title: PropTypes.string
			}),
			title: PropTypes.string,
			toastMsg: PropTypes.string
		}),
		faqPage: PropTypes.shape({
			desciption: PropTypes.string,
			hero: PropTypes.shape({
				headerOne: PropTypes.string,
				headerTwo: PropTypes.string,
				img: PropTypes.string
			}),
			seo: PropTypes.shape({
				desciption: PropTypes.string,
				img: PropTypes.string,
				keywords: PropTypes.string,
				title: PropTypes.string
			}),
			title: PropTypes.string
		}),
		footer: PropTypes.shape({
			firstList: PropTypes.shape({
				items: PropTypes.arrayOf(PropTypes.shape({
					link: PropTypes.string,
					text: PropTypes.string
				})),
				title: PropTypes.string
			}),
			inverted: PropTypes.number,
			secondList: PropTypes.shape({
				items: PropTypes.arrayOf(PropTypes.shape({
					link: PropTypes.string,
					text: PropTypes.string
				})),
				title: PropTypes.string
			}),
			subtitle: PropTypes.string,
			title: PropTypes.string
		}),
		header: PropTypes.shape({
			backgroundColor: PropTypes.string,
			items: PropTypes.arrayOf(PropTypes.shape({
				link: PropTypes.string,
				text: PropTypes.string
			})),
			logo: PropTypes.string,
			signInButton: PropTypes.shape({
				basic: PropTypes.string,
				color: PropTypes.string,
				inverted: PropTypes.bool,
				text: PropTypes.string
			}),
			signUpButton: PropTypes.shape({
				basic: PropTypes.string,
				color: PropTypes.string,
				inverted: PropTypes.bool,
				text: PropTypes.string
			}),
		}),
		homePage: PropTypes.shape({
			hero: PropTypes.shape({
				button: PropTypes.shape({
					basic: PropTypes.string,
					color: PropTypes.string,
					inverted: PropTypes.bool,
					text: PropTypes.string
				}),
				img: PropTypes.string,
				subtitle: PropTypes.string,
				title: PropTypes.string
			}),
			firstSection: PropTypes.shape({
				button: PropTypes.shape({
					basic: PropTypes.string,
					color: PropTypes.string,
					inverted: PropTypes.bool,
					link: PropTypes.string,
					text: PropTypes.string
				}),
				img: PropTypes.string,
				items: PropTypes.arrayOf(PropTypes.shape({
					subtitle: PropTypes.string,
					title: PropTypes.string
				}))
			}),
			secondSection: PropTypes.shape({
				leftItem: PropTypes.shape({
					subtitle: PropTypes.string,
					title: PropTypes.string
				}),
				rightItem: PropTypes.shape({
					subtitle: PropTypes.string,
					title: PropTypes.string
				})
			}),
			seo: PropTypes.shape({
				desciption: PropTypes.string,
				img: PropTypes.string,
				keywords: PropTypes.string,
				title: PropTypes.string
			}),
			thirdSection: PropTypes.shape({
				divider: PropTypes.shape({
					text: PropTypes.string
				}),
				firstItem: PropTypes.shape({
					subtitle: PropTypes.string,
					title: PropTypes.string
				}),
				secondItem: PropTypes.shape({
					subtitle: PropTypes.string,
					title: PropTypes.string
				})
			})
		}),
		language: PropTypes.string,
		languages: PropTypes.array,
		partnersPage: PropTypes.shape({
			desciption: PropTypes.string,
			hero: PropTypes.shape({
				headerOne: PropTypes.string,
				headerTwo: PropTypes.string,
				img: PropTypes.string
			}),
			partners: PropTypes.arrayOf(PropTypes.shape({
				img: PropTypes.string,
				title: PropTypes.string
			})),
			seo: PropTypes.shape({
				desciption: PropTypes.string,
				img: PropTypes.string,
				keywords: PropTypes.string,
				title: PropTypes.string
			}),
			title: PropTypes.string
		}),
		searchPage: PropTypes.shape({
			desciption: PropTypes.string,
			seo: PropTypes.shape({
				desciption: PropTypes.string,
				img: PropTypes.string,
				keywords: PropTypes.string,
				title: PropTypes.string
			}),
			signInButton: PropTypes.shape({
				basic: PropTypes.string,
				color: PropTypes.string,
				inverted: PropTypes.bool,
				text: PropTypes.string
			}),
			signUpButton: PropTypes.shape({
				basic: PropTypes.string,
				color: PropTypes.string,
				inverted: PropTypes.bool,
				text: PropTypes.string
			})
		}),
		signinPage: PropTypes.shape({
			seo: PropTypes.shape({
				desciption: PropTypes.string,
				img: PropTypes.string,
				keywords: PropTypes.string,
				title: PropTypes.string
			}),
			title: PropTypes.string
		}),
		stores: PropTypes.array,
		storesPage: PropTypes.shape({
			defaultLocation: PropTypes.string,
			defaultRadius: PropTypes.string,
			seo: PropTypes.shape({
				desciption: PropTypes.string,
				img: PropTypes.string,
				keywords: PropTypes.string,
				title: PropTypes.string,
			}),
			useCards: PropTypes.bool,
			useList: PropTypes.bool
		}),
		termsPage: PropTypes.shape({
			desciption: PropTypes.string,
			seo: PropTypes.shape({
				desciption: PropTypes.string,
				img: PropTypes.string,
				keywords: PropTypes.string,
				title: PropTypes.string
			}),
			title: PropTypes.string
		}),
		theme: PropTypes.string,
		themes: PropTypes.arrayOf(PropTypes.shape({
			img: PropTypes.string,
			tag: PropTypes.string,
			title: PropTypes.string
		}))
	})
}

App.defaultProps = {
	
}

export default App
