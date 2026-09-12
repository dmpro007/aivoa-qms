import ComplaintForm from "../components/ComplaintForm";
import Copilot from "../components/Copilot";

function NewComplaint() {
    return (
      <div className="new-complaint-page">
  
        <div className="page-header">
          <div>
            <span className="breadcrumb">
              Complaints / New Complaint
            </span>
  
            <h1>New Customer Complaint</h1>
  
            <p>
              Log and analyze a pharmaceutical customer complaint
              using AI-assisted quality assessment.
            </p>
          </div>
        </div>
  
        <div className="complaint-workspace">
  
          <section className="form-panel">
            <ComplaintForm />
          </section>
  
          <section className="copilot-panel">
            <Copilot />
          </section>
  
        </div>
  
      </div>
    );
  }

  export default NewComplaint;
  