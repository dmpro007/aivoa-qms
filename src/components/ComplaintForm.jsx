import { useDispatch, useSelector } from "react-redux";
import { updateComplaintField } from "../store/complaintSlice";
import { createComplaint } from "../services/complaintApi";


function ComplaintForm() {

  const dispatch = useDispatch();

  // Complaint data from Redux
  const complaint = useSelector(
    (state) => state.complaint.complaint
  );

  // AI analysis from Redux
  const aiResult = useSelector(
    (state) => state.complaint.aiResult
  );


  const handleChange = (e) => {

    const { name, value } = e.target;

    dispatch(
      updateComplaintField({
        field: name,
        value: value,
      })
    );
  };


  const handleCommit = async () => {

    try {

      const payload = {

        ...complaint,

        riskLevel:
          aiResult?.risk_level || null,

        riskScore:
          aiResult?.risk_score || null,

        riskReason:
          aiResult?.risk_reason || null,

        completenessScore:
          aiResult?.completeness_score || null,

        summary:
          aiResult?.summary || null,

        rootCauseSuggestions:
          aiResult?.root_cause_suggestions || [],

        capaRecommendations:
          aiResult?.capa_recommendations || []
      };


      console.log(
        "Sending complaint:",
        payload
      );


      const response =
        await createComplaint(payload);


      console.log(
        "Complaint saved:",
        response
      );


      alert(
        `Complaint saved successfully! ID: ${response.complaint_id}`
      );


    } catch (error) {

      console.error(
        "Failed to save complaint:",
        error
      );


      alert(
        "Failed to save complaint."
      );
    }
  };


  return (
    <div className="complaint-form">

      <div className="section-heading">

        <h2>Log Customer Complaint</h2>

        <span className="required-note">
          * Required fields
        </span>

      </div>


      {/* Complaint Information */}

      <div className="form-section">

        <h3>Complaint Information</h3>

        <div className="form-grid">

          <div className="form-group">

            <label>
              Complaint Source *
            </label>

            <select
              name="source"
              value={complaint.source || ""}
              onChange={handleChange}
            >

              <option value="">
                Select source
              </option>

              <option value="Email">
                Email
              </option>

              <option value="Phone">
                Phone
              </option>

              <option value="Web">
                Web
              </option>

              <option value="Distributor">
                Distributor
              </option>

              <option value="Sales Representative">
                Sales Representative
              </option>

            </select>

          </div>


          <div className="form-group">

            <label>
              Complaint Category *
            </label>

            <select
              name="category"
              value={complaint.category || ""}
              onChange={handleChange}
            >

              <option value="">
                Select category
              </option>

              <option value="Packaging">
                Packaging
              </option>

              <option value="Labeling">
                Labeling
              </option>

              <option value="Product Quality">
                Product Quality
              </option>

              <option value="Contamination">
                Contamination
              </option>

              <option value="Foreign Matter">
                Foreign Matter
              </option>

              <option value="Appearance">
                Appearance
              </option>

              <option value="Dosage">
                Dosage
              </option>

              <option value="Quantity">
                Quantity
              </option>

              <option value="Wrong Product">
                Wrong Product
              </option>

              <option value="Documentation">
                Documentation
              </option>

              <option value="Other">
                Other
              </option>

            </select>

          </div>

        </div>

      </div>


      {/* Customer */}

      <div className="form-section">

        <h3>Customer Details</h3>

        <div className="form-grid">

          <div className="form-group">

            <label>
              Customer Name *
            </label>

            <input
              type="text"
              name="customerName"
              value={complaint.customerName || ""}
              onChange={handleChange}
              placeholder="Enter customer name"
            />

          </div>


          <div className="form-group">

            <label>
              Organization
            </label>

            <input
              type="text"
              name="organization"
              value={complaint.organization || ""}
              onChange={handleChange}
              placeholder="Company / organization"
            />

          </div>


          <div className="form-group">

            <label>
              Email
            </label>

            <input
              type="email"
              name="email"
              value={complaint.email || ""}
              onChange={handleChange}
              placeholder="customer@example.com"
            />

          </div>


          <div className="form-group">

            <label>
              Country
            </label>

            <input
              type="text"
              name="country"
              value={complaint.country || ""}
              onChange={handleChange}
              placeholder="Country"
            />

          </div>

        </div>

      </div>


      {/* Product */}

      <div className="form-section">

        <h3>
          Product & Batch Identification
        </h3>

        <div className="form-grid">

          <div className="form-group">

            <label>
              Product Name *
            </label>

            <input
              type="text"
              name="productName"
              value={complaint.productName || ""}
              onChange={handleChange}
              placeholder="e.g. Paracetamol"
            />

          </div>


          <div className="form-group">

            <label>
              Material Type
            </label>

            <select
              name="materialType"
              value={complaint.materialType || ""}
              onChange={handleChange}
            >

              <option value="">
                Select type
              </option>

              <option value="API">
                API
              </option>

              <option value="FDF">
                Finished Dosage Form
              </option>

            </select>

          </div>


          <div className="form-group">

            <label>
              Dosage Form
            </label>

            <input
              type="text"
              name="dosageForm"
              value={complaint.dosageForm || ""}
              onChange={handleChange}
              placeholder="Tablet, capsule, injection..."
            />

          </div>


          <div className="form-group">

            <label>
              Strength
            </label>

            <input
              type="text"
              name="strength"
              value={complaint.strength || ""}
              onChange={handleChange}
              placeholder="e.g. 500 mg"
            />

          </div>


          <div className="form-group">

            <label>
              Batch Number *
            </label>

            <input
              type="text"
              name="batchNumber"
              value={complaint.batchNumber || ""}
              onChange={handleChange}
              placeholder="e.g. PCT24031"
            />

          </div>


          <div className="form-group">

            <label>
              Manufacturing Date
            </label>

            <input
              type="date"
              name="manufacturingDate"
              value={complaint.manufacturingDate || ""}
              onChange={handleChange}
            />

          </div>


          <div className="form-group">

            <label>
              Expiry Date
            </label>

            <input
              type="date"
              name="expiryDate"
              value={complaint.expiryDate || ""}
              onChange={handleChange}
            />

          </div>

        </div>

      </div>


      {/* Complaint Details */}

      <div className="form-section">

        <h3>
          Complaint Details
        </h3>

        <div className="form-group">

          <label>
            Complaint Description *
          </label>

          <textarea
            name="description"
            value={complaint.description || ""}
            onChange={handleChange}
            placeholder="Describe the customer's complaint..."
            rows="6"
          />

        </div>

      </div>


      {/* Buttons */}

      <div className="form-actions">

        <button
          type="button"
          className="btn-secondary"
        >
          Save Draft
        </button>


        <button
          type="button"
          onClick={handleCommit}
        >
          Commit Complaint
        </button>

      </div>

    </div>
  );
}


export default ComplaintForm;