import { combineReducers } from "redux"
import { loadingBarReducer } from "react-redux-loading-bar"
import bike from "redux/reducers/bike"
import user from "components/authentication/v1/reducer"

export default combineReducers({
	bike,
	loadingBar: loadingBarReducer,
	user
})