# Amnex | NMDC Ltd - CISF Gate Entry Pass & Material Management System

Gate access control and tracking system for **Amnex Infotechnologies Pvt. Ltd.** deployed at **NMDC Ltd** (Bailadila Project), monitored by the **Central Industrial Security Force (CISF)**.

---

## 💻 How to Run Locally on Your Laptop

### 1. Prerequisites
Make sure you have **Node.js** (version 18 or higher) and **npm** installed on your laptop.
- Check if installed by opening your terminal or command prompt:
  ```bash
  node -v
  npm -v
  ```
- If not installed, download and install Node.js (LTS version) from: [https://nodejs.org](https://nodejs.org/)

---

### 2. Download / Extract the Project
Extract the application files into a folder on your laptop, for example:
`C:\Projects\amnex-nmdc-gatepass` or `~/amnex-nmdc-gatepass`.

---

### 3. Open Terminal / Command Prompt
Navigate to the project directory:
```bash
cd /path/to/amnex-nmdc-gatepass
```

---

### 4. Install Dependencies
Run the following command to install the required libraries:
```bash
npm install
```

---

### 5. Start the Local Development Server
Launch the application locally:
```bash
npm run dev
```

Once running, you will see output in the terminal:
```
  VITE v...  ready in ... ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

---

### 6. Open in Browser
Open your web browser (Google Chrome, Microsoft Edge, Mozilla Firefox) and go to:
**[http://localhost:3000](http://localhost:3000)**

---

## ⚙️ Key Application Features

1. **Dashboard KPI Cards**:
   - **Contractor Passes**: Total count & Pending count.
   - **Material Passes**: Total count & Pending count (with RGP vs NRGP indicators).
   - **Official Procedure Pipeline**: Real-time breakdown across all 4 stages:
     1. Pass Prepared (Amnex)
     2. Submitted to C&IT (NMDC Review)
     3. Submitted to CISF (Security Gate Review)
     4. Pass Obtained (Signed & Received)

2. **Official 4-Stage Procedure Workflow**:
   - **Step 1: Pass Prepared** — Created and formatted by Amnex Infotechnologies.
   - **Step 2: Submitted to C&IT** — Sent for NMDC C&IT Department review and approval.
   - **Step 3: Submitted to CISF** — Forwarded with C&IT endorsement to CISF Security Gate for physical verification & signature.
   - **Step 4: Pass Obtained** — CISF endorsed badge obtained, active for entry.
   - Direct step progression buttons available in both the table and detail modal.

3. **Designated Gates**:
   - **DIOM Gate**
   - **KIOM Gate**
   - **Admin Building Gate**
   - **PPT Gate**

4. **Default Department**:
   - Set to **C&IT** by default across all new pass forms, filters, and records.

5. **Data Storage & Backup**:
   - All pass records are stored locally on your machine in the browser (`localStorage`).
   - One-click **Export to Excel** and **Import from Excel** for offline archiving.
   - "Reset Sample Data" button to restore official Amnex - NMDC benchmark sample data at any time.
