import { useEffect, useState } from "react";
import NavBar from "./components/NavBar";
import { v4 as uuidv4 } from "uuid";

function App() {
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [showFinished, setShowFinished] = useState();
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [searchTerm, setSearchTerm] = useState(""); // State to handle search term
  const [filterPriority, setFilterPriority] = useState(""); // State to filter by priority
  const [sortOption, setSortOption] = useState(""); // State to handle sorting option

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
    setShowFinished(!showFinished);
  };

  const handleEdit = (e, id) => {
    const todoToEdit = todos.find((item) => item.id === id);
    setTodo(todoToEdit.todo);
    setDueDate(todoToEdit.dueDate);
    setPriority(todoToEdit.priority);
    const updatedTodos = todos.filter((item) => item.id !== id);
    setTodos(updatedTodos);
    saveToLs(updatedTodos);
  };

  const handleDelete = (e, id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this todo?");
    if (isConfirmed) {
      const updatedTodos = todos.filter((item) => item.id !== id);
      setTodos(updatedTodos);
      saveToLs(updatedTodos);
    }
  };

  const handleADD = () => {
    if (todo.trim() === "") return;
    const updatedTodos = [
      ...todos,
      { id: uuidv4(), todo, isCompleted: false, dueDate, priority }
    ];
    setTodos(updatedTodos);
    setTodo("");
    setDueDate("");
    setPriority("Medium");
    saveToLs(updatedTodos);
  };

  const handleChange = (e) => {
    setTodo(e.target.value);
  };

  const handleDueDateChange = (e) => {
    setDueDate(e.target.value);
  };

  const handlePriorityChange = (e) => {
    setPriority(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterPriorityChange = (e) => {
    setFilterPriority(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const handleCheckbox = (e) => {
    const id = e.target.name;
    const index = todos.findIndex((item) => item.id === id);
    const updatedTodos = [...todos];
    updatedTodos[index].isCompleted = !updatedTodos[index].isCompleted;
    setTodos(updatedTodos);
    saveToLs(updatedTodos);
  };

  // Filter todos based on search term and selected priority
  const filteredTodos = todos.filter((item) => {
    const matchesSearchTerm = item.todo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = filterPriority ? item.priority === filterPriority : true;
    return matchesSearchTerm && matchesPriority;
  });

  // Sort todos based on the selected option
  const sortedTodos = filteredTodos.sort((a, b) => {
    if (sortOption === "dueDate") {
      return new Date(a.dueDate) - new Date(b.dueDate);
    } else if (sortOption === "priority") {
      const priorityOrder = { Low: 1, Medium: 2, High: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    return 0; // No sorting if no option selected
  });

  // Function to get class for priority
  const getPriorityClass = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-300 border-red-600";
      case "Medium":
        return "bg-yellow-300 border-yellow-600";
      case "Low":
        return "bg-green-300 border-green-600";
      default:
        return "";
    }
  };

  return (
    <>
      <NavBar />
      <div className="container mx-auto p-6 max-w-lg bg-white shadow-lg rounded-lg my-3">
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
          <input
            onChange={handleDueDateChange}
            value={dueDate}
            type="date"
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <select
            onChange={handlePriorityChange}
            value={priority}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
          <button
            onClick={handleADD}
            disabled={todo.trim() === ""}
            className="cursor-pointer bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg font-bold hover:shadow-lg transition-all duration-200 ease-in-out"
          >
            Add
          </button>
        </div>
        <input onChange={toggleFinished} type="checkbox" checked={showFinished} /> Show Finished

        {/* Search, Filter, and Sort Section */}
        <div className="search-filter flex gap-4 mb-6">
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <select
            value={filterPriority}
            onChange={handleFilterPriorityChange}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <option value="">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
          <select
            value={sortOption}
            onChange={handleSortChange}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <option value="">Sort By</option>
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
          </select>
        </div>

        {/* ToDo List Section */}
        <h2 className="text-xl font-bold text-gray-800 mb-4">Your Todos</h2>
        <div className="todos flex flex-col gap-4">
          {sortedTodos.length === 0 && (
            <div className="text text-gray-700 text-center">No Todos To Display</div>
          )}
          {sortedTodos.map((item) =>
            (showFinished || !item.isCompleted) && (
              <div
                key={item.id}
                className={`todo flex justify-between items-center p-4 bg-gray-100 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 ease-in-out ${getPriorityClass(item.priority)}`}
              >
                <input
                  name={item.id}
                  onChange={handleCheckbox}
                  type="checkbox"
                  checked={item.isCompleted}
                />
                <div
                  className={`text text-gray-700 ${item.isCompleted ? "line-through" : ""}`}
                >
                  {item.todo}
                  {item.dueDate && (
                    <div className="text-sm text-gray-500 mt-2">Due: {item.dueDate}</div>
                  )}
                  <div className={`priority text-sm mt-2 ${item.priority.toLowerCase()}`}>
                    Priority: {item.priority}
                  </div>
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
            )
          )}
        </div>
      </div>
    </>
  );
}

export default App;
