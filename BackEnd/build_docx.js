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

const primaryColor = "0D9488"; // Teal
const secondaryColor = "0F172A"; // Dark Slate
const accentColor = "2563EB"; // Royal Blue
const darkBg = "0F172A";
const lightBg = "F8FAFC";
const borderColor = "CBD5E1";

const createHeader = (text) =>
  new Paragraph({
    text: text,
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 400, after: 160 },
  });

const createSubHeader = (text) =>
  new Paragraph({
    text: text,
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 280, after: 120 },
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
        color: "334155",
      }),
    ],
  });

const createBullet = (text, boldPrefix = "") =>
  new Paragraph({
    bullet: { level: 0 },
    spacing: { after: 80, line: 250 },
    children: [
      ...(boldPrefix
        ? [
            new TextRun({
              text: boldPrefix + " ",
              bold: true,
              font: "Arial",
              size: 22,
              color: secondaryColor,
            }),
          ]
        : []),
      new TextRun({ text: text, font: "Arial", size: 22, color: "334155" }),
    ],
  });

const createCalloutBox = (title, textLines) => {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 6, color: primaryColor },
      bottom: { style: BorderStyle.SINGLE, size: 6, color: primaryColor },
      left: { style: BorderStyle.SINGLE, size: 18, color: primaryColor },
      right: { style: BorderStyle.SINGLE, size: 6, color: primaryColor },
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            shading: { fill: lightBg, type: ShadingType.CLEAR },
            margins: { top: 140, bottom: 140, left: 200, right: 200 },
            children: [
              new Paragraph({
                spacing: { after: 80 },
                children: [
                  new TextRun({
                    text: title,
                    bold: true,
                    font: "Arial",
                    size: 22,
                    color: primaryColor,
                  }),
                ],
              }),
              ...textLines.map(
                (line) =>
                  new Paragraph({
                    spacing: { after: 60, line: 250 },
                    children: [
                      new TextRun({
                        text: line,
                        font: "Arial",
                        size: 20,
                        color: "1E293B",
                      }),
                    ],
                  })
              ),
            ],
          }),
        ],
      }),
    ],
  });
};

const createCodeBlock = (codeText) => {
  const lines = codeText.split("\n");
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 6, color: primaryColor },
      bottom: { style: BorderStyle.SINGLE, size: 6, color: primaryColor },
      left: { style: BorderStyle.SINGLE, size: 14, color: primaryColor },
      right: { style: BorderStyle.SINGLE, size: 6, color: primaryColor },
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            shading: { fill: darkBg, type: ShadingType.CLEAR },
            margins: { top: 120, bottom: 120, left: 180, right: 180 },
            children: lines.map(
              (line) =>
                new Paragraph({
                  spacing: { after: 30, line: 220 },
                  children: [
                    new TextRun({
                      text: line,
                      font: "Consolas",
                      size: 18,
                      color: "F8FAFC",
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

const createTable = (headers, rowsData) => {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 6, color: borderColor },
      bottom: { style: BorderStyle.SINGLE, size: 6, color: borderColor },
      left: { style: BorderStyle.SINGLE, size: 6, color: borderColor },
      right: { style: BorderStyle.SINGLE, size: 6, color: borderColor },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: borderColor },
      insideVertical: { style: BorderStyle.SINGLE, size: 4, color: borderColor },
    },
    rows: [
      new TableRow({
        children: headers.map(
          (header) =>
            new TableCell({
              shading: { fill: primaryColor, type: ShadingType.CLEAR },
              margins: { top: 100, bottom: 100, left: 120, right: 120 },
              children: [
                new Paragraph({
                  alignment: AlignmentType.LEFT,
                  children: [
                    new TextRun({
                      text: header,
                      bold: true,
                      font: "Arial",
                      size: 20,
                      color: "FFFFFF",
                    }),
                  ],
                }),
              ],
            })
        ),
      }),
      ...rowsData.map(
        (row, idx) =>
          new TableRow({
            children: row.map(
              (cell) =>
                new TableCell({
                  shading: {
                    fill: idx % 2 === 0 ? "FFFFFF" : lightBg,
                    type: ShadingType.CLEAR,
                  },
                  margins: { top: 80, bottom: 80, left: 120, right: 120 },
                  children: [
                    new Paragraph({
                      alignment: AlignmentType.LEFT,
                      children: [
                        new TextRun({
                          text: cell,
                          font: "Arial",
                          size: 19,
                          color: "334155",
                        }),
                      ],
                    }),
                  ],
                })
            ),
          })
      ),
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
        // COVER / TITLE BLOCK
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 500, after: 120 },
          children: [
            new TextRun({
              text: "LANKAREAD LIBRARY & KNOWLEDGE PORTAL",
              bold: true,
              size: 34,
              color: primaryColor,
              font: "Arial",
            }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 240 },
          children: [
            new TextRun({
              text: "Full-Stack Real-Time Library Network System | Technical Architecture, Feature Guide & Video Script",
              bold: true,
              size: 22,
              color: secondaryColor,
              font: "Arial",
            }),
          ],
        }),

        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: {
            top: { style: BorderStyle.SINGLE, size: 8, color: primaryColor },
            bottom: { style: BorderStyle.SINGLE, size: 8, color: primaryColor },
            left: { style: BorderStyle.SINGLE, size: 8, color: primaryColor },
            right: { style: BorderStyle.SINGLE, size: 8, color: primaryColor },
          },
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  shading: { fill: lightBg, type: ShadingType.CLEAR },
                  margins: { top: 160, bottom: 160, left: 200, right: 200 },
                  children: [
                    createPara("Project Name: LankaRead Real-Time Library & Knowledge Portal", true),
                    createPara("Target Institutions: Public & Academic Library Networks (Colombo, Kandy, Galle, Peradeniya)", true),
                    createPara("Document Purpose: Complete Single-File Master Guide for Project Owner, Video Presenters, & Evaluators"),
                    createPara("Document Content: Architecture, Technology Stack, Data Models, WebSockets, Fine Engine, REST APIs, Setup Guide & Step-by-Step Video Script"),
                  ],
                }),
              ],
            }),
          ],
        }),

        new Paragraph({ spacing: { after: 240 } }),

        // SECTION 1
        createHeader("1. EXECUTIVE SUMMARY & SYSTEM OVERVIEW"),
        createPara(
          "LankaRead is an enterprise-grade, full-stack, real-time Library & Knowledge Portal specifically engineered for public and university library networks across Sri Lanka (serving major regional nodes including Colombo, Kandy, Galle, and Peradeniya). Traditional paper logs and legacy static library management systems suffer from delayed inventory updates, manual fine calculations, lack of real-time multi-terminal synchronization, and missed overdue notifications."
        ),
        createPara(
          "LankaRead eliminates these bottlenecks by delivering an event-driven system built on React 19, Node.js Express 5, MongoDB, WebSockets (Socket.IO), and Nodemailer automated emailing. The system provides secure role-based access control (Admin & Patron Member roles) utilizing JWT access tokens and HTTP-Only refresh cookies."
        ),

        createSubHeader("1.1 Core System Capabilities"),
        createBullet("Secure sign-up, login, password encryption via Bcrypt, and HTTP-only cookie-based session management with role-based route guards.", "• Authentication & Security:"),
        createBullet("Comprehensive member management with full contact tracking, registration timestamps, and complete individual borrowing history.", "• Reader & Member Directory:"),
        createBullet("Book cataloging with genre classification, real-time available copy tracking, and instantaneous multi-attribute search.", "• Catalog & Inventory Control:"),
        createBullet("Issuing 14-day book loans, automated due date tracking, return processing, and real-time stock auto-increment/decrement.", "• Circulation & Loan Operations:"),
        createBullet("Automatic identification of overdue loans, dynamic calculation of Sri Lankan Rupee penalties (Rs. 50/day), and dispatching automated email reminders via Nodemailer SMTP.", "• Overdue Tracking & Fine Calculation:"),
        createBullet("Socket.IO bi-directional WebSocket connections instantly broadcast catalog and loan state changes to all active browser sessions without page reloads.", "• Real-Time WebSockets Sync:"),
        createBullet("Recharts visual cards and analytical breakdown of total books, readers, active loans, and penalty revenues.", "• Interactive Dashboard Analytics:"),

        // SECTION 2
        createHeader("2. COMPLETE TECHNOLOGY STACK & SYSTEM SPECIFICATIONS"),
        createPara("LankaRead utilizes a modern, resilient technology stack designed for high throughput, maintainability, and clean separation of concerns:"),

        createTable(
          ["Category", "Technology / Package", "Version", "Purpose & Implementation Details"],
          [
            ["FrontEnd Framework", "React", "19.1.0", "UI framework providing declarative functional components, state hooks, and fast DOM rendering."],
            ["FrontEnd Language", "TypeScript", "5.8.3", "Ensures strict type-safety across UI components, props, API response interfaces, and state."],
            ["Build Tool & Server", "Vite", "6.3.5", "Next-gen frontend build tool delivering instant HMR (Hot Module Replacement) and optimized production bundles."],
            ["Styling Engine", "TailwindCSS", "4.1.7", "Utility-first CSS framework enforcing consistent design tokens, glassmorphism UI, and dark mode aesthetics."],
            ["Data Visualization", "Recharts", "2.15.3", "Dynamic charting library rendering real-time loan distribution and catalog breakdown charts on the dashboard."],
            ["WebSockets Client", "Socket.IO Client", "4.8.3", "Maintains continuous WebSocket client connection to listen for backend events ('lending_updated', 'book_updated')."],
            ["UI Alerts", "React Hot Toast", "2.5.2", "Delivers non-intrusive, real-time visual pop-up notifications whenever live socket events trigger."],
            ["Icons & Aesthetics", "React Icons & Lucide", "5.5.0", "Provides modern UI SVG icon primitives across navigation sidebars, stat cards, and action buttons."],
            ["HTTP Client", "Axios", "1.9.0", "Configured HTTP client with request interceptors to automatically inject JWT Bearer tokens and handle CORS."],
            ["BackEnd Runtime", "Node.js", "24.x", "High-performance JavaScript runtime environment powering async non-blocking server operations."],
            ["Web Server Framework", "Express.js", "5.1.0", "MVC web server framework managing REST API endpoints, routing, middleware pipelines, and error handling."],
            ["BackEnd Language", "TypeScript", "5.8.3", "Typed backend architecture ensuring robust request payload validation and model interface safety."],
            ["WebSockets Engine", "Socket.IO Server", "4.8.3", "Event-driven WebSocket server managing bi-directional connections and broadcasting instant live events."],
            ["Email Dispatcher", "Nodemailer", "7.0.5", "SMTP transport service rendering HTML email templates and dispatching automated overdue notices via Gmail SMTP."],
            ["Authentication", "JSONWebToken (JWT)", "9.0.2", "Dual-token authentication mechanism utilizing short-lived access tokens and refresh tokens."],
            ["Password Hashing", "Bcrypt", "6.0.0", "Cryptographic password hashing utilizing 10 salt rounds to secure user credentials."],
            ["Cookie Parser", "Cookie-Parser", "1.4.7", "Parses HTTP-Only cookies to securely read and extract refresh tokens during authentication refresh flows."],
            ["Database Persistence", "MongoDB & Mongoose", "8.15.2", "NoSQL document store paired with Mongoose ORM for schema validation, hooks, and database population."],
            ["In-Memory Database", "MongoMemoryServer", "11.2.0", "In-memory MongoDB server fallback providing seamless zero-config local development and testing."],
            ["DevOps & Containers", "Docker & Docker Compose", "Latest", "Multi-stage multi-container setup (Nginx frontend, Node.js backend, MongoDB service)."],
            ["Automated Testing", "Jest & Supertest", "30.4.2", "Unit and API integration testing suite validating REST controllers and JWT security guards."],
          ]
        ),

        // SECTION 3
        createHeader("3. SYSTEM ARCHITECTURE & DATA FLOW DESIGN"),
        createSubHeader("3.1 3-Tier Distributed Architecture"),
        createPara(
          "LankaRead is structured following the classic 3-Tier Model-View-Controller (MVC) architectural pattern:"
        ),
        createBullet("Single-Page Application (SPA) built with React 19, Vite, and TailwindCSS v4. It manages local UI state, consumes REST APIs via Axios, and maintains an open WebSockets channel for live server pushes.", "1. Presentation Tier (Client):"),
        createBullet("Express 5 server running on Node.js. It houses controllers, routes, JWT security middleware, Nodemailer email handlers, and the Socket.IO broadcast engine.", "2. Application Tier (Server):"),
        createBullet("MongoDB database instance storing persistent JSON document collections (Users, Books, Readers, Lendings). Equipped with MongoMemoryServer for automatic fallback during dev/testing.", "3. Persistence Tier (Database):"),

        createPara("System Architecture & Data Flow Diagram:"),
        createCodeBlock(
`+-----------------------------------------------------------------------------------+
|                            REACT FRONTEND CLIENT                                  |
|   (React 19 + TypeScript + TailwindCSS v4 + Socket.IO Client + Recharts + Axios)  |
+-----------------------------------------+-----------------------------------------+
                                          |
                     HTTP REST API Requests | WebSockets (Socket.IO Events)
                                          v
+-----------------------------------------------------------------------------------+
|                             NODE.JS / EXPRESS BACKEND                             |
|  (Auth Middleware + Book/Reader/Lending Controllers + Mailer + Socket.IO Engine) |
+-----------------------------------------+-----------------------------------------+
                                          |
                              Mongoose ODM Connection
                                          v
+-----------------------------------------------------------------------------------+
|                             MONGODB DATABASE                                      |
|    (Collections: User Accounts | Books Catalog | Readers | Book Lendings)        |
+-----------------------------------------------------------------------------------+`
        ),

        createSubHeader("3.2 Authentication & Token Security Architecture"),
        createPara(
          "LankaRead implements a hardened dual-token security architecture designed to prevent XSS (Cross-Site Scripting) and CSRF (Cross-Site Request Forgery) attacks:"
        ),
        createBullet("Short-lived JWT token containing user identity (_id, email, role). Sent in the Authorization header ('Bearer <token>') for protected REST routes.", "• Access Token:"),
        createBullet("Long-lived JWT token stored exclusively in an HTTP-Only, SameSite cookie ('refreshToken'). Cannot be accessed by client-side JavaScript, rendering it immune to XSS theft.", "• Refresh Token (HTTP-Only Cookie):"),
        createBullet("If an Access Token expires, the client transparently invokes '/api/auth/refresh', which reads the HTTP-Only cookie and issues a fresh Access Token without logging out the user.", "• Transparent Token Refresh:"),

        // SECTION 4
        createHeader("4. DATABASE SCHEMA & ENTITY MODELS"),
        createPara(
          "The system model consists of four primary interconnected Mongoose schemas residing in the database persistence layer:"
        ),

        createSubHeader("4.1 User Entity Schema (User.ts)"),
        createBullet("String (Auto-generated Mongo ObjectId)", "_id:"),
        createBullet("String (Full name of administrative staff or member)", "name:"),
        createBullet("String (Unique email address used for login authentication)", "email:"),
        createBullet("String (Bcrypt hashed password string)", "password:"),
        createBullet("String Enum ('admin' | 'user', default: 'user')", "role:"),
        createBullet("String (Optional storage of active refresh token)", "refreshToken:"),

        createSubHeader("4.2 Book Entity Schema (Book.ts)"),
        createBullet("String (Auto-generated Mongo ObjectId)", "_id:"),
        createBullet("String (Title of the book)", "title:"),
        createBullet("String (Author name)", "author:"),
        createBullet("String (Genre category, e.g., 'Fiction', 'Science', 'Sri Lankan Literature')", "genre:"),
        createBullet("Number (Number of currently unborrowed physical copies available)", "availableCopies:"),
        createBullet("String (Publication year/date)", "publishedDate:"),

        createSubHeader("4.3 Reader Entity Schema (Reader.ts)"),
        createBullet("String (Auto-generated Mongo ObjectId)", "_id:"),
        createBullet("String (Full name of library patron)", "name:"),
        createBullet("String (Email address for sending overdue email notices)", "email:"),
        createBullet("String (Contact phone number)", "phoneNumber:"),
        createBullet("String (Residential address in Sri Lanka)", "address:"),
        createBullet("Date (Membership registration date)", "registerDate:"),

        createSubHeader("4.4 Lending Entity Schema (Lending.ts)"),
        createBullet("String (Auto-generated Mongo ObjectId)", "_id:"),
        createBullet("Schema.Types.ObjectId (Reference to Book entity)", "bookId:"),
        createBullet("Schema.Types.ObjectId (Reference to Reader entity)", "readerId:"),
        createBullet("String (Cached book title for quick display)", "bookTitle:"),
        createBullet("String (Cached reader name for quick display)", "readerName:"),
        createBullet("Date (Timestamp when book was borrowed)", "borrowDate:"),
        createBullet("Date (Due date calculated as borrowDate + 14 days)", "dueDate:"),
        createBullet("Date | null (Timestamp when returned, null if active)", "returnDate:"),
        createBullet("String Enum ('borrowed' | 'returned' | 'overdue')", "status:"),

        // SECTION 5
        createHeader("5. DETAILED SYSTEM FEATURES & FUNCTIONALITIES"),

        createSubHeader("5.1 User Authentication & Role Security"),
        createBullet("Visitors can register an account providing name, email, and password. Defaults to 'user' role, with admin role capability.", "• User Registration & Sign Up:"),
        createBullet("Authenticates credentials against Bcrypt password hashes, issues Access Token & HTTP-Only Refresh Cookie.", "• Secure Login:"),
        createBullet("Frontend AdminRoutes wrapper restricts sensitive actions (e.g. creating/deleting books or readers) to authorized Admin accounts.", "• Role-Based Route Guards:"),

        createSubHeader("5.2 Interactive Analytics Dashboard"),
        createBullet("Live visual indicators displaying Total Books in Catalog, Registered Readers, Active Borrowed Loans, and Total Overdue Penalty Count.", "• Visual Stat Cards:"),
        createBullet("Interactive bar & pie charts powered by Recharts showing loan status proportions ('borrowed' vs 'returned' vs 'overdue') and book genre distributions.", "• Recharts Analytics Graphs:"),

        createSubHeader("5.3 Reader / Member Directory Management"),
        createBullet("Register new patrons with complete contact info (Email, Phone, Address).", "• Patron Registration:"),
        createBullet("Searchable directory of all patrons with one-click view of their borrowing history and overdue status.", "• Directory Search & History:"),

        createSubHeader("5.4 Book Catalog & Automated Stock Control"),
        createBullet("Library staff can add, edit, and search books by title, author, or genre.", "• Inventory Cataloging:"),
        createBullet("Issuing a book automatically decrements 'availableCopies' by 1. Returning a book increments 'availableCopies' back by 1.", "• Dynamic Stock Auto-Adjustment:"),

        createSubHeader("5.5 Circulation & 14-Day Lending Lifecycle"),
        createBullet("Validates that available copies > 0 before creating a loan record linking Book and Reader.", "• Issuing Book Loans:"),
        createBullet("Automatically computes due date to 14 days from issue date.", "• Automatic Due Date Calculation:"),
        createBullet("Completing a loan updates 'returnDate' timestamp, sets status to 'returned', and restores book inventory count.", "• Process Book Returns:"),

        createSubHeader("5.6 Overdue Fine Engine & Automated Email Dispatch"),
        createBullet("System compares 'dueDate' against current timestamp for active unreturned loans.", "• Overdue Monitor:"),
        createBullet("Calculates accrued fines at the rate of Rs. 50.00 (LKR) per day late.", "• Dynamic Fine Calculation:"),
        createBullet("Staff can click 'Send Email Notice' on any overdue record, triggering Nodemailer to send a formal HTML reminder to the patron's email.", "• Nodemailer Overdue Email Dispatch:"),

        createSubHeader("5.7 Real-Time WebSockets Multi-Client Synchronization"),
        createBullet("Socket.IO backend emits 'lending_updated' and 'book_updated' events whenever database state mutates.", "• Event Broadcasting:"),
        createBullet("Connected frontend clients instantly listen to events and show React Hot Toast alerts while refreshing table state without page reload.", "• Multi-Browser Live Toast Sync:"),

        // SECTION 6
        createHeader("6. REST API ENDPOINT REFERENCE"),
        createTable(
          ["Method", "Endpoint", "Auth Guard", "Description & Payload Details"],
          [
            ["POST", "/api/auth/register", "Public", "Registers a new user (name, email, password, role)."],
            ["POST", "/api/auth/login", "Public", "Authenticates user, sets HTTP-only refresh cookie, returns access token."],
            ["GET", "/api/auth/me", "JWT User", "Returns current authenticated user profile details."],
            ["GET", "/api/auth/refresh", "Public (Cookie)", "Reads HTTP-only refresh cookie and issues new access token."],
            ["POST", "/api/auth/logout", "Public", "Clears refresh token cookie and terminates user session."],
            ["GET", "/api/book", "Public", "Retrieves complete book catalog list with stock availability."],
            ["POST", "/api/book", "JWT Admin", "Adds a new book title to inventory (title, author, genre, stock)."],
            ["GET", "/api/book/:id", "Public", "Fetches single book details by Mongo ObjectId."],
            ["PUT", "/api/book/:id", "JWT Admin", "Updates existing book details or copy count."],
            ["DELETE", "/api/book/:id", "JWT Admin", "Removes book from catalog."],
            ["GET", "/api/reader", "JWT User", "Fetches all registered library patrons."],
            ["POST", "/api/reader", "JWT Admin", "Registers a new reader patron record."],
            ["GET", "/api/reader/:id", "JWT User", "Retrieves reader details and contact information."],
            ["PUT", "/api/reader/:id", "JWT Admin", "Updates reader contact info."],
            ["DELETE", "/api/reader/:id", "JWT Admin", "Deletes reader patron record."],
            ["GET", "/api/lending", "JWT User", "Fetches all lending records and updates overdue statuses."],
            ["POST", "/api/lending", "JWT Admin", "Issues a new book loan (bookId, readerId), decrements stock."],
            ["PUT", "/api/lending/:id/complete", "JWT Admin", "Marks book return, sets returnDate, increments stock."],
            ["GET", "/api/lending/overdue", "JWT User", "Fetches list of overdue book loans."],
            ["GET", "/api/lending/overdue/count", "JWT User", "Returns numerical count of currently overdue loans."],
            ["POST", "/api/lending/notify/:lendingId", "JWT Admin", "Dispatches overdue email notification via Nodemailer to patron."],
          ]
        ),

        // SECTION 7
        createHeader("7. MASTER VIDEO RECORDING SCRIPT FOR PROJECT OWNER"),
        createPara(
          "This section provides a scene-by-scene script designed specifically for the project owner or presenter to record an impressive, professional video demonstration of all functions and technologies of LankaRead."
        ),

        createCalloutBox("Video Recording Recommendations & Tips", [
          "• Recommended Video Duration: 10 to 12 Minutes.",
          "• Screen Resolution: 1920x1080 (1080p FHD).",
          "• Dual Browser Setup: Open two separate browser windows side-by-side (Window A: Admin Account, Window B: Secondary Client) to visually demonstrate WebSockets real-time toast updates during loan operations.",
          "• Microphones: Use a clear microphone and speak with a steady, confident pace.",
        ]),

        new Paragraph({ spacing: { after: 180 } }),

        createSubHeader("Scene 1: Introduction & Executive Pitch (0:00 - 1:00)"),
        createBullet("Screen showing LankaRead landing/login screen with dark glassmorphism design.", "• Visual Setup:"),
        createBullet(
          "\"Hello everyone, welcome to the demonstration of LankaRead – a full-stack real-time Library & Knowledge Portal built for public and academic library networks in Sri Lanka, serving branches in Colombo, Kandy, Galle, and Peradeniya. LankaRead replaces static paper-based tracking with an event-driven digital platform featuring instant WebSocket synchronization, role-based JWT security, automated fine tracking at Rs. 50 per day, and automated email reminders via Nodemailer. Let us inspect the technology stack and architecture.\"",
          "• Presenter Script:"
        ),

        createSubHeader("Scene 2: Technology Stack & Setup (1:00 - 2:30)"),
        createBullet("VS Code editor showing workspace directory (FrontEnd & BackEnd folders).", "• Visual Setup:"),
        createBullet(
          "\"On the technical side, LankaRead features a modern split architecture. The frontend is engineered with React 19, TypeScript, Vite, and TailwindCSS v4. The backend runs on Node.js 24 and Express 5, implementing the MVC pattern with TypeScript. Our data layer uses MongoDB with Mongoose ORM, backed by an in-memory database fallback (MongoMemoryServer) for zero-config local runs. For containerized deployments, we include Docker and Docker Compose.\"",
          "• Presenter Script:"
        ),

        createSubHeader("Scene 3: Authentication & Security Guard (2:30 - 4:00)"),
        createBullet("Browser showing Sign Up and Login page. Inspect Developer Tools -> Application -> Cookies.", "• Visual Setup:"),
        createBullet(
          "\"Security is built from the ground up. Users can sign up with name, email, and password. Passwords are salted and hashed using Bcrypt with 10 rounds. When logging in, the server generates a short-lived JWT Access Token sent in headers, and a long-lived Refresh Token stored securely inside an HTTP-Only cookie. This renders our authentication immune to XSS script theft. Role-based routing ensures only Admin accounts can mutate catalog and loan records.\"",
          "• Presenter Script:"
        ),

        createSubHeader("Scene 4: Analytics Dashboard Overview (4:00 - 5:15)"),
        createBullet("Logging in as Admin and landing on the Dashboard page.", "• Visual Setup:"),
        createBullet(
          "\"Upon logging in, the Admin is greeted with our Interactive Analytics Dashboard. Here we see four live statistical cards: Total Books in Catalog, Registered Readers, Active Borrowed Loans, and Overdue Penalty Accounts. Below, Recharts renders dynamic graphical breakdowns of our loan status distributions and genre breakdowns.\"",
          "• Presenter Script:"
        ),

        createSubHeader("Scene 5: Reader Directory & Member Operations (5:15 - 6:30)"),
        createBullet("Navigating to Readers page, clicking 'Add Reader', filling sample patron details.", "• Visual Setup:"),
        createBullet(
          "\"Let's navigate to the Readers Directory. Here staff can register library patrons across regional branches. I'll add a new patron: 'Kavindu Perera', email 'kavindu@example.com', phone '0771234567', residing in Kandy. Clicking Save instantly persists the reader to MongoDB and populates the table.\"",
          "• Presenter Script:"
        ),

        createSubHeader("Scene 6: Book Catalog & Real-Time Stock Control (6:30 - 7:45)"),
        createBullet("Navigating to Books page, demonstrating search bar, genre filters, and adding a new book.", "• Visual Setup:"),
        createBullet(
          "\"Now, let's open the Book Catalog. Staff can filter books by genre such as 'Fiction' or 'Sri Lankan Literature', or perform instant search. Notice the 'Available Copies' column. When books are added or borrowed, inventory counts update dynamically. Let's add a classic Sri Lankan book: 'The Village in the Jungle' by Leonard Woolf, with 3 physical copies.\"",
          "• Presenter Script:"
        ),

        createSubHeader("Scene 7: Issuing Loans & Real-Time WebSockets Demo (7:45 - 9:45)"),
        createBullet("Splitting screen: Window A (Admin) and Window B (Member/Secondary browser window).", "• Visual Setup:"),
        createBullet(
          "\"Now for our flagship feature: Real-Time WebSockets Synchronization. I have two browser windows open side-by-side. In Window A, I will issue a 14-day book loan for 'The Village in the Jungle' to patron Kavindu Perera. Watch Window B carefully when I click Issue Loan! Immediately, Socket.IO broadcasts a 'lending_updated' event, triggering a live toast notification in Window B and updating the active loans and available copy count from 3 to 2 instantly without reloading the page!\"",
          "• Presenter Script:"
        ),

        createSubHeader("Scene 8: Overdue Fine Engine & Email Reminder Dispatch (9:45 - 11:15)"),
        createBullet("Navigating to Overdue Page, highlighting the fine calculation column (Rs. 50/day).", "• Visual Setup:"),
        createBullet(
          "\"Managing overdue returns is automated in LankaRead. On the Overdue Page, the system automatically checks loan due dates. For any loan past 14 days, status changes to 'overdue' and fine penalties accrue automatically at Rs. 50.00 per day in LKR currency. By clicking 'Send Email Notice', Nodemailer triggers an automated HTML reminder directly to the patron's inbox.\"",
          "• Presenter Script:"
        ),

        createSubHeader("Scene 9: Book Returns & Automated Stock Restoration (11:15 - 12:15)"),
        createBullet("Navigating back to Lending Page, clicking 'Mark Returned' on an active loan.", "• Visual Setup:"),
        createBullet(
          "\"When the patron returns the physical book, staff click 'Mark Returned'. The system stamps the exact returnDate, updates loan status to 'returned', and automatically increments available copies back by 1 in MongoDB while broadcasting live WebSocket updates across all connected clients.\"",
          "• Presenter Script:"
        ),

        createSubHeader("Scene 10: Testing, Docker & Closing Summary (12:15 - 13:30)"),
        createBullet("Terminal window executing `npm test` in BackEnd, showing passed Jest tests.", "• Visual Setup:"),
        createBullet(
          "\"To guarantee code quality, we run automated Jest integration tests validating REST API endpoints and authentication guards using `npm test`. Furthermore, multi-container deployment is handled effortlessly via `docker-compose up --build`. In conclusion, LankaRead delivers a robust, secure, and modern digital library portal for Sri Lanka. Thank you for watching!\"",
          "• Presenter Script:"
        ),

        // SECTION 8
        createHeader("8. INSTALLATION, SETUP & LOCAL EXECUTION GUIDE"),
        createPara(
          "Follow these step-by-step instructions to run LankaRead on your local workstation or deploy via Docker containers:"
        ),

        createSubHeader("8.1 Local Development Environment Setup"),
        createCodeBlock(
`# Step 1: Clone the repository
git clone https://github.com/your-username/LankaRead.git
cd LankaRead

# Step 2: Install & Start BackEnd API Server
cd BackEnd
npm install
npm run dev

# Step 3: Open a new terminal and Start FrontEnd Client
cd FrontEnd
npm install
npm run dev`
        ),

        createSubHeader("8.2 Running Automated Jest Tests"),
        createCodeBlock(
`cd BackEnd
npm test`
        ),

        createSubHeader("8.3 Multi-Container Docker Deployment"),
        createCodeBlock(
`# From root directory of LankaRead
docker-compose up --build -d`
        ),

        createSubHeader("8.4 Environment Variables (.env) Reference"),
        createCodeBlock(
`# BackEnd .env configuration
PORT=3000
MONGO_URI=mongodb://localhost:27017/lankaread
ACCESS_TOKEN_SECRET=lankaread_access_secret_key_2026
REFRESH_TOKEN_SECRET=lankaread_refresh_secret_key_2026
Mail_USER=your-email@gmail.com
Mail_PASS=your-gmail-app-password`
        ),
      ],
    },
  ],
});

const outputPath = path.join(__dirname, "..", "LankaRead_Project_Documentation.docx");
Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync(outputPath, buffer);
  console.log(`[SUCCESS] Word Document generated successfully at: ${outputPath}`);
});
