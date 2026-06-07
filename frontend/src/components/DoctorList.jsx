import { useEffect, useState } from "react";
import axios from "axios";
import { FaUserMd, FaStar } from "../utils/icons";

function DoctorList() {

    const [doctors, setDoctors] = useState([]);

    useEffect(() => {

        axios
            .get("http://localhost:8080/api/doctors")
            .then((res) => {
                setDoctors(res.data);
            })
            .catch((err) => {
                console.log(err);
            });

    }, []);

    return (

        <div className="container mt-5">

            <div className="text-center mb-5">

                <h1 className="fw-bold">
                    Find Your Specialist
                </h1>

                <p className="text-muted">
                    Consult with experienced healthcare professionals
                </p>

            </div>

            <div className="row">

                {doctors.map((doctor) => (

                    <div
                        className="col-md-4 mb-4"
                        key={doctor.id}
                    >

                        <div
                            className="card border-0 shadow-lg h-100"
                            style={{
                                borderRadius: "20px"
                            }}
                        >

                            <div className="card-body text-center">

                                <div style={{ fontSize: "70px", color: "var(--primary)" }}>
                                    <FaUserMd size={56} aria-hidden="true" />
                                </div>

                                <h4 className="fw-bold mt-3">
                                    {doctor.name}
                                </h4>

                                <p
                                    className="text-primary fw-semibold"
                                >
                                    {doctor.specialization}
                                </p>

                                <span
                                    className="badge bg-success p-2"
                                >
                                    <FaStar size={12} aria-hidden="true" /> 4.8 Rating
                                </span>

                                <div className="mt-3">

                                    <h5 className="fw-bold">
                                        ₹ {doctor.fees}
                                    </h5>

                                    <small
                                        className="text-muted"
                                    >
                                        Consultation Fee
                                    </small>

                                </div>

                                <button
                                    className="btn btn-primary mt-4 w-100"
                                >
                                    Book Appointment
                                </button>

                            </div>

                        </div>

                    </div>

                ))}

            </div>

        </div>

    );
}

export default DoctorList;