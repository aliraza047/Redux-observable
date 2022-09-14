import { combineEpics, ofType } from 'redux-observable'
import { of, from, merge } from 'rxjs'
import {
  map,
  switchMap,
  withLatestFrom,
  delay,
  takeUntil
} from 'rxjs/operators'
import {
  getTodos,
  createTodo,
  updateTodo,
  destroyTodo
} from '../lib/todoServices'
import { showMessage } from './messages'

const initState = {
  todos: [],
  currentTodo: ''
}

const TOGGLE_TODO = 'TOGGLE_TODO'
const SAVE_TODO = 'SAVE_TODO'
const FETCH_TODOS = 'FETCH_TODOS'
const DELETE_TODO = 'DELETE_TODO'
export const TODO_ADD = 'TODO_ADD'
export const TODOS_LOAD = 'TODOS_LOAD'
const CURRENT_UPDATE = 'CURRENT_UPDATE'
export const TODO_REPLACE = 'TODO_REPLACE'
export const TODO_REMOVE = 'TODO_REMOVE'

export const updateCurrent = val => ({ type: CURRENT_UPDATE, payload: val })
export const loadTodos = todos => ({ type: TODOS_LOAD, payload: todos })
export const addTodo = todo => ({ type: TODO_ADD, payload: todo })
export const replaceTodo = todo => ({ type: TODO_REPLACE, payload: todo })
export const removeTodo = id => ({ type: TODO_REMOVE, payload: id })

// Used to be thunks, now standard action creators
export const fetchTodos = () => ({ type: FETCH_TODOS })
export const saveTodo = name => ({ type: SAVE_TODO, payload: name })
export const toggleTodo = id => ({ type: TOGGLE_TODO, payload: id })
export const deleteTodo = id => ({ type: DELETE_TODO, payload: id })

// Delay the message and only show it when the request takes too long
export const fetchTodosEpic = action$ =>
  action$.pipe(
    ofType(FETCH_TODOS),
    switchMap(() => {
      const load$ = from(getTodos()).pipe(map(loadTodos), delay(2000))
      const message$ = of(showMessage('Loading Todos - Rx style')).pipe(
        delay(1000),
        takeUntil(load$)
      )
      return merge(message$, load$)
    })
  )

export const saveTodoEpic = action$ =>
  action$.pipe(
    ofType(SAVE_TODO),
    switchMap(({ payload }) => {
      const create$ = from(createTodo(payload)).pipe(map(res => addTodo(res)))
      const message$ = of(showMessage('Saving todo')).pipe(
        delay(300),
        takeUntil(create$)
      )
      
      return merge(message$, create$)
    })
  )

export const toggleTodoEpic = (action$, state$) =>
  action$.pipe(
    ofType(TOGGLE_TODO),
    withLatestFrom(state$),
    switchMap(([action, state]) => {
      const id = action.payload
      const { todos } = state.todo
      console.log('all todos',todos)
      const todo = todos.find(t => t.id === id)
      const toggled = { ...todo, completed: !todo.completed }
      console.log('updated', toggled)
      const update$ = from(updateTodo(toggled)).pipe(map(replaceTodo))
      const message$ = of(showMessage('Saving todo update')).pipe(
        delay(300),
        takeUntil(update$)
      )
      return merge(update$, message$)
    })
  )

export const deleteTodoEpic = action$ =>
  action$.pipe(
    ofType(DELETE_TODO),
    switchMap(({ payload }) => {
      const id = payload
      const delete$ = from(destroyTodo(id)).pipe(map(() => removeTodo(id)))
      const message$ = of(showMessage('Removing Todo')).pipe(
        delay(300),
        takeUntil(delete$)
      )
      return merge(delete$, message$)
    })
  )

export const rootEpic = combineEpics(
  fetchTodosEpic,
  saveTodoEpic,
  toggleTodoEpic,
  deleteTodoEpic
)

export default (state = initState, action) => {
  switch (action.type) {
    case TODO_ADD:
      console.log('add todo', action.payload)
      return {
        ...state,
        currentTodo: '',
      todos: [...state.todos , action.payload]
      }
    case TODOS_LOAD:
      console.log('hh',action.payload)
      return { ...state, todos: action.payload }
    case CURRENT_UPDATE:
      return { ...state, currentTodo: action.payload }
    case TODO_REPLACE:
      return {
        ...state,
        todos: state.todos.map(
          t => (t.id === action.payload.id ? action.payload : t)
        )
      }
    case TODO_REMOVE:
      return {
        ...state,
        todos: state.todos.filter(t => t.id !== action.payload)
      }
    default:
      return state
  }
}
