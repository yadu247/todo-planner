import './todo.css';
const Todo = props => {
  return (
    <>
      <div
        className={
          props.completed
            ? props.gridview
              ? 'todo-grid todo-completed-grid'
              : 'todo todo-completed'
            : props.gridview
            ? 'todo-grid'
            : 'todo'
        }
      >
        <input
          checked={props.completed}
          type="checkbox"
          onChange={e => {
            props.onCheck(e, props.id);
          }}
        />
        <p
          style={{
            textDecoration: props.completed ? 'line-through' : 'none',
            textDecorationThickness: props.completed ? '2px' : 'none',
          }}
        >
          {props.data}
        </p>
        <p
          className="deadline"
          style={{
            display: props.gridview || props.completed ? 'none' : 'block',
          }}
        >
          <i
            className="fa-regular fa-clock"
            style={{
              display: props.deadline == '' ? 'none' : 'inline',
            }}
          ></i>
          {String(props.deadline)}
        </p>
        <div
          className={
            props.gridview ? 'priority-symbol-grid' : 'priority-symbol'
          }
          style={{
            display: props.completed ? 'none' : 'inline',
            backgroundColor:
              props.priority == 'low'
                ? 'green'
                : props.priority == 'high'
                ? 'red'
                : 'orange',
          }}
        ></div>
        <button
          className={props.gridview ? 'edit-btn-grid' : 'edit-btn'}
          onClick={() =>
            props.showEditModal(
              props.id,
              props.data,
              props.priority,
              props.deadline
            )
          }
          style={{ display: props.completed ? 'none' : 'inline' }}
        >
          <i className="fa-regular fa-pen-to-square"></i>
        </button>
        <button
          className={
            props.completed
              ? props.gridview
                ? 'delete-btn-completed-grid'
                : 'delete-btn-completed'
              : props.gridview
              ? 'delete-btn-completed-grid delete-btn-not-completed-grid'
              : 'delete-btn-completed delete-btn-not-completed'
          }
          onClick={() => props.onDeleteClick(props.id)}
        >
          <i className="fa-regular fa-trash-can"></i>
        </button>
      </div>
    </>
  );
};
export default Todo;
