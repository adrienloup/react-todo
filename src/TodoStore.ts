import { Todo } from './Interfaces'

declare type ChangeCallBack = (store: TodoStore) => void

export default class TodoStore {

  private static i = 0
  public todos: Todo[] = []
  private callBacks: ChangeCallBack[] = []
  private static increment() {
    return this.i++
  }

  inform() {
    this.callBacks.forEach(cb => cb(this))
  }

  onChange(cb: ChangeCallBack) {
    this.callBacks.push(cb)
  }

  addTodo(title: string): void {
    this.todos = [{
      id: TodoStore.increment(),
      title: title,
      completed: false
    }, ...this.todos]
    this.inform()
  }

  editTodo(todo: Todo, title: string): void {
    this.todos = this.todos.map(t => t === todo ? { ...t, title } : t)
    this.inform()
  }

  toggleTodo(todo: Todo): void {
    this.todos = this.todos.map(t => t === todo ? { ...t, completed: !t.completed } : t)
    this.inform()
  }

  toggleAllTodo(completed = true): void {
    this.todos = this.todos.map(t => completed !== t.completed ? { ...t, completed } : t)
    this.inform()
  }

  removeTodo(todo: Todo): void {
    this.todos = this.todos.filter(t => t !== todo)
    this.inform()
  }

  clearCompleted(): void {
    this.todos = this.todos.filter(t => !t.completed)
    this.inform()
  }

}