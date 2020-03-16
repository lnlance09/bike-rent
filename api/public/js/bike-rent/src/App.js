import "css/app.css"
import "semantic/dist/semantic.min.css"
import { Provider } from "react-redux"
import { Route, Router, Switch } from "react-router-dom"
import React, { Component } from "react"
import ScrollToTop from "react-router-scroll-top"
import history from "history.js"
import Admin from "pages/admin"
import Bikes from "pages/bikes"
import Checkout from "pages/checkout"
import Cities from "pages/cities"
import Home from "pages/home"
import Signin from "pages/signin"
import Stores from "pages/stores"
import store from "store"

class App extends Component {
	constructor(props) {
		super(props)
		this.state = {
			title: ""
		}
	}

	render() {
		return (
			<div className="app">
				<Provider store={store}>
					<Router history={history}>
						<ScrollToTop>
							<Route
								exact
								path="/"
								render={props => (
									<Home key={window.location.pathname} {...props} />
								)}
							/>

							<Route
								exact
								path="/admin"
								render={props => (
									<Admin key={window.location.pathname} {...props} />
								)}
							/>

							<Switch>
								<Route
									exact
									path="/bikes"
									render={props => (
										<Bikes key={window.location.pathname} {...props} />
									)}
								/>
								<Route
									path="/bikes/:type"
									render={props => (
										<Bikes key={window.location.pathname} {...props} />
									)}
								/>
							</Switch>

							<Route
								exact
								path="/checkout"
								render={props => (
									<Checkout key={window.location.pathname} {...props} />
								)}
							/>

							<Switch>
								<Route
									exact
									path="/cities"
									render={props => (
										<Cities key={window.location.pathname} {...props} />
									)}
								/>
								<Route
									path="/bikes/:type"
									render={props => (
										<Cities key={window.location.pathname} {...props} />
									)}
								/>
							</Switch>

							<Route
								exact
								path="/signin"
								render={props => (
									<Signin key={window.location.pathname} {...props} />
								)}
							/>

							<Route
								exact
								path="/stores"
								render={props => (
									<Stores key={window.location.pathname} {...props} />
								)}
							/>
						</ScrollToTop>
					</Router>
				</Provider>
			</div>
		)
	}
}

export default App
