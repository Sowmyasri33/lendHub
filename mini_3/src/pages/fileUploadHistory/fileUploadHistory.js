import React, { useState, useEffect } from "react";
import "./fileUploadHistory.css";
import NewNavBar from "../../components/newNavBar/newNavBar";

const FileUploadHistory = () => {
  const [groupedFiles, setGroupedFiles] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedTopic, setSelectedTopic] = useState(null);

  const fetchFileUploadHistory = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Missing authentication details. Please log in.");
      setLoading(false);
      return;
    }
    try {
      const response = await fetch("http://localhost:3001/api/fileUploadHistory", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch file upload history. Please try again.");
      }
      const data = await response.json();
      groupFilesByCategory(data.fileUploadHistory || []);
    } catch (err) {
      setError(err.message || "An error occurred while fetching the file upload history.");
    } finally {
      setLoading(false);
    }
  };

  const groupFilesByCategory = (files) => {
    const grouped = files.reduce((acc, file) => {
      const category = file.tag || "General";
      if (!acc[category]) acc[category] = [];
      acc[category].push(file);
      return acc;
    }, {});
    setGroupedFiles(grouped);
    setSelectedTopic(Object.keys(grouped)[0] || null);
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to delete items.");
      return;
    }

    const confirmDelete = window.confirm("Are you sure you want to delete this item?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:3001/api/deleteFile/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (response.ok) {
        alert(result.message || "Item deleted successfully.");
        fetchFileUploadHistory(); // Refresh list
      } else {
        alert(result.message || "Failed to delete item.");
      }
    } catch (err) {
      alert("An error occurred while deleting the item.");
    }
  };

  useEffect(() => {
    fetchFileUploadHistory();
  }, []);

  if (loading) {
    return <div className="file-upload-history-loading">Loading upload history...</div>;
  }
  if (error) {
    return <div className="file-upload-history-error">Error: {error}</div>;
  }

  const categories = Object.keys(groupedFiles);
  const itemsToShow = selectedTopic ? groupedFiles[selectedTopic] : [];

  return (
    <>
      <NewNavBar />
      <div className="file-upload-history">
        <div className="file-upload-history-sidebar">
          <h3>Categories</h3>
          {categories.length === 0 && <p>No categories available.</p>}
          {categories.map((category) => (
            <div
              key={category}
              className={`file-upload-history-topic ${category === selectedTopic ? "active" : ""}`}
              onClick={() => setSelectedTopic(category)}
            >
              {category}
            </div>
          ))}
        </div>

        <div className="file-upload-history-content">
          <h2>{selectedTopic || "Select a category"}</h2>
          <ul className="file-upload-history-list">
            {itemsToShow.length === 0 && <p>No items in this category.</p>}
            {itemsToShow.map((upload) => (
              <li className="file-upload-history-item" key={upload._id || upload.filename}>
                <h4 className="file-upload-history-title">{upload.title}</h4>
                <p className="file-upload-history-description">
                  <strong>Item Description:</strong> {upload.description}
                </p>
                <p className="file-upload-history-description">
                  <strong>Category:</strong> {upload.tag}
                </p>
                <p className="file-upload-history-description">
                  <strong>Mail:</strong> {upload.mail}
                </p>
                <p className="file-upload-history-description">
                  <strong>Type:</strong>{" "}
                  {upload.listingType
                    ? upload.listingType.charAt(0).toUpperCase() + upload.listingType.slice(1)
                    : "N/A"}
                </p>
                {upload.cost && (
                  <p className="file-upload-history-description">
                    <strong>Cost:</strong> {upload.cost}
                  </p>
                )}
                {upload.rentFrom && (
                  <p className="file-upload-history-description">
                    <strong>Rent From:</strong> {upload.rentFrom}
                  </p>
                )}
                {upload.rentTo && (
                  <p className="file-upload-history-description">
                    <strong>Rent To:</strong> {upload.rentTo}
                  </p>
                )}

                <button
                  className="file-upload-history-link"
                  onClick={() => window.open(upload.filePath, "_blank")}
                >
                  View Item
                </button>
                <button
                  className="file-upload-history-link delete-btn"
                  onClick={() => handleDelete(upload._id)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default FileUploadHistory;
