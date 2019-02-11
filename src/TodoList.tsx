import * as React from 'react'
import TodoStore from './TodoStore'
import { Todo } from './Interfaces'
import TodoItem from './TodoItem'
import * as cx from 'classnames'

type FilterOptions = 'all' | 'active' | 'completed'

const Filters = {
  all: (todo: Todo) => true,
  active: (todo: Todo) => !todo.completed,
  completed: (todo: Todo) => todo.completed
}

interface TodoListProps {
  
}

interface TodoListState {
  todos: Todo[],
  newTodo: string,
  filter: FilterOptions
}

export default class TodoList extends React.PureComponent<TodoListProps,TodoListState> {

  private store: TodoStore = new TodoStore()
  private toggleTodo: (todo: Todo) => void
  private removeTodo: (todo: Todo) => void
  private editTodo: (todo: Todo, title: string) => void
  private clearCompleted: () => void

  constructor(props: TodoListProps) {
    super(props)
    this.state = {
      todos: [],
      newTodo: '',
      filter: 'all'
    }
    this.store.onChange((store) => {
      this.setState({todos: store.todos})
    })
    this.toggleTodo = this.store.toggleTodo.bind(this.store)
    this.removeTodo = this.store.removeTodo.bind(this.store)
    this.editTodo = this.store.editTodo.bind(this.store)
    this.clearCompleted = this.store.clearCompleted.bind(this.store)
  }

  get remainingTodo(): number {
    return this.state.todos.reduce((count, todo) => !todo.completed ? count + 1 : count, 0)
  }

  get completedTodo(): number {
    return this.state.todos.reduce((count, todo) => todo.completed ? count + 1 : count, 0)
  }

  componentDidMount() {
    this.store.addTodo('todo1')
    this.store.addTodo('todo2')
  }

  render() {

    let {todos, newTodo, filter} = this.state
    let todosFiltered = todos.filter(Filters[filter])
    let remainingTodo = this.remainingTodo
    let completedTodo = this.completedTodo

    return (
      <main>
        <header>
          <h1>Todo-list</h1>
          <input
            value={newTodo}
            placeholder='What needs to be done?'
            onKeyDown={this.addNewTodo}
            onInput={this.editNewTodo}
          />
        </header>
        <section>
          {todos.length > 0 && <div>
            <input id='toggle-all' type='checkbox' checked={remainingTodo === 0} onChange={this.toggleAll}
            />
            <label htmlFor='toggle-all'>Mark all as completed</label>
          </div>}
          <ul className='todo-list'>
            {todosFiltered.map(todo => {
              return <TodoItem
                todo={todo}
                key={todo.id}
                onToggle={this.toggleTodo}
                onRemove={this.removeTodo}
                onEdit={this.editTodo}
              />
            })}
          </ul>
        </section>
        <footer>
          {remainingTodo > 0 && <span>{remainingTodo} item{remainingTodo > 1 && 's'} left</span>}
          <ul>
            <li><a href="#" className={cx({active: filter === 'all'})} onClick={this.setFilter('all')}>All</a></li>
            <li><a href="#" className={cx({active: filter === 'active'})} onClick={this.setFilter('active')}>Active</a></li>
            <li><a href="#" className={cx({active: filter === 'completed'})} onClick={this.setFilter('completed')}>Completed</a></li>
          </ul>
          {completedTodo > 0 && <input className='remove-all' type='submit' value='Clear completed' onClick={this.clearCompleted} />}
        </footer>
      </main>
    )

  }

  addNewTodo = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      this.setState({newTodo: ''})
    } else if (e.key === 'Enter' && this.state.newTodo !== '') {
      this.store.addTodo(this.state.newTodo)
      this.setState({newTodo: ''})
    }
  }

  editNewTodo = (e: React.FormEvent<HTMLInputElement>) => {
    this.setState({newTodo: (e.target as HTMLInputElement).value})
  }

  toggleAll = (e: React.FormEvent<HTMLInputElement>) => {
    this.store.toggleAllTodo(this.remainingTodo > 0)
  }

  setFilter = (filter: FilterOptions) => {
    return (e: React.MouseEvent<HTMLElement>) => {
      e.preventDefault()
      this.setState({filter})
    }
  }

}