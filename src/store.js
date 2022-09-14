import { createStore, applyMiddleware, combineReducers, compose } from 'redux'
import { createEpicMiddleware } from 'redux-observable'
import todoReducer, { rootEpic } from './reducers/todo'
import messageReducer from './reducers/messages'

const epicMiddleware = createEpicMiddleware()
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const reducer = combineReducers({
  todo: todoReducer,
  message: messageReducer
})

// const epicMiddleware = createEpicMiddleware.run(rootEpic)

export default createStore(
  reducer,
  composeEnhancers(applyMiddleware(epicMiddleware))
)
epicMiddleware.run(rootEpic)
