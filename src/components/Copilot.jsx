//3rd code

import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  Bot,
  Send,
  Sparkles,
  Loader2,
  AlertTriangle,
  CheckCircle,
  ShieldAlert,
  Search,
  Wrench,
  FileText,
} from "lucide-react";

import {
  setAIResult,
  setComplaint,
} from "../store/complaintSlice";

import { analyzeComplaint } from "../services/complaintApi";

function Copilot() {
  const dispatch = useDispatch();

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const handleAnalyze = async () => {
    if (!message.trim()) return;

    try {
      setLoading(true);
      setError("");

      const data = await analyzeComplaint(message);

      console.log("AI RESPONSE:", data);

      const aiResult = data.data;

      if (!aiResult) {
        throw new Error("No AI result received.");
      }

      setResult(aiResult);

      dispatch(setAIResult(aiResult));

      const extracted = aiResult.extracted_fields || {};

      dispatch(
        setComplaint({
          customerName: extracted.customer_name || "",
          organization: extracted.organization || "",
          productName: extracted.product_name || "",
          materialType: extracted.material_type || "",
          dosageForm: extracted.dosage_form || "",
          strength: extracted.strength || "",
          batchNumber: extracted.batch_number || "",
          category: extracted.category || "",
          description: extracted.description || "",
        })
      );

    } catch (err) {
      console.error("AI ANALYSIS ERROR:", err);

      setError(
        err.response?.data?.detail ||
        err.message ||
        "Unable to connect to the AI service."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="copilot">

      {/* HEADER */}
      <div className="copilot-header">

        <div className="copilot-title">

          <div className="bot-icon">
            <Bot size={20} />
          </div>

          <div>
            <h2>AIVOA Copilot</h2>
            <span>AI Quality Assistant</span>
          </div>

        </div>

        <div className="ai-status">
          <span></span>
          Online
        </div>

      </div>


      {/* BODY */}
      <div className="copilot-body">

        {!result && (
          <>
            <div className="ai-welcome">

              <div className="large-bot-icon">
                <Sparkles size={26} />
              </div>

              <h3>AI Complaint Analysis</h3>

              <p>
                Paste a customer complaint below.
                I'll extract relevant information and
                perform an initial quality assessment.
              </p>

            </div>

            <div className="ai-suggestions">

              <button
                onClick={() =>
                  setMessage(
                    "ABC Pharmaceuticals reported damaged blister packaging for Paracetamol 500 mg tablets from batch PCT24031."
                  )
                }
              >
                Try sample complaint
              </button>

            </div>
          </>
        )}


        {/* ERROR */}
        {error && (
          <div className="ai-error">

            <AlertTriangle size={17} />

            {error}

          </div>
        )}


        {/* AI ASSESSMENT */}
        {result && (

          <div className="ai-result">

            <div className="assessment-header">

              <div>
                <span className="assessment-label">
                  AI QUALITY ASSESSMENT
                </span>

                <h3>Complaint Analysis</h3>
              </div>

              <CheckCircle
                size={22}
                className="assessment-success"
              />

            </div>


            {/* RISK + COMPLETENESS */}
            <div className="assessment-grid">

              <div className="assessment-card risk-card">

                <div className="assessment-card-icon">
                  <ShieldAlert size={19} />
                </div>

                <div>
                  <span>Risk Level</span>

                  <strong>
                    {result.risk_level || "N/A"}
                  </strong>

                  <small>
                    Score: {result.risk_score ?? "N/A"}/100
                  </small>
                </div>

              </div>


              <div className="assessment-card">

                <div className="assessment-card-icon">
                  <CheckCircle size={19} />
                </div>

                <div>
                  <span>Completeness</span>

                  <strong>
                    {result.completeness_score ?? 0}%
                  </strong>

                  <small>
                    Required fields
                  </small>
                </div>

              </div>

            </div>


            {/* RISK REASON */}
            {result.risk_reason && (

              <div className="assessment-section">

                <div className="section-title">

                  <ShieldAlert size={17} />

                  <strong>Risk Assessment</strong>

                </div>

                <p>
                  {result.risk_reason}
                </p>

              </div>

            )}


            {/* MISSING FIELDS */}
            {result.missing_fields?.length > 0 && (

              <div className="assessment-section warning-section">

                <div className="section-title">

                  <AlertTriangle size={17} />

                  <strong>Missing Information</strong>

                </div>

                <div className="tag-list">

                  {result.missing_fields.map((field) => (
                    <span key={field}>
                      {field.replaceAll("_", " ")}
                    </span>
                  ))}

                </div>

              </div>

            )}


            {/* ROOT CAUSE */}
            {result.root_cause_suggestions?.length > 0 && (

              <div className="assessment-section">

                <div className="section-title">

                  <Search size={17} />

                  <strong>Potential Root Causes</strong>

                </div>

                <ol className="recommendation-list">

                  {result.root_cause_suggestions.map(
                    (cause, index) => (

                      <li key={index}>
                        {cause}
                      </li>

                    )
                  )}

                </ol>

              </div>

            )}


            {/* CAPA */}
            {result.capa_recommendations?.length > 0 && (

              <div className="assessment-section">

                <div className="section-title">

                  <Wrench size={17} />

                  <strong>Preliminary CAPA</strong>

                </div>

                <ol className="recommendation-list">

                  {result.capa_recommendations.map(
                    (action, index) => (

                      <li key={index}>
                        {action}
                      </li>

                    )
                  )}

                </ol>

                <div className="human-review-note">

                  <AlertTriangle size={15} />

                  AI recommendations require QA
                  review and approval.

                </div>

              </div>

            )}


            {/* SUMMARY */}
            {result.summary && (

              <div className="assessment-section">

                <div className="section-title">

                  <FileText size={17} />

                  <strong>Complaint Summary</strong>

                </div>

                <p>
                  {result.summary}
                </p>

              </div>

            )}

          </div>

        )}

      </div>


      {/* INPUT */}
      <div className="copilot-input">

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Paste complaint text here..."
          rows="5"
        />

        <button
          className="analyze-button"
          onClick={handleAnalyze}
          disabled={loading}
        >

          {loading ? (
            <>
              <Loader2
                size={17}
                className="spin"
              />

              Analyzing...
            </>
          ) : (
            <>
              <Send size={17} />

              Analyze Complaint
            </>
          )}

        </button>

      </div>

    </div>
  );
}

export default Copilot;


//2nd code

// import { useState } from "react";
// import { useDispatch } from "react-redux";
// import {
//   Bot,
//   Send,
//   Sparkles,
//   Loader2,
//   AlertTriangle,
//   CheckCircle,
// } from "lucide-react";

// import {
//   setAIResult,
//   setComplaint,
// } from "../store/complaintSlice";

// import { analyzeComplaint } from "../services/complaintApi";

// function Copilot() {
//   const dispatch = useDispatch();

//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [result, setResult] = useState(null);

//   const handleAnalyze = async () => {
//     if (!message.trim()) return;

//     try {
//       setLoading(true);
//       setError("");

//       const data = await analyzeComplaint(message);

//       console.log("AI RESPONSE:", data);

//       // Backend now returns data.data
//       const aiResult = data.data;

//       if (!aiResult) {
//         throw new Error("No AI result received.");
//       }

//       setResult(aiResult);

//       // Store AI result in Redux
//       dispatch(setAIResult(aiResult));

//       // Extract fields returned by AI
//       const extracted = aiResult.extracted_fields || {};

//       // Auto-fill complaint form
//       dispatch(
//         setComplaint({
//           customerName: extracted.customer_name || "",
//           organization: extracted.organization || "",
//           productName: extracted.product_name || "",
//           materialType: extracted.material_type || "",
//           dosageForm: extracted.dosage_form || "",
//           strength: extracted.strength || "",
//           batchNumber: extracted.batch_number || "",
//           category: extracted.category || "",
//           description: extracted.description || "",
//         })
//       );

//     } catch (err) {
//       console.error("AI ANALYSIS ERROR:", err);

//       setError(
//         err.response?.data?.detail ||
//         err.message ||
//         "Unable to connect to the AI service."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="copilot">

//       {/* Header */}
//       <div className="copilot-header">

//         <div className="copilot-title">

//           <div className="bot-icon">
//             <Bot size={20} />
//           </div>

//           <div>
//             <h2>AIVOA Copilot</h2>
//             <span>AI Quality Assistant</span>
//           </div>

//         </div>

//         <div className="ai-status">
//           <span></span>
//           Online
//         </div>

//       </div>


//       {/* Body */}
//       <div className="copilot-body">

//         {!result && (
//           <div className="ai-welcome">

//             <div className="large-bot-icon">
//               <Sparkles size={26} />
//             </div>

//             <h3>AI Complaint Analysis</h3>

//             <p>
//               Paste a customer complaint below.
//               I'll extract relevant information and
//               perform an initial quality assessment.
//             </p>

//           </div>
//         )}


//         {/* Sample complaint */}
//         {!result && (
//           <div className="ai-suggestions">

//             <button
//               onClick={() =>
//                 setMessage(
//                   "ABC Pharmaceuticals reported damaged blister packaging for Paracetamol 500 mg tablets from batch PCT24031."
//                 )
//               }
//             >
//               Try sample complaint
//             </button>

//           </div>
//         )}


//         {/* Error */}
//         {error && (
//           <div className="ai-error">
//             <AlertTriangle size={17} />
//             {error}
//           </div>
//         )}


//         {/* AI Result */}
//         {result && (
//           <div className="ai-result">

//             <div className="assessment-header">
//               <h3>AI Assessment</h3>
//               <CheckCircle size={20} />
//             </div>


//             {/* Risk */}
//             <div className="assessment-card">

//               <span>Risk Level</span>

//               <strong>
//                 {result.risk_level || "N/A"}
//               </strong>

//               <small>
//                 Score: {result.risk_score ?? "N/A"}/100
//               </small>

//             </div>


//             {/* Completeness */}
//             <div className="assessment-card">

//               <span>Completeness</span>

//               <strong>
//                 {result.completeness_score ?? 0}%
//               </strong>

//             </div>


//             {/* Missing fields */}
//             {result.missing_fields?.length > 0 && (
//               <div className="missing-fields">

//                 <strong>Missing Fields</strong>

//                 <ul>
//                   {result.missing_fields.map((field) => (
//                     <li key={field}>{field}</li>
//                   ))}
//                 </ul>

//               </div>
//             )}


//             {/* Risk reasoning */}
//             {result.risk_reason && (
//               <div className="assessment-text">

//                 <strong>Risk Reasoning</strong>

//                 <p>{result.risk_reason}</p>

//               </div>
//             )}


//             {/* Summary */}
//             {result.summary && (
//               <div className="assessment-text">

//                 <strong>Complaint Summary</strong>

//                 <p>{result.summary}</p>

//               </div>
//             )}

//           </div>
//         )}

//       </div>


//       {/* Input */}
//       <div className="copilot-input">

//         <textarea
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//           placeholder="Paste complaint text here..."
//           rows="5"
//         />

//         <button
//           className="analyze-button"
//           onClick={handleAnalyze}
//           disabled={loading}
//         >

//           {loading ? (
//             <>
//               <Loader2 size={17} className="spin" />
//               Analyzing...
//             </>
//           ) : (
//             <>
//               <Send size={17} />
//               Analyze Complaint
//             </>
//           )}

//         </button>

//       </div>

//     </div>
//   );
// }

// export default Copilot;







//1st code

// import { useState } from "react";
// import { useDispatch } from "react-redux";
// import {
//   Bot,
//   Send,
//   Sparkles,
//   Loader2,
// } from "lucide-react";

// import { setAIResult } from "../store/complaintSlice";
// import { analyzeComplaint } from "../services/complaintApi";


// function Copilot() {

//   const dispatch = useDispatch();

//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");


//   const handleAnalyze = async () => {

//     if (!message.trim()) {
//       return;
//     }

//     try {

//       setLoading(true);
//       setError("");

//       const data = await analyzeComplaint(message);

//       console.log("AI RESPONSE:", data);

//       let parsedResult;

//       try {
//         parsedResult = JSON.parse(data.result);
//       } catch (parseError) {

//         console.error(
//           "Could not parse AI JSON:",
//           parseError
//         );

//         setError(
//           "AI returned an unexpected response."
//         );

//         return;
//       }

//       dispatch(
//         setAIResult(parsedResult)
//       );

//     } catch (err) {

//       console.error(err);

//       setError(
//         "Unable to connect to the AI service."
//       );

//     } finally {

//       setLoading(false);

//     }
//   };


//   return (
//     <div className="copilot">

//       <div className="copilot-header">

//         <div className="copilot-title">

//           <div className="bot-icon">
//             <Bot size={20} />
//           </div>

//           <div>
//             <h2>AIVOA Copilot</h2>
//             <span>AI Quality Assistant</span>
//           </div>

//         </div>

//         <div className="ai-status">
//           <span></span>
//           Online
//         </div>

//       </div>


//       <div className="copilot-body">

//         <div className="ai-welcome">

//           <div className="large-bot-icon">
//             <Sparkles size={26} />
//           </div>

//           <h3>AI Complaint Analysis</h3>

//           <p>
//             Paste a customer complaint below.
//             I'll extract relevant information and
//             perform an initial quality assessment.
//           </p>

//         </div>


//         <div className="ai-suggestions">

//           <button
//             onClick={() =>
//               setMessage(
//                 "ABC Pharmaceuticals reported damaged blister packaging for Paracetamol 500 mg tablets from batch PCT24031."
//               )
//             }
//           >
//             Try sample complaint
//           </button>

//         </div>


//         {error && (
//           <div className="ai-error">
//             {error}
//           </div>
//         )}

//       </div>


//       <div className="copilot-input">

//         <textarea
//           value={message}
//           onChange={(e) =>
//             setMessage(e.target.value)
//           }
//           placeholder="Paste complaint text here..."
//           rows="5"
//         />


//         <button
//           className="analyze-button"
//           onClick={handleAnalyze}
//           disabled={loading}
//         >

//           {loading ? (
//             <>
//               <Loader2
//                 size={17}
//                 className="spin"
//               />

//               Analyzing...
//             </>
//           ) : (
//             <>
//               <Send size={17} />

//               Analyze Complaint
//             </>
//           )}

//         </button>

//       </div>

//     </div>
//   );
// }

// dispatch(
//     setComplaint({
//       customerName:
//         parsedResult.customer_name || "",
  
//       organization:
//         parsedResult.organization || "",
  
//       productName:
//         parsedResult.product_name || "",
  
//       materialType:
//         parsedResult.material_type || "",
  
//       dosageForm:
//         parsedResult.dosage_form || "",
  
//       strength:
//         parsedResult.strength || "",
  
//       batchNumber:
//         parsedResult.batch_number || "",
  
//       category:
//         parsedResult.category || "",
  
//       description:
//         parsedResult.description || "",
//     })
//   );

// export default Copilot;