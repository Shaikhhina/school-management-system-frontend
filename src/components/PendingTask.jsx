import React, { useEffect, useMemo, useState } from "react";

const PAGE_SIZE = 5;

function studentName(_, studentId) {
  return studentId?.fullName ?? "—";
}

function classLabel(grade) {
  return grade ? `Grade ${Number(grade)}` : "—";
}

function PendingTask({ onToggleCompleted }) {
  const [tasks, setTasks] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const fetchPendingTasks = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        "http://localhost:5001/taskAssign/pending-assigned-task"
      );
      const data = await res.json();

      if (data.success) {
        setTasks(data.data || []);
      } else {
        alert("Failed to fetch pending tasks");
      }
    } catch (error) {
      console.error(error);
      alert("Error fetching pending tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingTasks();
  }, []);

  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      const keyword = search.toLowerCase();

      const name = t.studentId?.fullName?.toLowerCase() || "";
      const classVal = t.classGrade?.toString().toLowerCase() || "";

      return name.includes(keyword) || classVal.includes(keyword);
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

  return (
    <div className="flex-1 p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-blue-800 mb-2">
          Pending Tasks
        </h1>

        <p className="text-gray-600 text-sm mb-4">
          Tasks that are not completed yet.
        </p>

        {/* 🔍 SEARCH BAR */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by student name or class..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1); 
            }}
            className="w-full md:w-1/2 border px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : filteredTasks.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md border p-10 text-center text-gray-500">
            No pending tasks
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
                    <th className="px-4 py-3 text-center">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {slice.map((t) => (
                    <tr key={t._id} className="hover:bg-amber-50/60">
                      <td className="px-4 py-3">
                        {classLabel(t.classGrade)}
                      </td>

                      <td className="px-4 py-3 font-medium">
                        {studentName(null, t.studentId)}
                      </td>

                      <td className="px-4 py-3">{t.title}</td>

                      <td className="px-4 py-3 text-gray-600">
                        {t.description}
                      </td>

                      <td className="px-4 py-3 text-gray-600">
                        {t.dueDate
                          ? new Date(t.dueDate).toLocaleDateString()
                          : "—"}
                      </td>

                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => onToggleCompleted?.(t._id)}
                          className="h-9 w-9 rounded-md border-2 border-gray-300 hover:bg-blue-50 hover:border-blue-400"
                          title="Mark as completed"
                        >
                          ✓
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between p-4 text-sm bg-gray-50 border-t">
              <span>
                {from}-{to} of {filteredTasks.length}
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

export default PendingTask;