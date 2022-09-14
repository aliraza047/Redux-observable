import React, {Component} from 'react'
import {connect} from 'react-redux'
import {fetchTodos, toggleTodo, deleteTodo, getVisibleTodos} from '../reducers/todo'

const TodoItem = ({id, title, completed,toggleTodo, deleteTodo}) => (
  <li>
    <span className='delete-item'>
      <button onClick={() => deleteTodo(id)}>X</button>
    </span>
    <input type="checkbox"
      checked={completed}
      onChange={() => toggleTodo(id)} />
    {title}
  </li>
)

class TodoList extends Component {
  componentDidMount() {
    this.props.fetchTodos()
  }

  render() {
    return (
      <div className="Todo-List">
        <ul>
          {this.props.todos.map(todo =>
            <TodoItem key={todo.id}
              toggleTodo={this.props.toggleTodo}
              deleteTodo={this.props.deleteTodo}
              {...todo} />)}
        </ul>
      </div>
    )
  }
}

export default connect(
  (state) => ({todos: state.todo.todos}),
  {fetchTodos, toggleTodo, deleteTodo}
)(TodoList)
