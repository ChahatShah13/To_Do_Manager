import { useEffect, useState } from "react";
import NavBar from "./components/NavBar";
import { v4 as uuidv4 } from "uuid";

function App() {
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [showFinished, setshowFinished] = useState();

  // Load todos from localStorage on component mount
  useEffect(() => {
    const todoString = localStorage.getItem("todos");
    if (todoString) {
      const storedTodos = JSON.parse(todoString);
      setTodos(storedTodos);
    }
  }, []);

  // Save todos to localStorage
  const saveToLs = (updatedTodos) => {
    localStorage.setItem("todos", JSON.stringify(updatedTodos));
  };

  const toggleFinished = (e) => { 
    setshowFinished(!showFinished);
  }
  const handleEdit = (e, id) => {
    const todoToEdit = todos.find((item) => item.id === id);
    setTodo(todoToEdit.todo);
    const updatedTodos = todos.filter((item) => item.id !== id);
    setTodos(updatedTodos);
    saveToLs(updatedTodos);
  };

  const handleDelete = (e, id) => {
    const updatedTodos = todos.filter((item) => item.id !== id);
    setTodos(updatedTodos);
    saveToLs(updatedTodos);
  };

  const handleADD = () => {
    if (todo.trim() === "") return;
    const updatedTodos = [...todos, { id: uuidv4(), todo, isCompleted: false }];
    setTodos(updatedTodos);
    setTodo("");
    saveToLs(updatedTodos);
  };

  const handleChange = (e) => {
    setTodo(e.target.value);
  };

  const handleCheckbox = (e) => {
    const id = e.target.name;
    const index = todos.findIndex((item) => item.id === id);
    const updatedTodos = [...todos];
    updatedTodos[index].isCompleted = !updatedTodos[index].isCompleted;
    setTodos(updatedTodos);
    saveToLs(updatedTodos);
  };

  return (
    <>
      <NavBar />
      <div className="container mx-auto p-6 max-w-lg bg-white shadow-lg rounded-lg">
        {/* Add ToDo Section */}
        <div className="addtodo flex flex-col gap-4 mb-6">
          <h2 className="text-2xl font-extrabold text-gray-800">Add a ToDo</h2>
          <input
            onChange={handleChange}
            value={todo}
            type="text"
            placeholder="Enter your task..."
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <button
            onClick={handleADD}
            disabled={todo.trim() === ""}
            className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg font-bold hover:shadow-lg transition-all duration-200 ease-in-out"
          >
            Add
          </button>
        </div>
        <input onChange={toggleFinished} type="checkbox" name="" id="" checked={showFinished} /> Show Finished

        {/* ToDo List Section */}
        <h2 className="text-xl font-bold text-gray-800 mb-4">Your Todos</h2>
        <div className="todos flex flex-col gap-4">
          {todos.length === 0 && (
            <div className="text text-gray-700 text-center">
              No Todos To Display
            </div>
          )}
          {todos.map((item) => (
           (showFinished || !item.isCompleted) && <div
              key={item.id}
              className="todo flex justify-between items-center p-4 bg-gray-100 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 ease-in-out"
            >
              <input
                name={item.id}
                onChange={handleCheckbox}
                type="checkbox"
                checked={item.isCompleted}
              />
              <div
                className={`text text-gray-700 ${
                  item.isCompleted ? "line-through" : ""
                }`}
              >
                {item.todo}
              </div>
              <div className="buttons flex gap-2">
                <button
                  onClick={(e) => {
                    handleEdit(e, item.id);
                  }}
                  className="bg-blue-500 text-white px-3 py-1 rounded-lg font-medium hover:bg-blue-600 transition-all duration-200"
                >
                  Edit
                </button>
                <button
                  onClick={(e) => {
                    handleDelete(e, item.id);
                  }}
                  className="bg-red-500 text-white px-3 py-1 rounded-lg font-medium hover:bg-red-600 transition-all duration-200"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
