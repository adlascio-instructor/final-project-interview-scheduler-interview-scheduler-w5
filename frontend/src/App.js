import React, { useState, useEffect } from "react";

import "./App.scss";

import DayList from "./components/DayList";
import Appointment from "./components/Appointment";
import axios from "axios";
import { io } from "socket.io-client";

let socket;

export default function Application() {
  const [day, setDay] = useState("Monday");
  const [days, setDays] = useState({});
  const [appointments, setAppointments] = useState({});

  function bookInterview(id, interview, shouldEmit = true) {
    const isEdit = appointments[id] && appointments[id].interview;
    if (shouldEmit) {
      if (isEdit) {
        socket.emit("update_interview", {...interview, id: appointments[id].interview.id, appointment_id: id });
      } else {
        socket.emit("create_interview", {...interview, appointment_id:id});
      }
    }
    setAppointments((prev) => {
      const appointment = {
        ...prev[id],
        interview: { ...interview },
      };
      const appointments = {
        ...prev,
        [id]: appointment,
      };
      return appointments;
    });
    if (!isEdit) {
      setDays((prev) => {
        const updatedDay = {
          ...prev[day],
          spots: prev[day].spots - 1,
        };
        const days = {
          ...prev,
          [day]: updatedDay,
        };
        return days;
      });
    }
  }

  function cancelInterview(id, shouldEmit = true) {
    if (shouldEmit) {
      socket.emit("delete_interview", { appointment_id: id, id: appointments[id].interview.id });
    }
    setAppointments((prev) => {
      const updatedAppointment = {
        ...prev[id],
        interview: null,
      };
      const appointments = {
        ...prev,
        [id]: updatedAppointment,
      };
      return appointments;
    });
    setDays((prev) => {
      const updatedDay = {
        ...prev[day],
        spots: prev[day].spots + 1,
      };
      const days = {
        ...prev,
        [day]: updatedDay,
      };
      return days;
    });
  }

  useEffect(() => {
    axios.get('http://localhost:8000/days')
    .then((res) => {
      setDays(res.data);
    });
    socket = io('http://localhost:8000');
    socket.on("interview_created", (interview)=> {
      bookInterview(interview.appointment_id, interview, false);
    });
    socket.on("interview_updated", (interview)=> {
      bookInterview(interview.appointment_id, interview, false);
    });
    socket.on("interview_deleted", (appointmentId)=> {
      cancelInterview(appointmentId, false);
    });
  }, []);

  useEffect(() => {
    axios.get(`http://localhost:8000/interviews/${day}`).then((res) => {
      setAppointments(res.data);
    })
  }, [day]);

  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList days={days} value={day} onChange={setDay} />
        </nav>
      </section>
      <section className="schedule">
        {Object.values(appointments).map((appointment) => (
          <Appointment
            key={appointment.id}
            {...appointment}
            bookInterview={(interview) =>
              bookInterview(appointment.id, interview)
            }
            cancelInterview={cancelInterview}
            day={day}
          />
        ))}
        <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}
