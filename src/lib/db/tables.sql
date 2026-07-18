
CREATE TABLE IF NOT EXISTS admins (
  adminID INT AUTO_INCREMENT PRIMARY KEY,
  firstName VARCHAR(100),
  lastName VARCHAR(100),
  email VARCHAR(150) UNIQUE,
  password VARCHAR(255),
  contactNo VARCHAR(20)
);

-- /Seed Admin Account (Password: Admin@12345)
-- Hash generated via bcrypt
INSERT INTO admins (firstName, lastName, email, password, contactNo)
VALUES ('System', 'Admin', 'admin@sabarastay.com', '$2b$10$gxuDfTwDQM9vdZKK7xuuQeBk.ksG4J32nZ77eOPeJfIcwRonON76K', '0711234567');
=======
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
ALTER TABLE boarding_places
ADD COLUMN freeWifi TINYINT(1) DEFAULT 0,
ADD COLUMN attachedBathroom TINYINT(1) DEFAULT 0,
ADD COLUMN parking TINYINT(1) DEFAULT 0,
ADD COLUMN kitchen TINYINT(1) DEFAULT 0;

ALTER TABLE boarding_places
ADD COLUMN shortTerm TINYINT(1) DEFAULT 0,
ADD COLUMN longTerm TINYINT(1) DEFAULT 0,
ADD COLUMN forLecturers TINYINT(1) DEFAULT 0;

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



