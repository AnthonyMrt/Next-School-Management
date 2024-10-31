// components/CalendarModal.tsx
import React from "react";
import Calendar from "react-calendar";
import Modal from "react-modal";
import "react-calendar/dist/Calendar.css";

type CalendarModalProps = {
  isOpen: boolean;
  onRequestClose: () => void;
  attendanceRecords: { date: string; present: boolean }[];
};

const CalendarModal: React.FC<CalendarModalProps> = ({
  isOpen,
  onRequestClose,
  attendanceRecords,
}) => {
  // Create a map for attendance records for easy lookup
  const attendanceMap = new Map(
    attendanceRecords.map((record) => [
      new Date(record.date).toDateString(),
      record.present,
    ])
  );

  // Function to set the class for each tile based on attendance
  const tileClassName = ({ date }: { date: Date }) => {
    const dateString = date.toDateString();
    if (attendanceMap.has(dateString)) {
      return attendanceMap.get(dateString) ? "bg-green-500" : "bg-red-500"; // Green for present, red for absent
    }
    return ""; // No class if no attendance record
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="modal"
      overlayClassName="overlay"
    >
      <h2 className="text-xl font-semibold mb-4">Attendance Calendar</h2>
      <Calendar
        tileClassName={tileClassName} // Use tileClassName for styling
        // Remove the onChange prop since we don't want to change the date
        value={new Date()} // You can set this to a default value if needed
        // Add other props as necessary
      />
      <button
        onClick={onRequestClose}
        className="mt-4 bg-blue-500 text-white p-2 rounded"
      >
        Close
      </button>
    </Modal>
  );
};

export default CalendarModal;
