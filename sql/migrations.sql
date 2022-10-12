CREATE TABLE days (
  id SERIAL PRIMARY KEY NOT NULL,
  name TEXT
);

CREATE TABLE appointments (
  id SERIAL PRIMARY KEY NOT NULL,
  time TEXT,
  day_id INT,
  FOREIGN KEY(day_id) REFERENCES days(id)
);

CREATE TABLE interviewers (
  id SERIAL PRIMARY KEY NOT NULL,
  name TEXT,
  avatar TEXT
);

CREATE TABLE interviews (
  id SERIAL PRIMARY KEY NOT NULL,
  student TEXT,
  interviewer_id INT,
  appointment_id INT,
  FOREIGN KEY(interviewer_id) REFERENCES interviewers(id),
  FOREIGN KEY(appointment_id) REFERENCES appointments(id)
);

CREATE TABLE available_interviewers (
  id SERIAL PRIMARY KEY NOT NULL,
  interviewer_id INT,
  day_id INT,
  FOREIGN KEY(interviewer_id) REFERENCES interviewers(id),
  FOREIGN KEY(day_id) REFERENCES days(id)
);