import React, { useEffect, useState } from "react";

const initialForm = {
  fullName: "",
  email: "",
  studentId: "",
  grade: "",
  section: "",
  dateOfBirth: "",
  guardianName: "",
  guardianPhone: "",
  address: "",
};

const inputClass =
  "w-full border border-gray-300 rounded px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500";

const labelClass = "block text-sm font-medium text-gray-700 mb-1";

function AddStudent({ editingStudent, onSubmitted, onCancelEdit }) {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);

 
  useEffect(() => {
    if (editingStudent) {
      const { id, ...rest } = editingStudent;
      setForm(rest);
    } else {
      setForm(initialForm);
    }
  }, [editingStudent]);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.fullName ||
      !form.email ||
      !form.studentId ||
      !form.grade ||
      !form.dateOfBirth ||
      !form.guardianName ||
      !form.guardianPhone
    ) {
      alert("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);

      const url = editingStudent
        ? `http://localhost:5001/student/update-student/${editingStudent._id}`
        : "http://localhost:5001/student/add-student";

      const method = editingStudent ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      console.log("API Response:", data);

      if (data.success) {
        alert(
          editingStudent
            ? "Student updated successfully ✅"
            : "Student added successfully ✅"
        );

        setForm(initialForm);
        onSubmitted && onSubmitted(data.data);
      } else {
        alert(data.message || "Something went wrong");
      }
    } catch (error) {
      console.error(error);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  const isEditing = !!editingStudent;

  return (
    <div className="flex-1 p-6 md:p-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-blue-800 mb-2">
          {isEditing ? "Edit Student" : "Add Student"}
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow-md p-6 md:p-8 space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div>
              <label className={labelClass}>Full name *</label>
              <input
                type="text"
                value={form.fullName}
                onChange={(e) => updateField("fullName", e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Email *</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Student ID *</label>
              <input
                type="text"
                value={form.studentId}
                onChange={(e) => updateField("studentId", e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Date of Birth *</label>
              <input
                type="date"
                value={form.dateOfBirth}
                onChange={(e) => updateField("dateOfBirth", e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Grade *</label>
              <select
                value={form.grade}
                onChange={(e) => updateField("grade", e.target.value)}
                className={inputClass}
              >
                <option value="">Select class</option>
                {[...Array(12)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    Grade {i + 1}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>Section</label>
              <input
                type="text"
                value={form.section}
                onChange={(e) => updateField("section", e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Guardian Name *</label>
              <input
                type="text"
                value={form.guardianName}
                onChange={(e) => updateField("guardianName", e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Guardian Phone *</label>
              <input
                type="tel"
                value={form.guardianPhone}
                onChange={(e) => updateField("guardianPhone", e.target.value)}
                className={inputClass}
              />
            </div>

          </div>

          <div>
            <label className={labelClass}>Address</label>
            <textarea
              value={form.address}
              onChange={(e) => updateField("address", e.target.value)}
              className={inputClass}
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded"
            >
              {loading
                ? "Saving..."
                : isEditing
                ? "Update Student"
                : "Save Student"}
            </button>

            {isEditing && (
              <button
                type="button"
                onClick={onCancelEdit}
                className="px-6 py-2 border rounded"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddStudent;