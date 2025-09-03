import React, { useState, useEffect } from "react";
import "./AttendanceApp.css";

const AttendanceApp = () => {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [logs, setLogs] = useState({}); // { "2025-09-03": {present: 2, absent: 1} }

  // Load from localStorage
  useEffect(() => {
    const storedStudents = localStorage.getItem("students");
    const storedLogs = localStorage.getItem("logs");
    if (storedStudents) setStudents(JSON.parse(storedStudents));
    if (storedLogs) setLogs(JSON.parse(storedLogs));
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("students", JSON.stringify(students));
    localStorage.setItem("logs", JSON.stringify(logs));
  }, [students, logs]);

  // Add new student
  const addStudent = () => {
    if (name.trim() === "") return;
    setStudents([...students, { id: Date.now(), name }]);
    setName("");
  };

  // Get today's date string
  const getToday = () => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // YYYY-MM-DD
  };

  // Mark attendance & update daily log
  const markAttendance = (id, status) => {
    const today = getToday();

    // Update logs
    const newLogs = { ...logs };
    if (!newLogs[today]) newLogs[today] = { present: 0, absent: 0 };
    newLogs[today][status] += 1;

    setLogs(newLogs);
  };

  return (
    <div className="app-container">
      <h1>📋 Attendance Management System</h1>

      {/* Add Student */}
      <div className="input-section">
        <input
          type="text"
          placeholder="Enter student name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button onClick={addStudent}>Add</button>
      </div>

      {/* Student List */}
      {students.length === 0 ? (
        <p className="empty">No students added yet.</p>
      ) : (
        <ul className="student-list">
          {students.map((s) => (
            <li key={s.id} className="student-item">
              <span className="student-name">{s.name}</span>
              <div className="btn-group">
                <button
                  className="present-btn"
                  onClick={() => markAttendance(s.id, "present")}
                >
                  Present
                </button>
                <button
                  className="absent-btn"
                  onClick={() => markAttendance(s.id, "absent")}
                >
                  Absent
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Daily Logs */}
      {Object.keys(logs).length > 0 && (
        <div className="summary">
          <h2>📊 Daily Attendance Log</h2>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Total Present</th>
                <th>Total Absent</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(logs).map(([date, data]) => (
                <tr key={date}>
                  <td>{date}</td>
                  <td>{data.present}</td>
                  <td>{data.absent}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AttendanceApp;
