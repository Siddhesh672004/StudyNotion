# 📚 StudyNotion - EdTech Platform

## 🌟 Overview

StudyNotion is comprehensive EdTech (Educational Technology) platform designed to revolutionize the learning experience by providing a seamless, interactive, and accessible education ecosystem. The platform connects students and instructors globally, enabling the creation, consumption, and rating of educational content.


### ✨ Key Highlights

- 🎓 **For Students**: Access high-quality courses, track progress, and rate content
- 👨‍🏫 **For Instructors**: Create and manage courses, upload content, and connect with learners
- 💳 **Secure Payments**: Integrated payment gateway for course enrollment
- 📱 **Responsive Design**: Seamless experience across all devices
- ☁️ **Cloud Storage**: Efficient media management for videos and documents

---

## 🏗️ System Architecture

StudyNotion follows a **client-server architecture** with three main components:

```
┌─────────────────┐          ┌─────────────────┐          ┌─────────────────┐
│                 │          │                 │          │                 │
│   FRONTEND      │◄────────►│    BACKEND      │◄────────►│    DATABASE     │
│   (React)       │   API    │  (Node/Express) │          │   (MongoDB)     │
│                 │          │                 │          │                 │
└─────────────────┘          └─────────────────┘          └─────────────────┘
```

### Architecture Components

1. **Frontend (Client)**
   - Built with ReactJS for dynamic and responsive UI
   - Communicates with backend via RESTful APIs
   - Manages user interactions and displays data

2. **Backend (Server)**
   - Node.js and Express.js handle business logic
   - Implements authentication, authorization, and data processing
   - Manages API endpoints and database operations

3. **Database**
   - MongoDB stores user data, courses, and content
   - Flexible NoSQL structure for varied content types
   - Scalable solution for growing platform needs
   - Mongo Db 

---

## 🚀 Features

### 👤 User Management

- **Authentication & Authorization**
  - Secure signup/login with email and password
  - OTP verification for enhanced security
  - Password reset functionality
  - JWT-based session management

- **User Roles**
  - Students: Browse, enroll, and consume courses
  - Instructors: Create and manage educational content
  - Admin: Platform management and oversight

### 📖 Course Management

- **For Instructors**
  - ✏️ Create, update, and delete courses
  - 📹 Upload video lectures and course materials
  - 📝 Organize content in structured modules
  - 📊 Track course performance and student engagement
  - 💰 Set course pricing and manage enrollments

- **For Students**
  - 🔍 Browse comprehensive course catalog
  - ⭐ View course ratings and reviews
  - 🛒 Add courses to cart and wishlist
  - 📚 Access enrolled course content
  - ✍️ Rate and review completed courses
  - 📈 Track learning progress

### 💻 Technical Features

- **Payment Integration**
  - Razorpay integration for secure transactions
  - Support for multiple payment methods
  - Automated enrollment upon successful payment
  - Invoice generation

- **Media Management**
  - Cloudinary integration for cloud-based storage
  - Support for videos, images, and documents
  - Optimized media delivery
  - Automatic thumbnail generation

- **Content Rendering**
  - Markdown support for rich course content
  - Code syntax highlighting
  - Embedded video player
  - Downloadable resources

---

## 🛠️ Tech Stack

### Frontend

| Technology | Purpose |
|------------|---------|
| **React.js** | UI library for building interactive interfaces |
| **Redux** | State management for application data |
| **Tailwind CSS** | Utility-first CSS framework for styling |
| **React Router** | Client-side routing and navigation |
| **Axios** | HTTP client for API requests |

### Backend

| Technology | Purpose |
|------------|---------|
| **Node.js** | JavaScript runtime for server-side logic |
| **Express.js** | Web application framework |
| **MongoDB** | NoSQL database for data storage |
| **Mongoose** | MongoDB object modeling |
| **JWT** | Authentication and authorization |
| **Bcrypt** | Password hashing |

### Third-Party Services

| Service | Purpose |
|---------|---------|
| **Cloudinary** | Cloud-based media management |
| **Razorpay** | Payment gateway integration |
| **Nodemailer** | Email service for notifications |

---

## 📦 Installation & Setup

### Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or Atlas)
- Git

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Siddhesh672004/StudyNotion.git
cd StudyNotion
```

### 2️⃣ Install Dependencies

#### Frontend Setup
```bash
# Install frontend dependencies
npm install
```

#### Backend Setup
```bash
# Navigate to server directory
cd server

# Install backend dependencies
npm install
```

### 3️⃣ Environment Configuration

Create a `.env` file in the `server` directory with the following variables:

```env
# Server Configuration
PORT=4000
NODE_ENV=development

# Database
MONGODB_URL=your_mongodb_connection_string

# JWT Secret
JWT_SECRET=your_jwt_secret_key

# Cloudinary Configuration
CLOUD_NAME=your_cloudinary_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret

# Razorpay Configuration
RAZORPAY_KEY=your_razorpay_key
RAZORPAY_SECRET=your_razorpay_secret

# Mail Configuration
MAIL_HOST=smtp.gmail.com
MAIL_USER=your_email@gmail.com
MAIL_PASS=your_email_app_password
```

Create a `.env` file in the root directory:

```env
REACT_APP_BASE_URL=http://localhost:4000/api/v1
```

### 4️⃣ Run the Application

#### Start Backend Server
```bash
cd server
npm run dev
```

#### Start Frontend (in a new terminal)
```bash
npm start
```

The application should now be running:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:4000

---

## 📂 Project Structure

```
StudyNotion/
├── public/                    # Static files
├── server/                    # Backend application
│   ├── config/               # Configuration files
│   ├── controllers/          # Request handlers
│   ├── models/               # Database models
│   ├── routes/               # API routes
│   ├── middleware/           # Custom middleware
│   ├── utils/                # Utility functions
│   └── index.js              # Server entry point
├── src/                      # Frontend application
│   ├── components/           # React components
│   ├── pages/                # Page components
│   ├── services/             # API services
│   ├── redux/                # Redux store and slices
│   ├── utils/                # Utility functions
│   ├── App.js                # Main App component
│   └── index.js              # Application entry point
├── .gitignore
├── package.json
├── tailwind.config.js
└── README.md
```

---

## 🎯 Core Functionality

### User Flow

#### Student Journey
1. **Registration/Login** → Create account or sign in
2. **Browse Courses** → Explore available courses
3. **Course Details** → View syllabus, ratings, and preview
4. **Enrollment** → Add to cart and complete payment
5. **Learn** → Access course content and materials
6. **Review** → Rate and review completed courses

#### Instructor Journey
1. **Registration/Login** → Create instructor account
2. **Dashboard** → Access instructor dashboard
3. **Create Course** → Set up course details and structure
4. **Upload Content** → Add videos, documents, and materials
5. **Publish** → Make course available to students
6. **Manage** → Track enrollments and update content

### API Endpoints

#### Authentication
- `POST /api/v1/auth/signup` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/sendotp` - Send OTP for verification
- `POST /api/v1/auth/changepassword` - Change password

#### Courses
- `GET /api/v1/course/getAllCourses` - Get all courses
- `GET /api/v1/course/getCourseDetails` - Get specific course
- `POST /api/v1/course/createCourse` - Create new course (Instructor)
- `PUT /api/v1/course/editCourse` - Update course (Instructor)
- `DELETE /api/v1/course/deleteCourse` - Delete course (Instructor)

#### Payment
- `POST /api/v1/payment/capturePayment` - Process payment
- `POST /api/v1/payment/verifySignature` - Verify payment

---

## 🎨 UI/UX Design

The platform features a clean, modern interface designed for optimal user experience:

- **Responsive Design**: Adapts seamlessly to desktop, tablet, and mobile devices
- **Intuitive Navigation**: Easy-to-use menu and course browsing
- **Visual Hierarchy**: Clear content organization and information architecture
- **Accessibility**: WCAG compliant for inclusive access
- **Performance**: Optimized loading and smooth transitions

---

## 🔒 Security Features

- **Password Hashing**: Bcrypt encryption for secure password storage
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Server-side validation to prevent malicious input
- **CORS Configuration**: Controlled cross-origin resource sharing
- **Environment Variables**: Sensitive data stored securely
- **Rate Limiting**: Protection against brute force attacks

---

## 🚧 Future Enhancements

- [ ] Live video streaming for instructor lectures
- [ ] Discussion forums for student collaboration
- [ ] Quiz and assessment integration
- [ ] Certificate generation upon course completion
- [ ] Advanced analytics dashboard for instructors
- [ ] Mobile application (iOS/Android)
- [ ] Multi-language support
- [ ] AI-powered course recommendations
- [ ] Social sharing features
- [ ] Offline course downloads

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

Distributed under the MIT License. See `LICENSE` file for more information.

---

## 👨‍💻 Developer

**Siddhesh**

- GitHub: [@Siddhesh672004](https://github.com/Siddhesh672004)
- Project Link: [https://github.com/Siddhesh672004/StudyNotion](https://github.com/Siddhesh672004/StudyNotion)
- Live Demo: [https://study-notion-ten-omega.vercel.app](https://study-notion-ten-omega.vercel.app)

---

## 🙏 Acknowledgments

- [React Documentation](https://reactjs.org/)
- [Node.js Documentation](https://nodejs.org/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Cloudinary](https://cloudinary.com/)
- [Razorpay](https://razorpay.com/)

---

## 📞 Support

If you have any questions or need help with the project, please:

- Open an [issue](https://github.com/Siddhesh672004/StudyNotion/issues)
- Reach out via GitHub discussions
- Check existing documentation and issues

---

<div align="center">

### ⭐ Star this repository if you found it helpful!

**Made with ❤️ by Siddhesh**

</div>
