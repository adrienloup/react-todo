import * as React from 'react'
import { Todo } from './Interfaces'
import * as cx from 'classnames'

interface TodoItemProps {
  todo: Todo
  onToggle: (todo: Todo) => void
  onRemove: (todo: Todo) => void
  onEdit: (todo: Todo, title: string) => void
}

interface TodoItemState {
  editing: boolean,
  title: string
}

export default class TodoItem extends React.PureComponent<TodoItemProps, TodoItemState> {

  constructor(props: TodoItemProps) {
    super(props)
    this.state = {
      editing: false,
      title: ''
    }
  }

  render() {
    let {todo} = this.props
    let {editing, title} = this.state
    return <li className={cx({completed: todo.completed, editing})}>
      <input id={todo.title} type='checkbox' onChange={this.toggle} checked={todo.completed} />
      <label htmlFor={todo.title} onDoubleClick={this.startEditing}>{todo.title}</label>
      <input
        type='text'
        className='edit'
        // defaultValue={title}
        value={title}
        onBlur={this.handleSubmit}
        onKeyDown={this.handleKeyDown}
        onInput={this.handleInput}
      />
      <input type='submit' value='Remove' onClick={this.destroy} />
    </li>
  }

  toggle = () => {
    this.props.onToggle(this.props.todo)
  }

  destroy = () => {
    this.props.onRemove(this.props.todo)
  }

  startEditing = (e: React.MouseEvent<HTMLLabelElement>) => {
    e.preventDefault()
    this.setState({editing: true, title: this.props.todo.title})
  }

  handleSubmit = () => {
    this.props.onEdit(this.props.todo, this.state.title)
    this.setState({editing: false})
  }

  handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      this.setState({editing: false, title: this.props.todo.title})
    } else if (e.key === 'Enter') {
      this.handleSubmit()
    }
  }

  handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    this.setState({title: (e.target as HTMLInputElement).value})
  }

}