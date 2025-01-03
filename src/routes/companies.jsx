import { useState, useEffect } from "react";
import { useCommunication } from "../context/data";
import "../styles/companies.css";

function CompanyListPage() {
  const {
    state,
    updateCompany,
    deleteCompany,
    addCompanyCommunicationMethod,
    updateCompanyCommunicationMethod,
    deleteCompanyCommunicationMethod,
  } = useCommunication();

  // Company Edit State
  const [editingCompany, setEditingCompany] = useState(null);

  // Communication Method Edit State
  const [editingMethod, setEditingMethod] = useState(null);

  // Company Form State
  const [companyForm, setCompanyForm] = useState({
    id: "",
    name: "",
    location: "",
    linkedinProfile: "",
    emails: [""],
    phoneNumbers: [""],
    comments: "",
    communicationPeriodicity: 14,
    communicationMethods: [],
  });

  // Communication Method Form State
  const [methodForm, setMethodForm] = useState({
    id: "",
    name: "",
    description: "",
    sequence: 0,
    isMandatory: false,
    companyId: null,
  });

  // Initialize Demo Companies
  useEffect(() => {
    const demoCompanyExists = state.companies.some(
      (company) => company.id === "entnt"
    );
    const newDemoCompanyExists = state.companies.some(
      (company) => company.id === "demoCo"
    );

    if (!demoCompanyExists) {
      state.companies.push({
        id: "entnt",
        name: "ENTNT - Remote teams made easy",
        location: "Abu Dhabi",
        linkedinProfile: "https://www.linkedin.com/company/entnt",
        emails: ["hr@entnt.com"],
        phoneNumbers: ["+1234567890"],
        comments: "This is a company for testing purposes.",
        communicationPeriodicity: 14,
        lastCommunicationDate: new Date().toISOString(),
        communicationMethods: [
          {
            id: "entnt",
            name: "Email",
            description: "Communication via email",
            sequence: 1,
            isMandatory: true,
          },
        ],
      });
    }

    if (!newDemoCompanyExists) {
      const today = new Date();
      const lastCommunicationDate = new Date();
      lastCommunicationDate.setDate(today.getDate() - 20); // Set last communication date to 20 days ago
      const nextCommunicationDate = new Date(
        lastCommunicationDate.getTime() + 7 * 24 * 60 * 60 * 1000
      ); // Calculate next communication date based on periodicity

      state.companies.push({
        id: "demoCo",
        name: "DemoCo - Showcase Inc.",
        location: "New York",
        linkedinProfile: "https://www.linkedin.com/company/democo",
        emails: ["info@democo.com"],
        phoneNumbers: ["+9876543210"],
        comments: "A demo company to showcase all features.",
        communicationPeriodicity: 7,
        lastCommunicationDate: lastCommunicationDate.toISOString(),
        nextCommunicationDate: nextCommunicationDate.toISOString(),
        communicationMethods: [
          {
            id: "demoEmail",
            name: "Email",
            description: "Main communication method",
            sequence: 1,
            isMandatory: true,
          },
          {
            id: "demoCall",
            name: "Call",
            description: "Follow-up calls to key stakeholders",
            sequence: 2,
            isMandatory: false,
          },
        ],
      });
    }
  }, [state.companies]);

  // Company Form Handlers
  const handleCompanyChange = (e) => {
    const { name, value } = e.target;
    setCompanyForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEmailChange = (index, value) => {
    const newEmails = [...companyForm.emails];
    newEmails[index] = value;
    setCompanyForm((prev) => ({ ...prev, emails: newEmails }));
  };

  const handleAddEmail = () => {
    setCompanyForm((prev) => ({
      ...prev,
      emails: [...prev.emails, ""],
    }));
  };

  const handlePhoneChange = (index, value) => {
    const newPhones = [...companyForm.phoneNumbers];
    newPhones[index] = value;
    setCompanyForm((prev) => ({ ...prev, phoneNumbers: newPhones }));
  };

  const handleAddPhone = () => {
    setCompanyForm((prev) => ({
      ...prev,
      phoneNumbers: [...prev.phoneNumbers, ""],
    }));
  };

  // Start Editing Company
  const startEditCompany = (company) => {
    setEditingCompany(company.id);
    setCompanyForm({ ...company });
  };

  // Update Company
  const handleUpdateCompany = (e) => {
    e.preventDefault();
    updateCompany(companyForm);
    setEditingCompany(null);
  };

  // Communication Method Handlers
  const handleMethodChange = (e) => {
    const { name, value, type, checked } = e.target;
    setMethodForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Start Editing Method
  const startEditMethod = (method, companyId) => {
    setEditingMethod({ methodId: method.id, companyId });
    setMethodForm({
      ...method,
      companyId: companyId,
    });
  };

  // Update Communication Method
  const handleUpdateMethod = (e) => {
    e.preventDefault();
    updateCompanyCommunicationMethod(methodForm);
    setEditingMethod(null);
  };

  // Add New Method to Company
  const handleAddMethod = (companyId) => {
    const newMethod = {
      ...methodForm,
      companyId,
      id: "", // Reset ID to create new method
      sequence:
        state.companies.find((c) => c.id === companyId).communicationMethods
          .length + 1,
    };
    addCompanyCommunicationMethod(newMethod);
    // Reset method form
    setMethodForm({
      id: "",
      name: "",
      description: "",
      sequence: 0,
      isMandatory: false,
      companyId: null,
    });
  };

  const renderContactDetails = (company) => {
    const today = new Date();
    const nextCommunicationDate = new Date(company.nextCommunicationDate);
    const isOverdue = today > nextCommunicationDate;

    return (
      <div className="contact-details">

        {/* Emails Section */}
        <div className="contact-section">
          <h4>Emails</h4>
          {company.emails && company.emails.length > 0 ? (
            <ul>
              {company.emails.map((email, index) => (
                <li key={index}>
                  <span className="email-icon">✉️</span> {email}
                </li>
              ))}
            </ul>
          ) : (
            <p>No email addresses</p>
          )}
        </div>

        {/* Phone Numbers Section */}
        <div className="contact-section">
          <h4>Phone Numbers</h4>
          {company.phoneNumbers && company.phoneNumbers.length > 0 ? (
            <ul>
              {company.phoneNumbers.map((phone, index) => (
                <li key={index}>
                  <span className="phone-icon">📞</span> {phone}
                </li>
              ))}
            </ul>
          ) : (
            <p>No phone numbers</p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="company-list-page">
      {state.companies.map((company) => (
        <div key={company.id} className="company-card">
          {editingCompany === company.id ? (
            <form onSubmit={handleUpdateCompany} className="edit-company-form">
              {/* Edit Form Fields */}
              <div className="form-group">
                <label htmlFor="name">Company Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={companyForm.name}
                  onChange={handleCompanyChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="location">Location</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={companyForm.location}
                  onChange={handleCompanyChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="linkedinProfile">LinkedIn Profile</label>
                <input
                  type="url"
                  id="linkedinProfile"
                  name="linkedinProfile"
                  value={companyForm.linkedinProfile}
                  onChange={handleCompanyChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="emails">Emails</label>
                {companyForm.emails.map((email, index) => (
                  <div key={index}>
                    <input
                      type="email"
                      name="emails"
                      value={email}
                      onChange={(e) => handleEmailChange(index, e.target.value)}
                    />
                    {index === companyForm.emails.length - 1 && (
                      <button type="button" onClick={handleAddEmail}>
                        Add Email
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <div className="form-group">
                <label htmlFor="phoneNumbers">Phone Numbers</label>
                {companyForm.phoneNumbers.map((phone, index) => (
                  <div key={index}>
                    <input
                      type="tel"
                      name="phoneNumbers"
                      value={phone}
                      onChange={(e) => handlePhoneChange(index, e.target.value)}
                    />
                    {index === companyForm.phoneNumbers.length - 1 && (
                      <button type="button" onClick={handleAddPhone}>
                        Add Phone
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <div className="form-group">
                <label htmlFor="comments">Comments</label>
                <textarea
                  id="comments"
                  name="comments"
                  value={companyForm.comments}
                  onChange={handleCompanyChange}
                ></textarea>
              </div>
              <div className="form-group">
                <label htmlFor="communicationPeriodicity">
                  Communication Periodicity (days)
                </label>
                <input
                  type="number"
                  id="communicationPeriodicity"
                  name="communicationPeriodicity"
                  value={companyForm.communicationPeriodicity}
                  onChange={handleCompanyChange}
                />
              </div>
              <button type="submit">Update Company</button>
              <button type="button" onClick={() => setEditingCompany(null)}>
                Cancel
              </button>
            </form>
          ) : (
            <div className="company-details">
              <h2>{company.name}</h2>
              <p>Location: {company.location}</p>
              <p>LinkedIn: {company.linkedinProfile || "N/A"}</p>
              <p>
                Communication Frequency: {company.communicationPeriodicity} days
              </p>

              {renderContactDetails(company)}

              <div className="company-actions">
                <button onClick={() => startEditCompany(company)}>
                  Edit Company
                </button>
                <button onClick={() => deleteCompany(company.id)}>
                  Delete Company
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default CompanyListPage;
