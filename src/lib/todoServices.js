import uuid from 'react-uuid';
const baseUrl = 'https://jsonplaceholder.typicode.com/posts'
const postUrl = 'https://jsonplaceholder.typicode.com/posts'


export const getTodos = () => {
  return fetch(baseUrl)
  .then(res => res.json()) 
}

export const createTodo = (name) => {
  return fetch(postUrl, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      title: name,
      body: name,
      id:uuid(),
      userId: 3,
      completed: false
    })
  })
    .then(res => res.json())
}

export const updateTodo = (todo) => {
  return fetch(`${postUrl}/${todo.id}`, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(todo)
  })
    .then(res => res.json())
}

export const destroyTodo = (id) => {
  return fetch(`${postUrl}/${id}`, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  })
}
