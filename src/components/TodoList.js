import React, {Component , useEffect, useState} from 'react'
import {useSelector , useDispatch } from 'react-redux'
import {fetchTodos, toggleTodo, deleteTodo} from '../reducers/todo'

const TodoItem = ({id, title, completed,toggleTodo, deleteTodo , dispatch}) => (
  <li>
    <span className='delete-item'>
      <button onClick={() => dispatch(deleteTodo(id))}>X</button>
    </span>
    <input type="checkbox"
      checked={completed}
      onChange={() => dispatch(toggleTodo(id))} />
    {title}
  </li>
)

const TodoList = () => {
  const dispatch= useDispatch()

  useEffect(() => {
    dispatch(fetchTodos())
  },[])

  const {todos} = useSelector(state => state.todo)
  
  return (
    <div className="Todo-List">
    <ul>
      {todos.length > 0 && todos.map(todo =>
        <TodoItem key={todo.id}
          toggleTodo={toggleTodo}
          deleteTodo={deleteTodo}
          dispatch={dispatch}
          {...todo} />)}
    </ul>
  </div>
  )
}

export default TodoList
