import React, { useEffect, useMemo, useState } from "react";

const PAGE_SIZE = 5;

function IconEdit() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
      />
      <path
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
      />
    </svg>
  );
}

function IconTrash() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14zM10 11v6M14 11v6"
      />
    </svg>
  );
}

function ViewStudentList({ onEdit }) {
  const [students, setStudents] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");

  const fetchStudents = async () => {
    try {
      setLoading(true);

      const res = await fetch("http://localhost:5001/student/get-all-student");
      const data = await res.json();

      if (data.success) {
        setStudents(data.data);
      } else {
        alert(data.message || "Failed to fetch students");
      }
    } catch (error) {
      console.error(error);
      alert("Error fetching students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const keyword = search.toLowerCase();

      return (
        s.fullName?.toLowerCase().includes(keyword) ||
        s.studentId?.toString().toLowerCase().includes(keyword) ||
        s.grade?.toString().toLowerCase().includes(keyword)
      );
    });
  }, [students, search]);

  const totalPages = Math.max(1, Math.ceil(filteredStudents.length / PAGE_SIZE));
  const safePage = Math.min(Math.max(1, page), totalPages);

  useEffect(() => {
    setPage((p) => Math.min(p, totalPages));
  }, [totalPages, filteredStudents.length]);

  const { slice, from, to } = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;

    return {
      slice: filteredStudents.slice(start, end),
      from: filteredStudents.length === 0 ? 0 : start + 1,
      to: start + Math.min(PAGE_SIZE, filteredStudents.length - start),
    };
  }, [filteredStudents, safePage]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this student?")) return;

    try {
      const res = await fetch(
        `http://localhost:5001/student/delete-student/${id}`,
        { method: "DELETE" }
      );

      const data = await res.json();

      if (data.success) {
        alert("Student deleted ✅");
        fetchStudents();
      } else {
        alert(data.message || "Delete failed");
      }
    } catch (error) {
      console.error(error);
      alert("Error deleting student");
    }
  };

  return (
    <div className="flex-1 p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-blue-800 mb-4">
          Students
        </h1>

        {/* 🔍 SEARCH BAR */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by name, student ID or class..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1); 
            }}
            className="w-full md:w-1/2 border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {loading ? (
          <p className="text-center text-gray-600">Loading...</p>
        ) : filteredStudents.length === 0 ? (
          <p className="text-center text-gray-500">No students found</p>
        ) : (
          <div className="bg-white rounded-lg shadow-md border overflow-hidden">
            <table className="min-w-full text-sm">
              <thead className="bg-blue-800 text-white">
                <tr>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Email</th>
                  <th className="px-4 py-2">Student ID</th>
                  <th className="px-4 py-2">Grade</th>
                  <th className="px-4 py-2">Section</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>

              <tbody>
                {slice.map((s) => (
                  <tr key={s._id}>
                    <td className="px-4 py-2">{s.fullName}</td>
                    <td className="px-4 py-2">{s.email}</td>
                    <td className="px-4 py-2">{s.studentId}</td>
                    <td className="px-4 py-2">Grade {s.grade}</td>
                    <td className="px-4 py-2">{s.section || "-"}</td>

                    <td className="px-4 py-2 flex gap-2">
                      <button onClick={() => onEdit && onEdit(s)}>
                        <IconEdit />
                      </button>

                      <button onClick={() => handleDelete(s._id)}>
                        <IconTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex justify-between p-4">
              <button
                disabled={safePage <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </button>

              <span>
                Page {safePage} of {totalPages}
              </span>

              <button
                disabled={safePage >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewStudentList;