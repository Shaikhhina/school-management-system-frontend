import React, { useEffect, useMemo, useState } from "react";

const initialForm = {
  classGrade: "",
  studentId: "",
  title: "",
  description: "",
  dueDate: "",
};

const inputClass =
  "w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500";

function AssignTask() {
  const [form, setForm] = useState(initialForm);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:5001/student/get-all-student");
        const data = await res.json();
  
        setStudents(data.data || []); 
      } catch (error) {
        console.error(error);
        alert("Error fetching students");
      } finally {
        setLoading(false);
      }
    };
  
    fetchStudents();
  }, []);

  const studentsInClass = useMemo(() => {
    console.log("Students:", students);
    console.log("Selected classGrade:", form.classGrade, typeof form.classGrade);
    console.log("Student grade:", students[0]?.grade, typeof students[0]?.grade);
    
    return students.filter(
      (s) => String(s.grade) === String(form.classGrade)
    );
  }, [students, form.classGrade]);

  

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.classGrade || !form.studentId || !form.title || !form.description) {
      alert("Please fill all required fields");
      return;
    }

    try {
      const res = await fetch(
        "http://localhost:5001/taskAssign/assign-task",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();

      if (data.success) {
        alert("Task Assigned ✅");
        setForm(initialForm);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Server error");
    }
  };

  return (
    <div className="p-10">
      <h1 className="text-xl font-bold mb-6">Assign Task</h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* CLASS */}
        <div>
          <label>Select Class *</label>
          <select
            value={form.classGrade}
            onChange={(e) => updateField("classGrade", e.target.value)}
            className={inputClass}
          >
            <option value="">Select class</option>
            {[...Array(12)].map((_, i) => (
              <option key={i + 1} value={String(i + 1)}>
                Grade {i + 1}
              </option>
            ))}
          </select>
        </div>

        {/* STUDENT */}
       {/* STUDENT */}
<div>
  <label>Select Student *</label>
  <select
    value={form.studentId}
    onChange={(e) => updateField("studentId", e.target.value)}
    className={inputClass}
  >
    <option value="">
      {!form.classGrade
        ? "Select class first"
        : studentsInClass.length === 0
        ? `No students found in Grade ${form.classGrade}` 
        : "Select student"}
    </option>

    {studentsInClass.map((s) => (
      <option key={s._id} value={s._id}>
        {s.fullName}
      </option>
    ))}
  </select>
</div>
        {/* TITLE */}
        <input
          type="text"
          placeholder="Task Title"
          value={form.title}
          onChange={(e) => updateField("title", e.target.value)}
          className={inputClass}
        />

        {/* DESCRIPTION */}
        <textarea
          placeholder="Task Description"
          value={form.description}
          onChange={(e) => updateField("description", e.target.value)}
          className={inputClass}
        />

        {/* DATE */}
        <input
          type="date"
          value={form.dueDate}
          onChange={(e) => updateField("dueDate", e.target.value)}
          className={inputClass}
        />

        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Assign Task
        </button>
      </form>
    </div>
  );
}

export default AssignTask;