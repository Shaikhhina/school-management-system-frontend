import React from "react";
import { useState } from "react";
import AddStudent from "./AddStudent";
import AllTask from "./AllTask";
import AssignTask from "./AssignTask";
import CompletedTask from "./CompletedTask";
import PendingTask from "./PendingTask";
import ViewStudentList from "./ViewStudentList";

const Dashboard = () => {
  const [showStudentSubmenu, setShowStudentSubmenu] = useState(false);
  const [showAssignmentSubmenu, setShowAssignmentSubmenu] = useState(false);
  const [studentView, setStudentView] = useState(null);
  const [assignmentView, setAssignmentView] = useState(null);
  const [students, setStudents] = useState([]);
  const [editingStudent, setEditingStudent] = useState(null);
  const [tasks, setTasks] = useState([]);

  const newId = () =>
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  const saveStudent = (data, existingId) => {
    if (existingId) {
      setStudents((prev) =>
        prev.map((s) => (s.id === existingId ? { ...data, id: existingId } : s))
      );
      setEditingStudent(null);
      setAssignmentView(null);
      setStudentView("list");
      return;
    }
    const row = { ...data, id: newId() };
    setStudents((prev) => [...prev, row]);
  };

  const deleteStudent = (id) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
  };

  const startAddStudent = () => {
    setAssignmentView(null);
    setEditingStudent(null);
    setStudentView("add");
  };

  const startEditStudent = (student) => {
    setAssignmentView(null);
    setEditingStudent(student);
    setStudentView("add");
  };

  const openStudentList = () => {
    setAssignmentView(null);
    setStudentView("list");
  };

  const openAssignTask = () => {
    setStudentView(null);
    setAssignmentView("assign");
  };

  const openAllTasks = () => {
    setStudentView(null);
    setAssignmentView("all");
  };

  const openPendingTasks = () => {
    setStudentView(null);
    setAssignmentView("pending");
  };

  const openCompletedTasks = () => {
    setStudentView(null);
    setAssignmentView("completed");
  };

  const saveTask = (data) => {
    const row = { ...data, id: newId(), completed: false };
    setTasks((prev) => [...prev, row]);
  };

  const toggleTaskCompleted = (taskId) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, completed: !(t.completed ?? false) } : t
      )
    );
  };

  const cancelEdit = () => {
    setEditingStudent(null);
    setAssignmentView(null);
    setStudentView("list");
  };

  const handleLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("admin");
  

    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      <aside className="w-72 bg-blue-800 text-white p-6 flex flex-col min-h-screen">
  <nav className="space-y-3 flex-1">
    {/* Students */}
    <button
      type="button"
      onClick={() => setShowStudentSubmenu(!showStudentSubmenu)}
      className="w-full font-semibold text-blue-100 hover:text-white"
    >
      Students {showStudentSubmenu ? "▾" : "▸"}
    </button>

    {showStudentSubmenu && (
      <div className="ml-3 space-y-2 text-sm font-semibold text-blue-200">
        <button
          onClick={startAddStudent}
          className="block w-full text-left hover:text-white"
        >
          Add Student
        </button>
        <button
          onClick={openStudentList}
          className="block w-full text-left hover:text-white"
        >
          View List
        </button>
      </div>
    )}

    {/* Assignments */}
    <button
      type="button"
      onClick={() => setShowAssignmentSubmenu(!showAssignmentSubmenu)}
      className="w-full font-semibold text-blue-100 hover:text-white"
    >
      Assignments {showAssignmentSubmenu ? "▾" : "▸"}
    </button>

    {showAssignmentSubmenu && (
      <div className="ml-3 space-y-2 text-sm font-semibold text-blue-200">
        <button onClick={openAssignTask} className="block w-full text-left hover:text-white">
          Assign Task
        </button>
        <button onClick={openPendingTasks} className="block w-full text-left hover:text-white">
          Pending Tasks
        </button>
        <button onClick={openCompletedTasks} className="block w-full text-left hover:text-white">
          Completed Tasks
        </button>
        <button onClick={openAllTasks} className="block w-full text-left hover:text-white">
          All Tasks
        </button>
      </div>
    )}
  </nav>

  {/* ✅ Logout fixed at bottom */}
  <div className="mt-auto pt-6">
    <button
      onClick={handleLogout}
      className="w-full bg-white text-blue-600 font-semibold py-2 rounded-md hover:bg-gray-100 transition"
    >
      Logout
    </button>
  </div>
</aside>
      

      <main className="flex-1 overflow-auto">
        {assignmentView === "assign" ? (
          <AssignTask students={students} onSubmitted={saveTask} />
        ) : assignmentView === "pending" ? (
          <PendingTask
            tasks={tasks}
            students={students}
            onToggleCompleted={toggleTaskCompleted}
          />
        ) : assignmentView === "all" ? (
          <AllTask tasks={tasks} students={students} onToggleCompleted={toggleTaskCompleted} />
        ) : assignmentView === "completed" ? (
          <CompletedTask
            tasks={tasks}
            students={students}
            onToggleCompleted={toggleTaskCompleted}
          />
        ) : studentView === "add" ? (
          <AddStudent
            editingStudent={editingStudent}
            onSubmitted={saveStudent}
            onCancelEdit={editingStudent ? cancelEdit : undefined}
          />
        ) : studentView === "list" ? (
          <ViewStudentList
            students={students}
            onEdit={startEditStudent}
            onDelete={deleteStudent}
          />
        ) : (
          <div className="p-10 text-gray-500">
            <p className="text-lg font-medium text-gray-700">Welcome</p>
            <p className="mt-2">
              Open <span className="font-semibold text-blue-800">Students</span> → Add Student or
              View List, or <span className="font-semibold text-blue-800">Assignments</span> →
              Assign Task, Pending Tasks, All Tasks, or Completed Tasks.
            </p>
            {tasks.length > 0 ? (
              <p className="mt-3 text-sm text-gray-600">
                Tasks assigned this session: <strong>{tasks.length}</strong>
              </p>
            ) : null}
          </div>
        )}
      </main>


      
    </div>

    
  );
};

export default Dashboard;
