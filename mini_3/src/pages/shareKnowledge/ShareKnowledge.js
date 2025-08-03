import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/sideBar/sideBar";
import SearchBar from "../../components/searchBar/searchBar";
import "./ShareKnowledge.css";
import NewNavBar from '../../components/newNavBar/newNavBar';

function ShareKnowledge() {
  const [videosToView, setVideosToView] = useState([]);
  const [filesToView, setFilesToView] = useState([]);
  const [groupedVideos, setGroupedVideos] = useState({});
  const [groupedFiles, setGroupedFiles] = useState({});
  const [filteredVideos, setFilteredVideos] = useState({});
  const [filteredFiles, setFilteredFiles] = useState({});
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.get("http://localhost:3001/videos", {
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => {
        const videos = res.data.videos;
        setVideosToView(videos);
        groupVideosByCategory(videos);
      }).catch((err) => {
        handleError(err, "videos");
      });

      axios.get("http://localhost:3001/files", {
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => {
        const files = res.data.files;
        setFilesToView(files);
        groupFilesByCategory(files);
      }).catch((err) => {
        handleError(err, "files");
      });
    } else {
      setError("You need to be logged in to view videos and files.");
      setTimeout(() => navigate('/login'), 2000);
    }
  }, [navigate]);

  const handleError = (err, type) => {
    if (err.response?.status === 401) {
      setError("Unauthorized. Redirecting to login...");
      setTimeout(() => navigate('/login'), 2000);
    } else {
      setError(`Error fetching ${type}. Please try again later.`);
    }
    console.error(`Error fetching ${type}:`, err);
  };

  const groupVideosByCategory = (videos) => {
    const grouped = videos.reduce((acc, video) => {
      const category = video.tag || "Untagged";
      if (!acc[category]) acc[category] = [];
      acc[category].push(video);
      return acc;
    }, {});
    setGroupedVideos(grouped);
    setFilteredVideos(grouped);
  };

  const groupFilesByCategory = (files) => {
    const grouped = files.reduce((acc, file) => {
      const category = file.tag || "Untagged";
      if (!acc[category]) acc[category] = [];
      acc[category].push(file);
      return acc;
    }, {});
    setGroupedFiles(grouped);
    setFilteredFiles(grouped);
  };

  const handleSearch = (searchTerm) => {
    if (!searchTerm) {
      setFilteredVideos(groupedVideos);
      setFilteredFiles(groupedFiles);
      return;
    }

    const filteredVideos = Object.entries(groupedVideos).reduce((acc, [category, videos]) => {
      if (category.toLowerCase().includes(searchTerm.toLowerCase())) {
        acc[category] = videos;
      }
      return acc;
    }, {});

    const filteredFiles = Object.entries(groupedFiles).reduce((acc, [category, files]) => {
      if (category.toLowerCase().includes(searchTerm.toLowerCase())) {
        acc[category] = files;
      }
      return acc;
    }, {});

    setFilteredVideos(filteredVideos);
    setFilteredFiles(filteredFiles);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "N/A" : date.toLocaleDateString("en-IN");
  };

  return (
    <div className="share-knowledge">
      <NewNavBar />
      <div className="content">
        <SearchBar onSearch={handleSearch} />


        {!error && Object.keys(filteredVideos).length === 0 ? (
          <p className="no-videos">No itemss found.</p>
        ) : (
          Object.entries(filteredVideos).map(([category, videos]) => (
            <div className="upload-history-group" key={category}>
              <h3 className="upload-history-task">Video Category: {category}</h3>
              <ul className="upload-history-list">
                {videos.map((video) => (
                  <li className="upload-history-item" key={video._id}>
                    <h4 className="upload-history-video-title">{video.title}</h4>
                    <h5>Item Description:</h5>
                    <p className="upload-history-video-description">{video.description}</p>
                    <video className="upload-history-video" controls>
                      <source src={video.videoPath} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}

        {!error && Object.keys(filteredFiles).length === 0 ? (
          <p className="no-files">No files found.</p>
        ) : (
          Object.entries(filteredFiles).map(([category, files]) => (
            <div className="upload-history-group" key={category}>
              <h3 className="upload-history-task">File Category: {category}</h3>
              <ul className="upload-history-list">
                {files.map((file) => (
                  <li className="upload-history-item" key={file._id}>
                    <h4 className="upload-history-file-title">{file.title}</h4>
                    <p><strong>Item Name:</strong> {file.name || "N/A"}</p> {/* Add this line */}
                    <p><strong>Item Description:</strong> {file.description || "N/A"}</p>
                    <p><strong>Category:</strong> {file.tag || "N/A"}</p>
                    <p><strong>Mail:</strong> {file.mail || "N/A"}</p>
                    <p>
                      <strong>Type:</strong>{" "}
                      {file.listingType
                        ? file.listingType.charAt(0).toUpperCase() + file.listingType.slice(1)
                        : "N/A"}
                    </p>

                    {file.listingType?.toLowerCase() === "sell" && (
                      <p><strong>Cost:</strong> {file.cost ?? "N/A"}</p>
                    )}
                    {file.listingType?.toLowerCase() === "rent" && (
                      <>
                        <p><strong>Rent From:</strong> {formatDate(file.rentFrom)}</p>
                        <p><strong>Rent To:</strong> {formatDate(file.rentTo)}</p>
                        <p><strong>Cost:</strong> {file.cost ?? "N/A"}</p>
                      </>
                    )}

                    <button
                      className="upload-history-file-view-btn"
                      onClick={() => window.open(file.filePath, "_blank")}
                    >
                      View File
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ShareKnowledge;
