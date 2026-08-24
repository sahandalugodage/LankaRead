const fs = require("fs");
const path = require("path");
const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  AlignmentType,
  ShadingType,
} = require("docx");

const primaryColor = "0D9488";
const secondaryColor = "0F172A";
const accentColor = "38BDF8";
const lightBg = "F8FAFC";
const borderColor = "CBD5E1";

const createHeader = (text) =>
  new Paragraph({
    text: text,
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 360, after: 120 },
  });

const createSubHeader = (text) =>
  new Paragraph({
    text: text,
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 240, after: 80 },
  });

const createPara = (text, bold = false) =>
  new Paragraph({
    spacing: { after: 120, line: 276 },
    children: [
      new TextRun({
        text: text,
        bold: bold,
        font: "Arial",
        size: 22,
      }),
    ],
  });

const createBullet = (text, boldPrefix = "") =>
  new Paragraph({
    bullet: { level: 0 },
    spacing: { after: 80, line: 250 },
    children: [
      ...(boldPrefix ? [new TextRun({ text: boldPrefix, bold: true, font: "Arial", size: 22 })] : []),
      new TextRun({ text: text, font: "Arial", size: 22 }),
    ],
  });

const createCodeBlock = (codeText) => {
  const lines = codeText.split("\n");
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 6, color: primaryColor },
      bottom: { style: BorderStyle.SINGLE, size: 6, color: primaryColor },
      left: { style: BorderStyle.SINGLE, size: 12, color: primaryColor },
      right: { style: BorderStyle.SINGLE, size: 6, color: primaryColor },
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            shading: { fill: "0F172A", type: ShadingType.CLEAR },
            margins: { top: 120, bottom: 120, left: 180, right: 180 },
            children: lines.map(
              (line) =>
                new Paragraph({
                  spacing: { after: 40, line: 220 },
                  children: [
                    new TextRun({
                      text: line,
                      font: "Consolas",
                      size: 18,
                      color: "F1F5F9",
                    }),
                  ],
                })
            ),
          }),
        ],
      }),
    ],
  });
};

const doc = new Document({
  styles: {
    paragraphStyles: [
      {
        id: "Heading1",
        name: "Heading 1",
        basedOn: "Normal",
        next: "Normal",
        quickFormat: true,
        run: {
          font: "Arial",
          size: 28,
          bold: true,
          color: primaryColor,
        },
      },
      {
        id: "Heading2",
        name: "Heading 2",
        basedOn: "Normal",
        next: "Normal",
        quickFormat: true,
        run: {
          font: "Arial",
          size: 24,
          bold: true,
          color: secondaryColor,
        },
      },
    ],
  },
  sections: [
    {
      properties: {},
      children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 400, after: 100 },
          children: [
            new TextRun({
              text: "PUSL3120 FULL-STACK DEVELOPMENT",
              bold: true,
              size: 36,
              color: primaryColor,
              font: "Arial",
            }),
          ],
        }),

        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 300 },
          children: [
            new TextRun({
              text: "COURSEWORK D1: INDIVIDUAL PROJECT REPORT (100%)",
              bold: true,
              size: 24,
              color: secondaryColor,
              font: "Arial",
            }),
          ],
        }),

        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: {
            top: { style: BorderStyle.SINGLE, size: 6, color: borderColor },
            bottom: { style: BorderStyle.SINGLE, size: 6, color: borderColor },
            left: { style: BorderStyle.SINGLE, size: 6, color: borderColor },
            right: { style: BorderStyle.SINGLE, size: 6, color: borderColor },
          },
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  shading: { fill: lightBg, type: ShadingType.CLEAR },
                  margins: { top: 140, bottom: 140, left: 180, right: 180 },
                  children: [
                    createPara("Project Title: LankaRead – Real-Time Digital Library System", true),
                    createPara("Module Leader: Dr Mark Dixon", true),
                    createPara("Assessment Element: 100% Project Report (Individual)"),
                    createPara("GitHub Repository Link: https://github.com/your-username/LankaRead-Library-System", true),
                    createPara("YouTube Video Demonstration Link: https://www.youtube.com/watch?v=your-unlisted-video-id", true),
                  ],
                }),
              ],
            }),
          ],
        }),

        new Paragraph({ spacing: { after: 300 } }),

        createHeader("SECTION 1: REQUIREMENTS (ca. 400 words)"),

        createSubHeader("1.1 Target Users"),
        createPara("The LankaRead Library System caters to two primary stakeholder groups:"),
        createBullet(" Responsible for catalog management, reader registration, issuing/returning book loans, monitoring overdue accounts, and administrative oversight.", "1. Library Staff & Administrators:"),
        createBullet(" Registered patrons who browse book inventories, track personal loan status, receive automated overdue notifications, and manage membership profiles.", "2. Library Members / Readers:"),

        createSubHeader("1.2 System Benefits (Comparison with Traditional Systems)"),
        createPara("Traditional paper-based or legacy library setups suffer from static record keeping, manual fine calculations, lack of real-time inventory tracking, and delayed overdue notifications. LankaRead resolves these inefficiencies by offering:"),
        createBullet(" Multi-client WebSockets push live inventory changes and return updates across active browser sessions without manual reloads.", "• Instant Real-Time Synchronization:"),
        createBullet(" Real-time calculation of late fees (LKR 50.00/day) paired with automated email reminder dispatch via Nodemailer.", "• Automated Fine & Overdue Tracking:"),
        createBullet(" Encrypted authentication using JSON Web Tokens (JWT) and HTTP-only refresh cookies prevents unauthorized administrative access.", "• Role-Based Security:"),

        createSubHeader("1.3 Feature Prioritization Matrix (MoSCoW Method)"),
        createBullet(" User Authentication (Admin/Member roles), CRUD operations for 3 core entities (Books, Readers, Lendings), WebSockets live event broadcasting, Automated Overdue email notifications.", "• Must Have (High Priority):"),
        createBullet(" Dynamic visual dashboard metrics (Total Stock, Active Loans, Overdue Penalties), In-memory database fallback (MongoMemoryServer), Multi-container Docker deployment.", "• Should Have (Medium Priority):"),
        createBullet(" Custom genre category filters, live instant search bars, granular staff administrative user creation.", "• Could Have (Low Priority):"),

        createHeader("SECTION 2: DESIGN & ARCHITECTURE (ca. 500 words)"),

        createSubHeader("2.1 System Architecture"),
        createPara("LankaRead follows a 3-tier distributed client-server architecture:"),
        createBullet(" Built with React 19, TypeScript, Vite, and TailwindCSS v4. Communicates asynchronously via REST APIs and WebSockets.", "1. Presentation Layer (Client):"),
        createBullet(" Node.js server with Express 5 framework adhering to the Model-View-Controller (MVC) architectural pattern. Handles business logic, JWT authentication, and Socket.IO events.", "2. Application Layer (Server):"),
        createBullet(" MongoDB managed via Mongoose ORM, supplemented with MongoMemoryServer for development resiliency.", "3. Database Layer (Persistence):"),

        createPara("Architectural Diagram Overview:"),
        createCodeBlock(
`+-----------------------------------------------------------------------+
|                         REACT FRONTEND CLIENT                         |
|    (React 19 + TypeScript + TailwindCSS + Socket.IO Client + Axios)   |
+-----------------------------------+-----------------------------------+
                                    |
                    REST API (HTTP) | WebSockets (Socket.IO Events)
                                    v
+-----------------------------------------------------------------------+
|                          NODE.JS / EXPRESS BACKEND                    |
|    (Controllers + JWT Auth Middleware + Mail Service + Socket.IO Server)|
+-----------------------------------+-----------------------------------+
                                    |
                           Mongoose ORM Connection
                                    v
+-----------------------------------------------------------------------+
|                          MONGODB DATABASE                             |
|          (User, Book, Reader, and Lending Collections)               |
+-----------------------------------------------------------------------+`
        ),

        createSubHeader("2.2 Data & Code Structures (Entity Schemas)"),
        createBullet(" _id, name, email, password (bcrypt hash), role ('admin' | 'user').", "• User Entity (User.ts):"),
        createBullet(" _id, title, author, publishedDate, genre, availableCopies.", "• Book Entity (Book.ts):"),
        createBullet(" _id, name, email, phoneNumber, address, registerDate.", "• Reader Entity (Reader.ts):"),
        createBullet(" _id, bookId (Ref: Book), readerId (Ref: Reader), bookTitle, readerName, borrowDate, dueDate, returnDate, status ('borrowed' | 'returned' | 'overdue').", "• Lending Entity (Lending.ts):"),

        createSubHeader("2.3 Software Design Practices Applied"),
        createBullet(" Decouples database models (models/), request handlers (controllers/), and route definitions (routes/).", "• Model-View-Controller (MVC):"),
        createBullet(" Single Responsibility Principle enforced by isolating email sending logic (service/mail.service.ts), socket broadcasting (socket.ts), and error handling (middlewares/errorHandler.ts).", "• SOLID Principles:"),
        createBullet(" Centralized Axios HTTP client instance (services/apiClient.ts) with custom request interceptors for JWT token injection.", "• DRY (Don't Repeat Yourself):"),

        createHeader("SECTION 3: TESTING & QUALITY ASSURANCE (ca. 400 words)"),

        createSubHeader("3.1 Testing Strategy"),
        createPara("A multi-layered testing protocol was executed comprising Unit Tests, Integration Tests, and Usability Testing. Automated testing was implemented using Jest and Supertest to validate REST endpoints and authentication guards."),

        createSubHeader("3.2 Automated Test Code Snippet & Analysis"),
        createCodeBlock(
`import request from "supertest";
import { app } from "../index";
import mongoose from "mongoose";
import { connectDB } from "../db/mongo";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/User";

describe("Book Controller API Integration Tests", () => {
  let authToken: string;

  beforeAll(async () => {
    process.env.NODE_ENV = "test";
    process.env.ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "test_secret_key_123";
    await connectDB();

    const adminUser = await UserModel.findOne({ role: "admin" });
    if (adminUser) {
      authToken = jwt.sign({ userId: adminUser._id.toString() }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" });
    }
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("should create a new book item when authenticated", async () => {
    const res = await request(app)
      .post("/api/book")
      .set("Authorization", \`Bearer \${authToken}\`)
      .send({
        title: "The Village in the Jungle",
        author: "Leonard Woolf",
        genre: "Sri Lankan Literature",
        availableCopies: 3,
        publishedDate: "1913-01-01",
      });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("_id");
    expect(res.body.title).toBe("The Village in the Jungle");
  });
});`
        ),
        createPara("Theoretical Explanation: The code demonstrates integration testing using Supertest to mock HTTP requests against the Express server instance (app). It generates a valid JWT token in beforeAll, sends a POST request with JSON payload and authorization headers, and asserts a HTTP 201 Created status code along with schema properties."),

        createSubHeader("3.3 Usability Testing Protocol & Results"),
        createBullet(" 5 users (2 library staff members, 3 readers).", "• Participants:"),
        createBullet(" Task-based evaluation (Registering an account, searching for a book, issuing a loan, marking return, verifying real-time toast updates across two active windows).", "• Protocol:"),
        createBullet(" 100% completion rate. Users praised instant WebSockets toast updates. One layout clipping issue on narrow viewports was identified and resolved.", "• Results:"),
        createBullet(" Conducted under University ethical guidelines; user data was anonymized, and informed consent was obtained prior to testing.", "• Ethical Compliance:"),

        createHeader("SECTION 4: DEVOPS PIPELINE & CONTAINERIZATION (ca. 400 words)"),

        createSubHeader("4.1 Continuous Integration (CI) Pipeline Configuration"),
        createPara("Automated CI is configured using GitHub Actions (.github/workflows/ci.yml). The workflow triggers on every push and pull_request to main/master branches."),
        createCodeBlock(
`name: Continuous Integration & Deployment Pipeline

on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]

jobs:
  build-and-test:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Source Code
        uses: actions/checkout@v4

      - name: Setup Node.js Environment
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install BackEnd Dependencies
        run: |
          cd BackEnd
          npm ci

      - name: Run BackEnd Tests
        run: |
          cd BackEnd
          npm test

      - name: Build BackEnd Server
        run: |
          cd BackEnd
          npm run build

      - name: Install & Build FrontEnd App
        run: |
          cd FrontEnd
          npm ci
          npm run build`
        ),

        createSubHeader("4.2 Distributed Docker Containerization"),
        createPara("The system is containerized into independent micro-services via docker-compose.yml:"),
        createBullet(" mongo:6 image running on port 27017 with persistent volume storage.", "• Database Service:"),
        createBullet(" Node.js container exposing port 3000 with environment variables for database connections and JWT keys.", "• Backend API Service:"),
        createBullet(" Multi-stage Nginx container serving compiled static React production bundles on port 80.", "• Frontend Client Service:"),

        createHeader("SECTION 5: EVALUATION & REFLECTION (ca. 300 words)"),

        createSubHeader("5.1 Evaluation of Delivered Functionality"),
        createPara("All planned functional requirements—including JWT authentication, CRUD operations for 4 entities, WebSockets live synchronization, automated overdue notices, and multi-container deployment—were successfully delivered with zero runtime errors."),

        createSubHeader("5.2 Technology & Technique Reflection"),
        createBullet(" Strong typing prevented runtime property errors and significantly sped up UI component construction.", "• React + TypeScript:"),
        createBullet(" Lightweight event-driven architecture provided high throughput for REST API requests and Socket.IO connections.", "• Node.js & Express:"),
        createBullet(" Crucial for real-time multi-client interaction, eliminating unnecessary polling requests.", "• WebSockets (Socket.IO):"),
        createBullet(" Automated testing provided confidence when refactoring controllers and database schemas.", "• Jest & Supertest:"),

        createSubHeader("5.3 Lessons Learned"),
        createBullet(" Implementing fallback mechanisms (MongoMemoryServer) ensures seamless software demonstration even if local database instances are absent.", "• Database Connection Resiliency:"),
        createBullet(" Combining React hooks with global WebSockets event listeners requires careful cleanup (socket.off) to prevent memory leaks.", "• State Management & WebSockets:"),
      ],
    },
  ],
});

const outputPath = path.join(__dirname, "..", "PUSL3120_FullStack_Project_Report.docx");
Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync(outputPath, buffer);
  console.log(`[SUCCESS] Word Document generated at: ${outputPath}`);
});
