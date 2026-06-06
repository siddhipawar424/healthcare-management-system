import { useEffect, useState } from "react";
import axios from "axios";
import DoctorCard from "./DoctorCard";
import SearchBar from "./SearchBar";
import { FaSearch } from "../utils/icons";
import "./Doctors.css";

function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");

  useEffect(() => {
    axios.get("http://localhost:8080/api/doctors")
      .then((res) => setDoctors(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const specializations = [...new Set(doctors.map((d) => d.specialization).filter(Boolean))];

  const filtered = doctors.filter((d) => {
    const matchSearch =
      d.name?.toLowerCase().includes(search.toLowerCase()) ||
      d.specialization?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter ? d.specialization === filter : true;
    return matchSearch && matchFilter;
  });

  return (
    <div className="page-enter">
      <div className="doctors-header">
        <div className="container">
          <span className="badge-pill badge-primary">Our Team</span>
          <h1 className="section-title mt-3" style={{ color: "white" }}>Find Your Specialist</h1>
          <div className="hc-divider" style={{ margin: "16px 0 0" }} />
          <p className="mt-3" style={{ color: "rgba(255,255,255,0.8)", fontSize: "1rem" }}>
            Browse {doctors.length}+ verified doctors across all specializations.
          </p>
        </div>
      </div>

      <div className="container doctors-body">
        <div className="doctors-search-row">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search by name or specialization..."
            onFilter={setFilter}
            filterOptions={specializations}
            filterValue={filter}
          />
          <span className="doctors-count">
            {filtered.length} doctor{filtered.length !== 1 ? "s" : ""} found
          </span>
        </div>

        {loading ? (
          <div className="spinner-wrapper">
            <div className="hc-spinner" />
            <span style={{ color: "var(--gray-600)" }}>Fetching doctors...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"><FaSearch size={32} /></div>
            <h4>No doctors found</h4>
            <p>Try adjusting your search or filter criteria.</p>
            <button className="btn-hc-outline mt-3" onClick={() => { setSearch(""); setFilter(""); }}>
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="doctors-grid-page">
            {filtered.map((doc, i) => (
              <DoctorCard key={doc.id} doctor={doc} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Doctors;
