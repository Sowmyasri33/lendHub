import React, { useState } from "react";
import axios from "axios";
import NewNavBar from "../../components/newNavBar/newNavBar";
import './fileUpload.css';
import { useNavigate } from 'react-router-dom';

function FileUpload() {
  const navigate = useNavigate();

  const [itemDetails, setItemDetails] = useState({
    title: "",
    description: "",
    tag: "Books",  // default category
    file: null,
    listingType: "sell", // "sell" or "rent"
    cost: "",
    rentFrom: "",
    rentTo: "",
  });

  const [customTag, setCustomTag] = useState("");

  const categories = ["Books", "Sports", "Clothes", "Electronics"];

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "tag" && value !== "Others") {
      setCustomTag("");
    }

    if (name === "rentFrom" && itemDetails.rentTo && value > itemDetails.rentTo) {
      setItemDetails((prev) => ({ ...prev, rentTo: "" }));
    }

    setItemDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleCustomTagChange = (e) => {
    setCustomTag(e.target.value);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      alert("Please select a valid file.");
      return;
    }
    setItemDetails((prev) => ({ ...prev, file: file }));
  };

  const handleSubmit = async () => {
    const { title, description, tag, file, listingType, cost, rentFrom, rentTo } = itemDetails;

    if (!title || !description || !file) {
      alert("Please fill all required fields and select an item file.");
      return;
    }

    if (!cost) {
      alert("Please enter the cost.");
      return;
    }

    if (listingType === "rent") {
      if (!rentFrom || !rentTo) {
        alert("Please select both Rent From and Rent To dates.");
        return;
      }
      if (rentTo < rentFrom) {
        alert("'Rent To' date cannot be before 'Rent From' date.");
        return;
      }
    }

    const actualTag = tag === "Others" ? customTag.trim() : tag;

    if (tag === "Others" && !actualTag) {
      alert("Please enter a custom category.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);          // will be saved as 'name' in backend
    formData.append("description", description);
    formData.append("tag", actualTag);
    formData.append("file", file);
    formData.append("listingType", listingType);
    formData.append("cost", cost);

    if (listingType === "rent") {
      formData.append("rentFrom", rentFrom);
      formData.append("rentTo", rentTo);
    }

    const token = localStorage.getItem("token");

    try {
      const response = await axios.post("http://localhost:3001/fileUpload", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert(response.data.message || "Item uploaded successfully.");
      resetForm();
      navigate("/");
    } catch (error) {
      console.error("Upload error:", error);
      alert(error.response?.data?.message || "Error uploading item.");
    }
  };

  const resetForm = () => {
    setItemDetails({
      title: "",
      description: "",
      tag: "Books",
      file: null,
      listingType: "sell",
      cost: "",
      rentFrom: "",
      rentTo: "",
    });
    setCustomTag("");
  };

  return (
    <>
      <NewNavBar />
      <div className="file-upload">
        <h1>Upload an Item</h1>

        <input
          type="text"
          name="title"
          placeholder="Item Title"
          value={itemDetails.title}
          onChange={handleInputChange}
          required
        />
        <br />

        <textarea
          name="description"
          placeholder="Item Description"
          value={itemDetails.description}
          onChange={handleInputChange}
          required
        />
        <br />

        <select
          name="tag"
          value={itemDetails.tag}
          onChange={handleInputChange}
          required
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
          <option value="Others">Others</option>
        </select>

        {itemDetails.tag === "Others" && (
          <input
            type="text"
            name="customTag"
            placeholder="Enter custom category"
            value={customTag}
            onChange={handleCustomTagChange}
            required
          />
        )}
        <br />

        <select
          name="listingType"
          value={itemDetails.listingType}
          onChange={handleInputChange}
          required
        >
          <option value="sell">Sell</option>
          <option value="rent">Rent</option>
        </select>
        <br />

        <input
          type="number"
          name="cost"
          placeholder="Cost"
          min="0"
          value={itemDetails.cost}
          onChange={handleInputChange}
          required
        />
        <br />

        {itemDetails.listingType === "rent" && (
          <>
            <label>
              Available From:
              <input
                type="date"
                name="rentFrom"
                value={itemDetails.rentFrom}
                onChange={handleInputChange}
                min={getTodayDate()}
                required
              />
            </label>
            <br />
            <label>
              Available To:
              <input
                type="date"
                name="rentTo"
                value={itemDetails.rentTo}
                onChange={handleInputChange}
                min={itemDetails.rentFrom || getTodayDate()}
                required
              />
            </label>
            <br />
          </>
        )}

        <input
          type="file"
          onChange={handleFileChange}
          required
        />
        <br />

        <button
          className="file-upload-button"
          type="button"
          onClick={handleSubmit}
        >
          Upload Item
        </button>
      </div>
    </>
  );
}

export default FileUpload;
