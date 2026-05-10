CREATE TABLE students (
  studentID INT AUTO_INCREMENT PRIMARY KEY,
  firstName VARCHAR(100),
  lastName VARCHAR(100),
  email VARCHAR(150) UNIQUE,
  password VARCHAR(255),
  contactNo VARCHAR(20)
);

CREATE TABLE boarding_owners (
  boardingOwnerID INT AUTO_INCREMENT PRIMARY KEY,
  firstName VARCHAR(100),
  lastName VARCHAR(100),
  email VARCHAR(150) UNIQUE,
  password VARCHAR(255),
  contactNo VARCHAR(20)
);

CREATE TABLE boarding_places (
  boardingID INT AUTO_INCREMENT PRIMARY KEY,
  boardingOwnerID INT,
  boardingName VARCHAR(150),
  boardingType VARCHAR(50),
  address VARCHAR(255),
  price DECIMAL(10,2),
  totalRooms INT,
  availableSpace INT,
  description TEXT,
  distance DECIMAL(5,2),
  FOREIGN KEY (boardingOwnerID) REFERENCES boarding_owners(boardingOwnerID)
);

CREATE TABLE boarding_photos (
  photoID INT AUTO_INCREMENT PRIMARY KEY,
  boardingID INT,
  photoPath VARCHAR(255),
  FOREIGN KEY (boardingID) REFERENCES boarding_places(boardingID) ON DELETE CASCADE
);

CREATE TABLE appointments (
  appointmentID INT AUTO_INCREMENT PRIMARY KEY,
  studentID INT,
  boardingID INT,
  appointmentDate DATE,
  appointmentTime VARCHAR(20),
  status VARCHAR(50),
  FOREIGN KEY (studentID) REFERENCES students(studentID),
  FOREIGN KEY (boardingID) REFERENCES boarding_places(boardingID)
);

CREATE TABLE reviews (
  reviewID INT AUTO_INCREMENT PRIMARY KEY,
  studentID INT,
  boardingID INT,
  rating INT,
  comment TEXT,
  reviewDate DATE,
  FOREIGN KEY (studentID) REFERENCES students(studentID),
  FOREIGN KEY (boardingID) REFERENCES boarding_places(boardingID)
);

CREATE TABLE notifications (
  notificationID INT AUTO_INCREMENT PRIMARY KEY,
  studentID INT,
  message VARCHAR(255),
  createdDate DATE,
  status VARCHAR(20),
  FOREIGN KEY (studentID) REFERENCES students(studentID)
);

CREATE TABLE bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  boarding_id INT NOT NULL,
  start_date DATE NOT NULL,
  months INT NOT NULL,
  status ENUM('PENDING','CONFIRMED','CANCELLED') DEFAULT 'PENDING',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (boarding_id) REFERENCES boardings(id)
);

/*CREATE TABLE bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  boarding_id INT,
  status VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);*/