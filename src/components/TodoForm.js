import React from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {updateCurrent, saveTodo} from '../reducers/todo'

const TodoForm = () => {
  const dispatch= useDispatch()
  const {currentTodo} = useSelector(state => state.todo)
  const handleInputChange = (e) => {
    const val = e.target.value
    dispatch(updateCurrent(val))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(saveTodo(currentTodo))
  }
    return (
      <form onSubmit={handleSubmit}>
        <input type="text"
          onChange={handleInputChange}
          value={currentTodo}/>
      </form>
    )
  
}

export default TodoForm;
