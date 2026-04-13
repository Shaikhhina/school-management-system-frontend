import React, { useEffect, useMemo, useState } from "react";

const PAGE_SIZE = 5;


function studentName(_, studentId) {
  return studentId?.fullName ?? "—";
}

function classLabel(grade) {
  return grade ? `Grade ${Number(grade)}` : "—";
}

function IconCheck() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
}

function AllTask({ students = [] }) {
  const [tasks, setTasks] = useState([]);
  const [page, setPage] = useState(1);
  const [loadingId, setLoadingId] = useState(null);
  const [loading, setLoading] = useState(true);

 
  const [search, setSearch] = useState("");

 
  const fetchTasks = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        "http://localhost:5001/taskAssign/get-all-assign-task"
      );
      const data = await res.json();

      if (data.success) {
        setTasks(data.data || []);
      } else {
        alert("Failed to fetch tasks");
      }
    } catch (error) {
      console.error(error);
      alert("Error fetching tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);


  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      const keyword = search.toLowerCase();

      const studentNameValue = t.studentId?.fullName?.toLowerCase() || "";
      const classValue = t.classGrade?.toString().toLowerCase() || "";

      return (
        studentNameValue.includes(keyword) ||
        classValue.includes(keyword)
      );
    });
  }, [tasks, search]);


  const totalPages = Math.max(
    1,
    Math.ceil(filteredTasks.length / PAGE_SIZE)
  );

  const safePage = Math.min(Math.max(1, page), totalPages);

  useEffect(() => {
    setPage((p) => Math.min(p, totalPages));
  }, [totalPages, filteredTasks.length]);

  const { slice, from, to } = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;

    return {
      slice: filteredTasks.slice(start, end),
      from: filteredTasks.length === 0 ? 0 : start + 1,
      to: start + Math.min(PAGE_SIZE, filteredTasks.length - start),
    };
  }, [filteredTasks, safePage]);

 
  const handleToggle = async (task) => {
    try {
      setLoadingId(task._id);

      const newStatus =
        task.status === "completed" ? "pending" : "completed";

      const res = await fetch(
        `http://localhost:5001/taskAssign/update-status/${task._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      const data = await res.json();

      if (data.success) {
        fetchTasks();
      } else {
        alert("Failed to update status");
      }
    } catch (error) {
      console.error(error);
      alert("Error updating status");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="flex-1 p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-blue-800 mb-2">
          All Tasks
        </h1>

        {/* 🔍 SEARCH BAR */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by student name or class..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1); // reset page
            }}
            className="w-full md:w-1/2 border px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Loading tasks...</p>
        ) : filteredTasks.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md border p-10 text-center text-gray-500">
            No tasks found
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm text-gray-800">
                <thead className="bg-blue-800 text-white text-xs uppercase">
                  <tr>
                    <th className="px-4 py-3">Class</th>
                    <th className="px-4 py-3">Student</th>
                    <th className="px-4 py-3">Title</th>
                    <th className="px-4 py-3">Description</th>
                    <th className="px-4 py-3">Due Date</th>
                    <th className="px-4 py-3 text-center">Status</th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {slice.map((t) => (
                    <tr
                      key={t._id}
                      className={
                        t.status === "completed" ? "bg-green-50" : ""
                      }
                    >
                      <td className="px-4 py-3">
                        {classLabel(t.classGrade)}
                      </td>

                      <td className="px-4 py-3 font-medium">
                        {studentName(students, t.studentId)}
                      </td>

                      <td className="px-4 py-3">{t.title}</td>

                      <td className="px-4 py-3 text-gray-600">
                        {t.description}
                      </td>

                      <td className="px-4 py-3">
                        {t.dueDate
                          ? new Date(t.dueDate).toLocaleDateString()
                          : "—"}
                      </td>

                      <td className="px-4 py-3 text-center">
                        <button
                          disabled={loadingId === t._id}
                          onClick={() => handleToggle(t)}
                          className={`h-9 w-9 flex items-center justify-center rounded-md border-2 ${
                            t.status === "completed"
                              ? "bg-green-600 border-green-600 text-white"
                              : "border-gray-300"
                          }`}
                        >
                          {t.status === "completed" && <IconCheck />}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between p-4 text-sm">
              <span>
                {from}–{to} of {filteredTasks.length}
              </span>

              <div className="flex gap-2">
                <button
                  disabled={safePage <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="border px-3 py-1 rounded"
                >
                  Prev
                </button>

                <span>
                  {safePage} / {totalPages}
                </span>

                <button
                  disabled={safePage >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="border px-3 py-1 rounded"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AllTask;