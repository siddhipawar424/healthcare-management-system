function Hero() {

    return (

        <div
            className="d-flex align-items-center"
            style={{
                minHeight: "70vh",
                background:
                    "linear-gradient(to right, #2563eb, #06b6d4)",
                color: "white"
            }}
        >

            <div className="container text-center">

                <h1
                    className="display-3 fw-bold"
                >
                    Your Health,
                    <br />
                    Our Priority
                </h1>

                <p
                    className="lead mt-4"
                >
                    Connect with trusted doctors,
                    schedule appointments instantly,
                    and manage your healthcare journey.
                </p>

                <button
                    className="btn btn-light btn-lg mt-3"
                >
                    Book Appointment
                </button>

            </div>

        </div>

    );
}

export default Hero;