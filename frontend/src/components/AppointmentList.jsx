import { useEffect, useState } from "react";
import axios from "axios";

function AppointmentList() {

    const [appointments, setAppointments] = useState([]);

    useEffect(() => {

        axios
            .get("http://localhost:8080/api/appointments")
            .then((res) => {
                setAppointments(res.data);
            });

    }, []);

    return (

        <div className="container mt-4">

            <h2>Appointments</h2>

            <table className="table table-bordered">

                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Patient</th>
                        <th>Doctor ID</th>
                        <th>Date</th>
                    </tr>
                </thead>

                <tbody>

                    {appointments.map((appointment) => (

                        <tr key={appointment.id}>

                            <td>{appointment.id}</td>

                            <td>{appointment.patientName}</td>

                            <td>{appointment.doctorId}</td>

                            <td>{appointment.appointmentDate}</td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>

    );
}

export default AppointmentList;