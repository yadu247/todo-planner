import { useState, useRef } from 'react';
import Todo from './components/Todo';
import uniqid from 'uniqid';
import { Bounce, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Modal, Button, Dropdown, Space } from 'antd';
import { DownOutlined, UserOutlined } from '@ant-design/icons';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import './App.css';
const App = () => {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState({
    value: '',
    priority: 'low',
    deadline: '',
  });
  const [todoSort, setTodoSort] = useState('all');
  const [gridview, setGridview] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editDetails, setEditDetails] = useState({
    id: '',
    value: '',
    data: '',
    priority: '',
    deadline: '',
  });
  const createBtnRef = useRef();
  const onCreateClick = () => {
    if (inputValue.value != '') setIsCreateModalOpen(true);
  };
  const handleCreateOk = () => {
    setIsCreateModalOpen(false);
    if (inputValue.value != '') {
      setTodos([
        ...todos,
        {
          id: uniqid(),
          content: inputValue.value,
          completed: false,
          priority: inputValue.priority,
          deadline: inputValue.deadline,
        },
      ]);
      setInputValue({
        value: '',
        priority: 'low',
        deadline: '',
      });
    }
  };
  const handleCreateCancel = () => {
    setIsCreateModalOpen(false);
    setInputValue({
      value: '',
      priority: 'low',
      deadline: '',
    });
  };
  const onClickEnter = e => {
    if (e.key == 'Enter') createBtnRef.current.click();
  };
  const items = [
    {
      label: 'High',
      key: 'high',
      icon: <UserOutlined />,
      danger: true,
    },
    {
      label: 'Medium',
      key: 'medium',
      icon: <UserOutlined />,
    },
    {
      label: 'Low',
      key: 'low',
      icon: <UserOutlined />,
    },
  ];
  const handleMenuClick = e => {
    setInputValue({ ...inputValue, priority: e.key ? e.key : 'low' });
  };
  const menuProps = {
    items,
    onClick: handleMenuClick,
  };
  const handleMenuClickEdit = e => {
    setEditDetails({ ...editDetails, priority: e.key });
  };
  const menuPropsEdit = {
    items,
    onClick: handleMenuClickEdit,
  };
  const onCheck = (e, id) => {
    const todoCopy = [...todos];
    let index = 0;
    for (var i = 0; i < todoCopy.length; i++) {
      if (todoCopy[i].id == id) {
        index = i;
      }
    }
    todoCopy[index].completed = e.target.checked;
    setTodos(todoCopy);
  };
  const showEditModal = (id, data, priority, deadline) => {
    setIsEditModalOpen(true);
    setEditDetails({
      ...editDetails,
      id: id,
      value: data,
      priority: priority,
      deadline: deadline,
    });
  };
  const handleOk = () => {
    setIsEditModalOpen(false);
    const todoCopy = [...todos];
    let index = 0;
    for (var i = 0; i < todoCopy.length; i++) {
      if (todoCopy[i].id == editDetails.id) {
        index = i;
      }
    }
    todoCopy[index].content = editDetails.value;
    todoCopy[index].priority = editDetails.priority;
    todoCopy[index].deadline = editDetails.deadline;
    setEditDetails({ id: '', value: '', data: '', priority: '', deadline: '' });
  };
  const handleCancel = () => {
    setIsEditModalOpen(false);
    setEditDetails({ id: '', value: '', data: '', priority: '', deadline: '' });
  };
  const onDeleteClick = id => {
    const todoCopy = [...todos];
    let index = 0;
    for (var i = 0; i < todoCopy.length; i++) {
      if (todoCopy[i].id == id) {
        index = i;
      }
    }
    todoCopy.splice(index, 1);
    setTodos(todoCopy);
    toast.success('Deleting...', {
      position: 'bottom-center',
      autoClose: 2000,
      draggable: true,
      theme: 'dark',
      transition: Bounce,
      className: 'delete-toast',
    });
  };
  const clickAll = () => {
    setTodoSort('all');
  };
  const clickCompleted = () => {
    setTodoSort('completed');
  };
  const clickPending = () => {
    setTodoSort('pending');
  };
  const onTodoSortClicked = () => {
    if (todoSort == 'all') return todos;
    else if (todoSort == 'completed')
      return todos.filter(todo => todo.completed == true);
    else if (todoSort == 'pending')
      return todos.filter(todo => todo.completed == false);
  };
  return (
    <>
      <div className="container">
        <h1>TODO PLANNER</h1>
        <div className="create-todo">
          <input
            value={inputValue.value}
            type="text"
            onChange={e =>
              setInputValue({ ...inputValue, value: e.target.value })
            }
            onKeyDown={onClickEnter}
          />
          <button ref={createBtnRef} onClick={onCreateClick}>
            +
          </button>
        </div>
        <Modal
          className="create-modal"
          title="Create Todo"
          open={isCreateModalOpen}
          onOk={handleCreateOk}
          onCancel={handleCreateCancel}
        >
          <label htmlFor="create-todo-title">Title</label>
          <input
            id="create-todo-title"
            type="text"
            value={inputValue.value}
            onChange={e => {
              setInputValue({ ...inputValue, value: e.target.value });
            }}
          ></input>
          <Dropdown className="priority-dropdown" menu={menuProps}>
            <Button>
              <Space>
                Priority
                <DownOutlined />
              </Space>
            </Button>
          </Dropdown>
          <p>{inputValue.priority}</p>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              value={inputValue.deadline ? dayjs(inputValue.deadline) : dayjs()}
              className="deadline-picker"
              label="Deadline"
              onChange={e => {
                let deadline = String(e.$d);
                deadline = deadline.slice(0, 15);
                setInputValue({ ...inputValue, deadline: deadline });
              }}
            />
          </LocalizationProvider>
        </Modal>
        <button
          onClick={() => {
            setGridview(!gridview);
          }}
          className="gridview-btn"
        >
          <i className="fa-solid fa-grip"></i>
        </button>
        <div className="line-break"></div>
        <div className="sort-todo">
          <p
            className={
              todoSort == 'all'
                ? 'sort-todo-options-selected'
                : 'sort-todo-options'
            }
            onClick={clickAll}
          >
            All
          </p>
          <p
            className={
              todoSort == 'completed'
                ? 'sort-todo-options-selected'
                : 'sort-todo-options'
            }
            onClick={clickCompleted}
          >
            Completed
          </p>
          <p
            className={
              todoSort == 'pending'
                ? 'sort-todo-options-selected'
                : 'sort-todo-options'
            }
            onClick={clickPending}
          >
            Pending
          </p>
        </div>
        <div className="todo-container">
          {todos.length == 0 ? (
            <p className="empty-todo-message">No data to display</p>
          ) : (
            onTodoSortClicked().map(
              (
                todo //creates a Todo component for each of the todo item
              ) => (
                <Todo
                  data={todo.content}
                  id={todo.id}
                  priority={todo.priority}
                  onCheck={onCheck}
                  completed={todo.completed}
                  onDeleteClick={onDeleteClick}
                  showEditModal={showEditModal}
                  gridview={gridview}
                  deadline={todo.deadline}
                />
              )
            )
          )}
        </div>
        <Modal
          className="edit-modal"
          title="Edit Todo"
          open={isEditModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <input
            type="text"
            value={editDetails.value}
            onChange={e => {
              setEditDetails({ ...editDetails, value: e.target.value });
            }}
          ></input>
          <Dropdown className="priority-dropdown" menu={menuPropsEdit}>
            <Button>
              <Space>
                Priority
                <DownOutlined />
              </Space>
            </Button>
          </Dropdown>
          <p>{editDetails.priority}</p>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              value={
                editDetails.deadline ? dayjs(editDetails.deadline) : dayjs()
              }
              className="deadline-picker"
              label="Deadline"
              onChange={e => {
                let deadline = String(e.$d);
                deadline = deadline.slice(0, 15);
                setEditDetails({ ...editDetails, deadline: deadline });
              }}
            />
          </LocalizationProvider>
        </Modal>
        <ToastContainer />
      </div>
    </>
  );
};
export default App;
