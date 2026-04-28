# StudyNotion - Comprehensive Project Information

Generated from repository analysis on **2026-04-28**.

> **Scope note:** This document covers all repository files in source control (excluding `node_modules`, build output, and `.git` internals).

---

## 1. Project Overview

- **Project name:** `StudyNotion`
- **Purpose:** Full-stack EdTech marketplace/LMS where instructors create courses and students discover, purchase, and consume them.
- **Primary goals:**
  - Account onboarding (OTP-based signup + JWT login)
  - Course lifecycle (create/edit/publish, sections, lectures)
  - Monetization (Razorpay checkout + enrollment)
  - Learning experience (video player + lecture progress + reviews)
- **Problem solved:** Bridges content creation and online learning in one workflow (catalog -> payment -> enrollment -> progress).
- **Target users:** Students, instructors, and admin users (role checks exist for all three).
- **Current status:** **WIP with production scaffolding**. Core product flows are functional; deployment, CI/CD, and security hardening are partially scaffolded and still evolving.

---

## 2. Tech Stack

### Languages and runtimes

| Layer | Technologies |
|---|---|
| Frontend | JavaScript, JSX, CSS |
| Backend | Node.js (CommonJS JavaScript) |
| Database | MongoDB |
| Infra/Config | YAML, Dockerfile, Nginx config, PowerShell |
| Utility tooling | Python (`scripts/md_to_docx.py`) |

**Detected runtime versions**
- **Node 20** in CI/workflows and Docker (`.github/workflows/*.yml`, `client/Dockerfile`, `server/Dockerfile`)
- **MongoDB 7** in dev compose (`docker-compose.yml`)

### Frontend libraries/frameworks

- React 18 (`client/src/main.jsx`)
- React Router (`client/src/App.jsx`)
- Redux Toolkit (`client/src/store/slices/*`, `client/src/reducer/index.js`)
- TanStack React Query (`client/src/main.jsx`, hooks in `client/src/hooks/*`)
- Tailwind CSS + PostCSS (`client/tailwind.config.js`, `client/postcss.config.js`, `client/src/index.css`)
- Axios (`client/src/services/apiconnector.js`, `client/src/services/axiosInstance.js`)
- UI/libs: Swiper, react-hot-toast, react-hook-form, react-icons, video-react, chart.js/react-chartjs-2, react-dropzone, react-markdown

### Backend libraries/frameworks

- Express 5 (`server/src/app.js`)
- Mongoose (`server/src/models/*`)
- JWT (`server/src/middlewares/auth.js`, `server/src/controllers/Auth.js`)
- bcrypt (`server/src/controllers/Auth.js`, `server/src/controllers/ResetPassword.js`)
- zod validation (`server/src/validators/auth.validator.js`, middleware `validate.js`)
- express-fileupload (`server/src/middlewares/upload.js`)
- nodemailer (`server/src/utils/mailSender.js`)
- Razorpay SDK (`server/src/config/razorpay.js`, `server/src/services/paymentService.js`)
- Cloudinary SDK (`server/src/config/cloudinary.js`, `server/src/utils/imageUploader.js`)

### Database and ORM

- **Database:** MongoDB
- **ORM/ODM:** Mongoose
- **Migrations:** No migration system present
- **Seeding:** No formal seeder; OTP and business data are created through runtime APIs

### Authentication method

- JWT-based auth
- Token read order in backend middleware:
  1. `Authorization` header
  2. `req.body.token`
  3. `req.cookies.token`
- Cookie also set at login (`httpOnly`, `sameSite: strict`, `secure` in production)

### State management

- Redux Toolkit slices:
  - `auth`
  - `profile`
  - `cart`
  - `course`
  - `viewCourse`
- React Query for server-state fetching (`client/src/hooks/*`)

### Styling approach

- Tailwind utility classes as primary styling
- Shared class utilities in `client/src/App.css`
- Base Tailwind directives in `client/src/index.css`

### Build tools and bundlers

- CRA/react-scripts (`client/package.json`)
- Webpack via react-scripts (implicit)
- Docker multi-stage builds for client/server
- Nginx static serving/reverse proxy in production

### Testing frameworks

- Jest
- Supertest
- mongodb-memory-server

---

## 3. Project Structure

### 3.1 Complete repository file inventory

```text
.env.example
.github/copilot-instructions.md
.github/workflows/ci.yml
.github/workflows/deploy.yml
.gitignore
.vscode/settings.json
client/.env
client/.env.example
client/Dockerfile
client/fix_imports.js
client/nginx.conf
client/package-lock.json
client/package.json
client/postcss.config.js
client/public/index.html
client/public/robots.txt
client/src/App.css
client/src/App.jsx
client/src/assets/Images/aboutus1.webp
client/src/assets/Images/aboutus2.webp
client/src/assets/Images/aboutus3.webp
client/src/assets/Images/banner.mp4
client/src/assets/Images/bghome.svg
client/src/assets/Images/boxoffice.png
client/src/assets/Images/Compare_with_others.png
client/src/assets/Images/Compare_with_others.svg
client/src/assets/Images/FoundingStory.png
client/src/assets/Images/frame.png
client/src/assets/Images/Instructor.png
client/src/assets/Images/Know_your_progress.png
client/src/assets/Images/Know_your_progress.svg
client/src/assets/Images/login.webp
client/src/assets/Images/Plan_your_lessons.png
client/src/assets/Images/Plan_your_lessons.svg
client/src/assets/Images/signup.webp
client/src/assets/Images/TimelineImage.png
client/src/assets/Logo/Logo-Full-Dark.png
client/src/assets/Logo/Logo-Full-Light.png
client/src/assets/Logo/Logo-Small-Dark.png
client/src/assets/Logo/Logo-Small-Light.png
client/src/assets/Logo/rzp_logo.png
client/src/assets/TimeLineLogo/Logo1.svg
client/src/assets/TimeLineLogo/Logo2.svg
client/src/assets/TimeLineLogo/Logo3.svg
client/src/assets/TimeLineLogo/Logo4.svg
client/src/components/common/ConfirmationModal.jsx
client/src/components/common/Footer.jsx
client/src/components/common/IconBtn.jsx
client/src/components/common/Navbar.jsx
client/src/components/common/ratingStars.jsx
client/src/components/common/ReviewSlider.jsx
client/src/components/common/Tab.jsx
client/src/components/core/AboutPage/ContactFormSection.jsx
client/src/components/core/AboutPage/LearningGrid.jsx
client/src/components/core/AboutPage/Quote.jsx
client/src/components/core/AboutPage/Stats.jsx
client/src/components/core/Auth/LoginForm.jsx
client/src/components/core/Auth/OpenRoute.jsx
client/src/components/core/Auth/PrivateRoute.jsx
client/src/components/core/Auth/ProfileDropDown.jsx
client/src/components/core/Auth/RoleGuard.jsx
client/src/components/core/Auth/SignupForm.jsx
client/src/components/core/Auth/Template.jsx
client/src/components/core/Catalog/Course_card.jsx
client/src/components/core/Catalog/Course_Slider.jsx
client/src/components/core/ContactUsPage/ContactDetails.jsx
client/src/components/core/ContactUsPage/ContactForm.jsx
client/src/components/core/ContactUsPage/ContactUsForm.jsx
client/src/components/core/Course/CourseAccordionBar.jsx
client/src/components/core/Course/CourseDetailsCard.jsx
client/src/components/core/Course/CourseSubSectionAccordion.jsx
client/src/components/core/Dashboard/AddCourse/CourseBuilder/CourseBuilderForm.jsx
client/src/components/core/Dashboard/AddCourse/CourseBuilder/NestedView.jsx
client/src/components/core/Dashboard/AddCourse/CourseBuilder/SubSectionModal.jsx
client/src/components/core/Dashboard/AddCourse/CourseInformation/ChipInput.jsx
client/src/components/core/Dashboard/AddCourse/CourseInformation/CourseInformationForm.jsx
client/src/components/core/Dashboard/AddCourse/CourseInformation/RequirementField.jsx
client/src/components/core/Dashboard/AddCourse/index.js
client/src/components/core/Dashboard/AddCourse/PublishCourse/index.js
client/src/components/core/Dashboard/AddCourse/RenderSteps.jsx
client/src/components/core/Dashboard/AddCourse/Upload.jsx
client/src/components/core/Dashboard/Cart/index.jsx
client/src/components/core/Dashboard/Cart/RenderCartCourses.jsx
client/src/components/core/Dashboard/Cart/RenderTotalAmount.jsx
client/src/components/core/Dashboard/EditCourse/index.js
client/src/components/core/Dashboard/EnrolledCourses.jsx
client/src/components/core/Dashboard/Instructor.jsx
client/src/components/core/Dashboard/InstructorCourses/CoursesTable.jsx
client/src/components/core/Dashboard/InstructorDashboard/InstructorChart.jsx
client/src/components/core/Dashboard/MyCourses.jsx
client/src/components/core/Dashboard/MyProfile.jsx
client/src/components/core/Dashboard/Settings/ChangeProfilePicture.jsx
client/src/components/core/Dashboard/Settings/DeleteAccount.jsx
client/src/components/core/Dashboard/Settings/EditProfile.jsx
client/src/components/core/Dashboard/Settings/index.jsx
client/src/components/core/Dashboard/Settings/UpdatePassword.jsx
client/src/components/core/Dashboard/Sidebar.jsx
client/src/components/core/Dashboard/SidebarLink.jsx
client/src/components/core/HomePage/Button.jsx
client/src/components/core/HomePage/CodeBlocks.jsx
client/src/components/core/HomePage/CourseCard.jsx
client/src/components/core/HomePage/ExploreMore.jsx
client/src/components/core/HomePage/HighlightText.jsx
client/src/components/core/HomePage/InstructorSection.jsx
client/src/components/core/HomePage/LearningLanguageSection.jsx
client/src/components/core/HomePage/TimelineSection.jsx
client/src/components/core/ViewCourse/CourseReviewModal.jsx
client/src/components/core/ViewCourse/VideoDetails.jsx
client/src/components/core/ViewCourse/VideoDetailsSlidebar.jsx
client/src/data/countrycode.json
client/src/data/dashboard-links.js
client/src/data/footer-links.js
client/src/data/homepage-explore.js
client/src/data/navbar-links.js
client/src/hooks/useCatalog.js
client/src/hooks/useCourseDetails.js
client/src/hooks/useEnrolledCourses.js
client/src/hooks/useInstructorCourses.js
client/src/hooks/useInstructorData.js
client/src/hooks/useOnClickOutside.js
client/src/hooks/useProfile.js
client/src/index.css
client/src/index.js
client/src/main.jsx
client/src/pages/About.jsx
client/src/pages/Catalog.jsx
client/src/pages/Contact.jsx
client/src/pages/CourseDetails.jsx
client/src/pages/Dashboard.jsx
client/src/pages/Error.jsx
client/src/pages/ForgotPassword.jsx
client/src/pages/Home.jsx
client/src/pages/Login.jsx
client/src/pages/Signup.jsx
client/src/pages/UpdatePassword.jsx
client/src/pages/VerifyEmail.jsx
client/src/pages/ViewCourse.jsx
client/src/reducer/index.js
client/src/services/apiconnector.js
client/src/services/apis.js
client/src/services/axiosInstance.js
client/src/services/formatDate.js
client/src/services/operations/authAPI.js
client/src/services/operations/courseDetailsApi.js
client/src/services/operations/pageAndComponntDatas.js
client/src/services/operations/profileAPI.js
client/src/services/operations/SettingsAPI.js
client/src/services/operations/studentFeaturesApi.js
client/src/store/README.md
client/src/store/slices/authSlice.js
client/src/store/slices/cartSlice.js
client/src/store/slices/courseSlice.js
client/src/store/slices/profileSlice.js
client/src/store/slices/viewCourseSlice.js
client/src/styles/README.md
client/src/utils/avgRating.js
client/src/utils/constants.js
client/src/utils/dateFormatter.js
client/tailwind.config.js
docker-compose.prod.yml
docker-compose.yml
docs/superpowers/plans/2026-04-13-phase1-foundation-restructure.md
nginx/nginx.conf
package-lock.json
package.json
README.md
scripts/e2e-payment-check.ps1
scripts/e2e-payment-negative-check.ps1
scripts/generate-razorpay-signature.js
scripts/get-latest-otp.js
scripts/md_to_docx.py
server/.env
server/.env.example
server/.gitignore
server/Dockerfile
server/index.js
server/package-lock.json
server/package.json
server/server.js
server/src/app.js
server/src/config/cloudinary.js
server/src/config/database.js
server/src/config/razorpay.js
server/src/controllers/Auth.js
server/src/controllers/Category.js
server/src/controllers/ContactUs.js
server/src/controllers/Course.js
server/src/controllers/Payments.js
server/src/controllers/Profile.js
server/src/controllers/RatingAndReview.js
server/src/controllers/ResetPassword.js
server/src/controllers/Section.js
server/src/controllers/Subsection.js
server/src/mail/templates/contactFormRes.js
server/src/mail/templates/courseEnrollmentEmail.js
server/src/mail/templates/emailVerificationTemplate.js
server/src/mail/templates/passwordUpdate.js
server/src/mail/templates/paymentSuccessEmail.js
server/src/middlewares/auth.js
server/src/middlewares/errorHandler.js
server/src/middlewares/upload.js
server/src/middlewares/validate.js
server/src/models/Category.js
server/src/models/Course.js
server/src/models/CourseProgress.js
server/src/models/OTP.js
server/src/models/Profile.js
server/src/models/RatingAndReview.js
server/src/models/Section.js
server/src/models/SubSection.js
server/src/models/User.js
server/src/routes/v1/Contact.js
server/src/routes/v1/Course.js
server/src/routes/v1/index.js
server/src/routes/v1/Payment.js
server/src/routes/v1/Profile.js
server/src/routes/v1/User.js
server/src/services/courseService.js
server/src/services/emailService.js
server/src/services/paymentService.js
server/src/services/progressService.js
server/src/utils/apiResponse.js
server/src/utils/AppError.js
server/src/utils/asyncHandler.js
server/src/utils/imageUploader.js
server/src/utils/mailSender.js
server/src/utils/secToDuration.js
server/src/validators/auth.validator.js
server/src/validators/auth.validators.js
skills/brainstorming/scripts/frame-template.html
skills/brainstorming/scripts/helper.js
skills/brainstorming/scripts/server.cjs
skills/brainstorming/scripts/start-server.sh
skills/brainstorming/scripts/stop-server.sh
skills/brainstorming/SKILL.md
skills/brainstorming/spec-document-reviewer-prompt.md
skills/brainstorming/visual-companion.md
skills/dispatching-parallel-agents/SKILL.md
skills/executing-plans/SKILL.md
skills/finishing-a-development-branch/SKILL.md
skills/receiving-code-review/SKILL.md
skills/requesting-code-review/code-reviewer.md
skills/requesting-code-review/SKILL.md
skills/subagent-driven-development/code-quality-reviewer-prompt.md
skills/subagent-driven-development/implementer-prompt.md
skills/subagent-driven-development/SKILL.md
skills/subagent-driven-development/spec-reviewer-prompt.md
skills/systematic-debugging/condition-based-waiting-example.ts
skills/systematic-debugging/condition-based-waiting.md
skills/systematic-debugging/CREATION-LOG.md
skills/systematic-debugging/defense-in-depth.md
skills/systematic-debugging/find-polluter.sh
skills/systematic-debugging/root-cause-tracing.md
skills/systematic-debugging/SKILL.md
skills/systematic-debugging/test-academic.md
skills/systematic-debugging/test-pressure-1.md
skills/systematic-debugging/test-pressure-2.md
skills/systematic-debugging/test-pressure-3.md
skills/test-driven-development/SKILL.md
skills/test-driven-development/testing-anti-patterns.md
skills/using-git-worktrees/SKILL.md
skills/using-superpowers/references/codex-tools.md
skills/using-superpowers/references/copilot-tools.md
skills/using-superpowers/references/gemini-tools.md
skills/using-superpowers/SKILL.md
skills/verification-before-completion/SKILL.md
skills/writing-plans/plan-document-reviewer-prompt.md
skills/writing-plans/SKILL.md
skills/writing-skills/anthropic-best-practices.md
skills/writing-skills/examples/CLAUDE_MD_TESTING.md
skills/writing-skills/graphviz-conventions.dot
skills/writing-skills/persuasion-principles.md
skills/writing-skills/render-graphs.js
skills/writing-skills/SKILL.md
skills/writing-skills/testing-skills-with-subagents.md
tests/integration/auth.test.js
tests/integration/catalog.test.js
tests/integration/course-builder.test.js
tests/integration/course.test.js
tests/integration/payment.test.js
tests/integration/profile.test.js
tests/integration/progress.test.js
tests/setup/jest.config.js
tests/setup/setupTests.js
tests/unit/.gitkeep
tests/unit/auth.validator.test.js
tests/unit/category.controller.test.js
tests/unit/payments.controller.test.js
tests/unit/progress.service.test.js
```

### 3.2 Structure and purpose map

- **Root orchestrator:** workspace scripts, docker compose, repo docs, CI/CD workflows.
- **`client/`:** CRA React app (UI, routing, API clients, state, hooks, design assets).
- **`server/`:** Express API with layered folders:
  - `config/`: external service/database config.
  - `controllers/`: route business logic.
  - `models/`: Mongoose schemas.
  - `middlewares/`: auth/upload/validation/error middleware.
  - `routes/v1/`: API route definitions.
  - `services/`: reusable domain services (payments/progress/email).
  - `utils/`: helpers and API envelope utilities.
  - `mail/templates/`: transactional email HTML builders.
- **`tests/`:** Jest unit/integration contracts.
- **`scripts/`:** e2e payment helper scripts + utility scripts.
- **`nginx/`:** reverse proxy for prod compose.
- **`skills/`:** internal Copilot/Superpowers skill definitions and references.
- **`docs/superpowers/plans/`:** historical implementation planning artifact.

### 3.3 Entry points

- **Frontend runtime entry:** `client/src/main.jsx`
- **Frontend bootstrap shim:** `client/src/index.js` (imports `./main`)
- **Frontend root component:** `client/src/App.jsx`
- **Backend runtime entry:** `server/server.js`
- **Backend app composition:** `server/src/app.js`
- **Backend alias entry:** `server/index.js` -> `require("./server")`

### 3.4 Config files and what they configure

- `client/tailwind.config.js`: theme palette + fonts + scan paths
- `client/postcss.config.js`: PostCSS plugins (`postcss-nesting`, `tailwindcss`, `autoprefixer`)
- `client/nginx.conf`: SPA fallback routing (`try_files ... /index.html`)
- `server/.env.example`: backend variable template
- `docker-compose.yml`: local dev stack (`mongo`, `server`, `client`)
- `docker-compose.prod.yml`: production stack with external DB expectation + nginx proxy
- `nginx/nginx.conf`: reverse proxy `/api/` to server and `/` to client
- `.github/workflows/ci.yml`: PR test/lint pipeline
- `.github/workflows/deploy.yml`: placeholder push-to-main deployment pipeline
- `tests/setup/jest.config.js`: Jest suite, coverage thresholds, report target

---

## 4. Architecture & Design Patterns

### Overall architecture

- **Monolithic full-stack app** split into `client` and `server` packages.
- **REST API** backend with role-based middleware and controller/service structure.

### Patterns used

- **Middleware chain** (Express): auth, validation, upload, envelope normalization, error handler.
- **Service layer extraction** for payments/progress/email.
- **Redux slice pattern** for client global state.
- **React Query hooks** for server-state fetching and cache control.
- **Schema compatibility pattern** in `Course` model:
  - legacy keys (`courseName`, `courseDescription`, `courseContent`)
  - normalized keys (`title`, `description`, `sections`)
  - sync logic in `courseSchema.pre("save")`

### Data flow

1. UI dispatches action or hook request (`courseDetailsApi.js`, `profileAPI.js`, etc.)
2. API client adds auth header/token normalization (`apiconnector.js` / `axiosInstance.js`)
3. Express route maps request -> controller
4. Controller uses models/services
5. `res.json` wrapper in `server/src/app.js` normalizes response envelope into:
   - `success`, `statusCode`, `message`, `data`
6. Client consumes normalized payload and updates Redux state/UI

### API architecture

- Versioned REST under `/api/v1`
- Grouped resources: `auth`, `profile`, `course`, `payment`, `reach`

---

## 5. Features & Functionalities

Each feature below includes behavior, involved files, implementation flow, and edge handling.

### 5.1 Authentication (OTP signup, login, logout)

- **What it does:** User onboarding and session establishment.
- **Files/components:**
  - Backend: `server/src/controllers/Auth.js`, `server/src/models/OTP.js`, `server/src/models/User.js`, `server/src/routes/v1/User.js`
  - Frontend: `client/src/components/core/Auth/*`, `client/src/services/operations/authAPI.js`, `client/src/pages/VerifyEmail.jsx`
- **How it works:**
  - `sendOTP`/`resendOtp` creates OTP docs.
  - OTP model pre-save sends email using `mailSender`.
  - `signUp` validates latest OTP and creates profile + user.
  - `login` verifies password and issues JWT + cookie.
- **Edge/special handling:**
  - Duplicate user check on signup.
  - Token normalization strips nested/quoted `Bearer` formats.
  - Client purges stale/expired tokens via interceptors.

### 5.2 Password reset and change password

- **Files:** `server/src/controllers/ResetPassword.js`, `server/src/controllers/Auth.js (changePassword)`, frontend pages `ForgotPassword.jsx`, `UpdatePassword.jsx`, service `authAPI.js`.
- **Logic:**
  - Reset token generated via `crypto.randomUUID()`, stored on user with expiry.
  - Reset email contains frontend URL with token.
  - Reset endpoint verifies token + expiry, updates hashed password.
  - Authenticated users can change password directly (`/auth/changepassword`).
- **Edge handling:**
  - Mismatch/expired token responses.
  - Password-change notification email.

### 5.3 Role-based authorization and protected routing

- **Files:** backend `middlewares/auth.js`; frontend `PrivateRoute.jsx`, `OpenRoute.jsx`, `RoleGuard.jsx`, route wiring in `App.jsx`.
- **Logic:** JWT payload includes `accountType`; middleware gates student/instructor/admin API routes; UI routes are gated by account type.
- **Edge handling:** Missing/invalid token returns 401; unauthorized role returns protected-route messages.

### 5.4 Course catalog and discovery

- **Files:** `controllers/Category.js`, `controllers/Course.js (showAllCourses/getCourseDetails)`, `pages/Catalog.jsx`, hooks `useCatalog.js`, `useCourseDetails.js`.
- **Logic:**
  - Public course listing uses `status: "Published"` filter.
  - Category page loads selected category, another category sample, and top-selling courses.
  - Catalog slug maps category name to route segment.
- **Edge handling:** category/course not found guards and fallback error screens.

### 5.5 Course details and enrollment CTA

- **Files:** `pages/CourseDetails.jsx`, `components/core/Course/CourseDetailsCard.jsx`, `services/operations/studentFeaturesApi.js`, Redux `cartSlice.js`.
- **Logic:** Details page shows metadata, syllabus, ratings, author info, and buy/cart actions.
- **Edge handling:**
  - If user not logged in -> confirmation modal.
  - Instructors prevented from buying.
  - Already-enrolled students see "Go To Course" instead of buy/add-cart.

### 5.6 Cart and checkout

- **Files:** `cartSlice.js`, `Cart/*`, `studentFeaturesApi.js`, payment backend.
- **Logic:** Cart state persists in localStorage (`cart`, `total`, `totalItems`), then checkout initiates Razorpay order.
- **Edge handling:** duplicate cart add prevention, token-expiry redirect, empty-cart handling.

### 5.7 Razorpay payment verification and enrollment

- **Files:** `server/src/controllers/Payments.js`, `server/src/services/paymentService.js`, `server/src/config/razorpay.js`.
- **Logic:**
  - `capturePayment` validates selected courses and creates Razorpay order.
  - `verifyPayment` verifies signature, payment state, amount, and order notes.
  - On success, student enrollment + courseProgress initialization + enrollment email.
- **Edge handling:**
  - Invalid course IDs, already-enrolled users, order-user mismatch, payment not captured, amount mismatch.

### 5.8 Instructor course creation/edit/publish

- **Files:** `controllers/Course.js`, `controllers/Section.js`, `controllers/Subsection.js`, frontend `Dashboard/AddCourse/*`, `EditCourse/index.js`.
- **Logic:** 3-step wizard:
  1. Course metadata (`CourseInformationForm`)
  2. Sections/lectures (`CourseBuilderForm`, `SubSectionModal`)
  3. Publish state (`PublishCourse`)
- **Edge handling:**
  - Step guard requires at least one section and one lecture per section.
  - Edit flow detects unchanged form and avoids unnecessary writes.
  - File upload handled for thumbnail/video.

### 5.9 Course learning experience and lecture progress

- **Files:** `pages/ViewCourse.jsx`, `VideoDetails.jsx`, `VideoDetailsSlidebar.jsx`, backend `progressService.js`.
- **Logic:** Enrolled users watch lectures, navigate next/prev, and mark lectures complete (`updateCourseProgress`).
- **Edge handling:**
  - Enrollment required for full details and progress updates.
  - Duplicate lecture completion rejected (409).
  - Legacy payload support (`subSectionId` and `subsectionId`).

### 5.10 Rating and review system

- **Files:** backend `controllers/RatingAndReview.js`, frontend `CourseReviewModal.jsx`, `ReviewSlider.jsx`.
- **Logic:** Students submit rating/review after enrollment; all reviews and averages are retrievable.
- **Edge handling:** user must be enrolled; one review per user per course.

### 5.11 Profile management

- **Files:** `controllers/Profile.js`, settings UI components, `SettingsAPI.js`.
- **Logic:** Edit personal details, upload avatar, change password, delete account.
- **Edge handling:** account delete also removes profile and un-enrolls user from courses.

### 5.12 Instructor dashboard analytics

- **Files:** `controllers/Profile.js (instructorDashboard)`, `components/core/Dashboard/Instructor.jsx`, `InstructorChart.jsx`.
- **Logic:** Aggregates student counts and revenue per course and renders pie chart.
- **Edge handling:** empty-state display when no courses/insufficient chart data.

### 5.13 Contact-us workflow

- **Files:** `ContactUsForm.jsx`, `controllers/ContactUs.js`, `mail/templates/contactFormRes.js`.
- **Logic:** Contact form posts to backend and triggers confirmation email.
- **Edge handling:** form validation via `react-hook-form`.

### 5.14 API response envelope compatibility

- **Files:** `server/src/app.js`, `utils/apiResponse.js`.
- **Logic:** Middleware wraps legacy controller outputs into standardized envelope.
- **Edge handling:** preserves explicit legacy `success:false` even with HTTP 200 payloads.

---

## 6. Database & Data Models

All models are in `server/src/models`.

| Model | Fields | Relationships | Constraints/Special config |
|---|---|---|---|
| `User` | `firstName`, `lastName`, `email`, `password`, `accountType`, `additionalDetails`, `courses[]`, `image`, `token`, `resetPasswordExpires`, `courseProgress[]` | `additionalDetails -> Profile`, `courses -> Course[]`, `courseProgress -> CourseProgress[]` | `email` unique, `accountType` enum |
| `Profile` | `gender`, `dateOfBirth`, `about`, `contactNumber` | referenced by `User.additionalDetails` | no timestamps |
| `OTP` | `email`, `otp`, `createdAt` | none | TTL on `createdAt` (`expires: 5*60`), pre-save email sender hook |
| `Category` | `name`, `description`, `courses[]` | `courses -> Course[]` | `name` required |
| `Course` | `courseName`, `courseDescription`, `title`, `description`, `instructor`, `price`, `thumbnail`, `category`, `courseContent[]`, `sections[]`, `studentsEnrolled[]`, `ratingAndReviews[]`, `status`, `instructions[]`, `whatYouWillLearn`, `tag[]`, `language` | instructor/user/category/section/rating refs | `status` enum Draft/Published, pre-save sync between legacy/normalized fields |
| `Section` | `sectionName`, `subSection[]` | `subSection -> SubSection[]` | `subSection` objectIds required in array entries |
| `SubSection` | `title`, `timeDuration`, `description`, `videoUrl` | referenced by `Section` and `CourseProgress.completedVideos` | no required fields defined at schema level |
| `RatingAndReview` | `user`, `rating`, `review`, `course` | refs to `User` and `Course` | all fields required |
| `CourseProgress` | `courseID`, `userId`, `completedVideos[]` | refs `Course`, `User`, `SubSection[]` | used for lecture completion tracking |

### Indexes and special DB behavior

- `User.email` unique index
- `OTP.createdAt` TTL index for automatic expiry
- No explicit compound indexes/migrations in repo

### Seed/migrations

- No migration scripts
- No seed scripts

---

## 7. API Endpoints / Routes

All routes are mounted under **`/api/v1`** (`server/src/app.js` + `server/src/routes/v1/index.js`).

| Method | Path | Controller function | Auth | Request shape | Response shape/purpose |
|---|---|---|---|---|---|
| POST | `/auth/login` | `login` | Public | `{ email, password }` | token + user |
| POST | `/auth/signup` | `signUp` | Public | `{ firstName,lastName,email,password,confirmPassword,accountType,otp,contactNumber? }` | create user |
| POST | `/auth/sendotp` | `sendOTP` | Public | `{ email }` | OTP dispatch |
| POST | `/auth/resendotp` | `resendOtp` | Public | `{ email }` | OTP redispatch |
| POST | `/auth/changepassword` | `changePassword` | Authenticated | `{ oldPassword,newPassword }` | password update |
| POST | `/auth/reset-password-token` | `resetPasswordToken` | Public | `{ email }` | reset-link email |
| POST | `/auth/reset-password` | `resetPassword` | Public | `{ password,confirmPassword,token }` | reset password |
| DELETE | `/profile/deleteAccount` | `deleteAccount` | Authenticated | none | delete account |
| DELETE | `/profile/deleteProfile` | `deleteAccount` | Authenticated | alias | alias delete |
| PUT | `/profile/updateDisplayPicture` | `updateDisplayPicture` | Authenticated | multipart `displayPicture` | avatar update |
| PUT | `/profile/updateProfile` | `updateProfile` | Authenticated | profile fields | updated profile/user |
| GET | `/profile/getUserDetails` | `getAllUserDetails` | Authenticated | none | full user profile |
| GET | `/profile/getEnrolledCourses` | `getEnrolledCourses` | Authenticated | none | enrolled courses |
| GET | `/profile/instructorDashboard` | `instructorDashboard` | Instructor | none | revenue/student metrics |
| POST | `/course/createCourse` | `createCourse` | Instructor | multipart fields + thumbnail | create course draft |
| GET | `/course/showAllCourses` | `showAllCourses` | Public | none | published course list |
| POST | `/course/getCourseDetails` | `getCourseDetails` | Public | `courseId` (body/query/params) | detailed course payload |
| POST | `/course/addSection` | `createSection` | Instructor | `{ sectionName, courseId }` | updated course sections |
| POST | `/course/updateSection` | `updateSection` | Instructor | `{ sectionName, sectionId, courseId? }` | updated section/course view |
| POST | `/course/deleteSection` | `deleteSection` | Instructor | `{ sectionId, courseId }` | section delete + updated course |
| POST | `/course/editCourse` | `editCourse` | Instructor | multipart updates (`courseId`, fields) | updated course |
| GET | `/course/getInstructorCourses` | `getInstructorCourses` | Instructor | none | instructor courses |
| POST | `/course/getFullCourseDetails` | `getFullCourseDetails` | Authenticated | `{ courseId }` | enrolled-view details + completed videos |
| POST | `/course/updateCourseProgress` | `updateCourseProgress` | Student | `{ courseId, subSectionId }` (or legacy `subsectionId`) | mark lecture complete |
| DELETE | `/course/deleteCourse` | `deleteCourse` | Instructor | `{ courseId }` | delete course |
| POST | `/course/addSubSection` | `createSubSection` | Instructor | multipart `{ sectionId,title,description,video }` | updated section |
| POST | `/course/updateSubSection` | `updateSubSection` | Instructor | multipart `{ sectionId,subSectionId,title?,description?,video? }` | updated section |
| POST | `/course/deleteSubSection` | `deleteSubSection` | Instructor | `{ sectionId,subSectionId }` | updated section |
| POST | `/course/createCategory` | `createCategory` | Admin | `{ name,description }` | create category |
| GET | `/course/showAllCategories` | `showAllCategories` | Public | none | category list for nav/catalog |
| POST | `/course/getCategoryPageDetails` | `categoryPageDetails` | Public | `{ categoryId }` | selected/different/topSelling |
| POST | `/course/createRating` | `createRating` | Student | `{ rating,review,courseId }` | create review |
| GET | `/course/getAverageRating` | `getAverageRating` | Public | `courseId` in body | aggregated average |
| GET | `/course/getReviews` | `getAllRating` | Public | none | review list |
| POST | `/payment/capturePayment` | `capturePayment` | Student | `{ courses: [courseId...] }` | Razorpay order |
| POST | `/payment/verifySignature` | `verifySignature` | Student | Razorpay payload + courses | verify and enroll |
| POST | `/payment/verifyPayment` | `verifySignature` | Student | alias of verifySignature | verify and enroll |
| POST | `/payment/sendPaymentSuccessEmail` | `sendPaymentSuccessEmail` | Student | `{ orderId,paymentId,amount }` | send receipt email |
| POST | `/reach/contact` | `contactUsController` | Public | contact form body | send acknowledgement email |

---

## 8. Authentication & Authorization

### Auth flow

1. User requests OTP (`/auth/sendotp` or `/auth/resendotp`)
2. Backend stores OTP in `OTP` collection; pre-save sends email
3. Signup validates latest OTP and creates `Profile` + `User`
4. Login validates password, signs JWT (`expiresIn: "2h"`), sets cookie, returns token/user
5. Protected API calls use bearer token header or cookie fallback
6. Client logout clears token/user/cart/course state

### Authorization model

- Roles: `Student`, `Instructor`, `Admin`
- Middleware gates:
  - `isStudent`
  - `isInstructor`
  - `isAdmin`
- Frontend route guards:
  - `PrivateRoute` (auth required)
  - `RoleGuard` (role-specific route rendering)

### Protected routes/guards

- Backend: most profile/course mutation/payment routes
- Frontend:
  - Dashboard routes under `<PrivateRoute>`
  - Student and instructor paths additionally wrapped by `<RoleGuard>`

### Token storage/refresh strategy

- Stored in localStorage (`token`) on client after login
- Token added to `Authorization: Bearer <token>`
- No dedicated refresh-token endpoint; token expiry handled by redirecting to login

---

## 9. State Management

Global state is in Redux Toolkit + persistent localStorage for selected slices.

| Slice | File | Key fields |
|---|---|---|
| `auth` | `client/src/store/slices/authSlice.js` | `signupData`, `loading`, `token` |
| `profile` | `client/src/store/slices/profileSlice.js` | `user`, `loading` |
| `cart` | `client/src/store/slices/cartSlice.js` | `cart[]`, `total`, `totalItems` |
| `course` | `client/src/store/slices/courseSlice.js` | `step`, `course`, `editCourse`, `paymentLoading` |
| `viewCourse` | `client/src/store/slices/viewCourseSlice.js` | `courseSectionData`, `courseEntireData`, `completedLectures`, `totalNoOfLectures` |

React Query manages API-fetch lifecycles via hooks:
- `useCourseDetails`, `useCatalog`, `useEnrolledCourses`, `useInstructorCourses`, `useInstructorData`, `useProfile`

---

## 10. Components / UI Breakdown

### Major pages and component hierarchy

- `/` -> `Home.jsx`
  - `Navbar`, hero, category cards, `ReviewSlider`, `Footer`
- `/about` -> `About.jsx`
  - About sections + `LearningGrid`, `ContactFormSection`, `Footer`
- `/contact` -> `Contact.jsx`
  - `ContactDetails`, `ContactForm`, `ReviewSlider`, `Footer`
- `/courses/:courseId` -> `CourseDetails.jsx`
  - `CourseDetailsCard`, `CourseAccordionBar`, `ConfirmationModal`
- `/catalog/:catalogName` -> `Catalog.jsx`
  - `Course_Slider`, `Course_card`, `Footer`
- `/dashboard/*` -> `Dashboard.jsx`
  - `Sidebar` + role-specific children (`MyProfile`, `Settings`, `Cart`, `EnrolledCourses`, `Instructor`, `MyCourses`, `AddCourse`, `EditCourse`)
- `/view-course/:courseId/...` -> `ViewCourse.jsx`
  - `VideoDetailsSlidebar`, `VideoDetails`, `CourseReviewModal`

### Reusable/common UI

- `IconBtn`, `ConfirmationModal`, `Tab`, `ratingStars`, `Navbar`, `Footer`, `ReviewSlider`

### Key props and expected inputs (selected)

- `CourseDetailsCard({ course, setConfirmationModal, handleBuyCourse })`
- `CourseAccordionBar({ course, isActive, handleActive })`
- `CourseReviewModal({ setReviewModal })`
- `RoleGuard({ children, role })`
- `Upload({ name, label, register, setValue, errors, video, viewData, editData })`
- `Course_Card({ course, Height })`
- `CourseSlider({ Courses })`

---

## 11. Environment Variables

Variables appear in `server/.env.example`, `client/.env.example`, and root `.env.example`.  
`server/.env` and `client/.env` currently contain concrete values and should be treated as sensitive.

| Variable | Location(s) | Required | Purpose | Safe example |
|---|---|---|---|---|
| `PORT` | `server/.env*` | Yes | backend port | `4000` |
| `MONGODB_URL` | `server/.env*` | Yes | Mongo connection URI | `mongodb://localhost:27017/studynotion` |
| `JWT_SECRET` | `server/.env*` | Yes | JWT signing key | `change_me_strong_secret` |
| `MAIL_HOST` | `server/.env*` | Yes | SMTP host | `smtp.gmail.com` |
| `MAIL_USER` | `server/.env*` | Yes | SMTP username | `noreply@example.com` |
| `MAIL_PASS` | `server/.env*` | Yes | SMTP/app password | `app_password_here` |
| `FOLDER_NAME` | `server/.env*` | Yes | Cloudinary folder root | `StudyNotion` |
| `CLOUD_NAME` | `server/.env*` | Yes | Cloudinary cloud name | `your_cloud_name` |
| `API_KEY` | `server/.env*` | Yes | Cloudinary API key | `1234567890` |
| `API_SECRET` | `server/.env*` | Yes | Cloudinary API secret | `cloudinary_secret` |
| `RAZORPAY_KEY` | `server/.env*` | Yes | Razorpay public key | `rzp_test_xxxxx` |
| `RAZORPAY_SECRET` | `server/.env*` | Yes | Razorpay secret key | `razorpay_secret` |
| `FRONTEND_URL` | `server/.env.example` | Recommended | password reset URL base | `http://localhost:3000` |
| `CORS_ORIGIN` | root + server `.env*` | Recommended | allowed frontend origin | `http://localhost:3000` |
| `REACT_APP_BASE_URL` | `client/.env*` | Yes | frontend API base URL | `http://localhost:4000/api/v1` |
| `REACT_APP_RAZORPAY_KEY` | `client/.env*` | Yes (for payments) | checkout key on client | `rzp_test_xxxxx` |
| `REACT_APP_RAZORPAY_LOGO_URL` | `client/.env.example` | Optional | checkout branding logo | `https://example.com/logo.png` |
| `CLIENT_PORT` | root `.env.example` + `client/.env` | Optional | local docker/client config | `3000` |
| `SERVER_PORT` | root `.env.example` + `client/.env` | Optional | local docker/server config | `4000` |
| `MONGO_PORT` | root `.env.example` + `client/.env` | Optional | local docker mongo port | `27017` |
| `MONGO_DB` | root `.env.example` + `client/.env` | Optional | mongo db name | `studynotion` |

---

## 12. Third-Party Integrations

| Service | Usage | Integration points |
|---|---|---|
| Razorpay | Payments | `server/src/config/razorpay.js`, `server/src/services/paymentService.js`, `client/src/services/operations/studentFeaturesApi.js` |
| Cloudinary | Media upload (thumbnails/videos/avatars) | `server/src/config/cloudinary.js`, `server/src/utils/imageUploader.js`, course/profile/subsection controllers |
| Nodemailer/SMTP | OTP + transactional emails | `server/src/utils/mailSender.js`, templates in `server/src/mail/templates/*` |
| DiceBear | Fallback avatar generation | user creation and client profile normalization |
| Swiper | Course/review carousels | `ReviewSlider.jsx`, `Course_Slider.jsx` |
| Chart.js | Instructor analytics chart | `InstructorChart.jsx` |

---

## 13. Error Handling

### Global strategy

- Central `errorHandler` middleware (`server/src/middlewares/errorHandler.js`)
- `AppError` custom class for operational errors
- `asyncHandler` wrapper for async controllers
- Response wrapper in `app.js` normalizes payload shape even for legacy controllers

### Notable behavior

- In non-production, error name/stack is attached in API envelope.
- Some legacy controller branches still return ad-hoc payloads and are normalized by wrapper.
- Client uses axios interceptors to redirect on token-auth 401 responses.

---

## 14. Performance Considerations

- **Frontend server-state cache:** React Query hooks use `staleTime` and controlled refetching.
- **DB lean/populate usage:** Several read controllers use `.lean()` to reduce overhead (`Category`, `Course` queries).
- **Potential hotspots:** Sequential loops for enrollment/course deletion over users/sections/subsections (N+1 style updates).
- **Code splitting/lazy loading:** Not currently implemented.
- **Caching layer (Redis etc.):** Not present.

---

## 15. Security Measures

Implemented:
- JWT verification + role middleware (`auth`, `isStudent`, `isInstructor`, `isAdmin`)
- Password hashing with bcrypt
- Input validation via zod for auth-related routes (`login`, `signup`, `sendotp`, `resendotp`)
- CORS origin + credentials config (`server/src/app.js`)
- `httpOnly` cookie on login

Missing/limited:
- No explicit rate-limiter middleware
- No Helmet/security headers middleware
- No CSRF protection layer
- Validation coverage is partial (not all routes)
- Real secrets currently exist in committed `.env` files (must be rotated and removed from VCS)

---

## 16. Testing

### Test types and locations

- **Integration tests:** `tests/integration/*.test.js`
  - `auth.test.js`
  - `catalog.test.js`
  - `course-builder.test.js`
  - `course.test.js`
  - `payment.test.js`
  - `profile.test.js`
  - `progress.test.js`
- **Unit tests:** `tests/unit/*.test.js`
  - `auth.validator.test.js`
  - `category.controller.test.js`
  - `payments.controller.test.js`
  - `progress.service.test.js`

### Test setup

- `tests/setup/setupTests.js` spins up `mongodb-memory-server` and clears DB per test.
- `tests/setup/jest.config.js` configures environment, coverage collection, and thresholds.

### Coverage configuration

- Coverage target files:
  - `server/src/controllers/Category.js`
  - `server/src/controllers/Payments.js`
  - `server/src/services/progressService.js`
  - `server/src/middlewares/validate.js`
  - `server/src/validators/auth.validator.js`
- Global threshold: `lines >= 75`, `statements >= 75`

### How to run

- Root: `npm run test` (delegates to server tests)
- Server: `npm run test`
- Server coverage: `npm run test:coverage`

---

## 17. Scripts & Commands

### Root `package.json`

| Script | Command | Purpose |
|---|---|---|
| `dev` | concurrently run client+server | local full-stack development |
| `build` | client build | production frontend bundle |
| `test` | server test suite | backend tests |
| `docker:dev` | `docker compose -f docker-compose.yml up --build` | local container stack |
| `docker:prod` | `docker compose -f docker-compose.prod.yml up --build -d` | production-like container stack |

### Client `package.json`

| Script | Purpose |
|---|---|
| `start` | run CRA dev server |
| `build` | create production bundle |
| `eject` | CRA eject |
| `lint` | ESLint on `src/**/*.{js,jsx}` |

### Server `package.json`

| Script | Purpose |
|---|---|
| `start` | run server with Node |
| `dev` | run server with nodemon |
| `test` | run Jest with shared test config |
| `test:coverage` | run tests with coverage |

### Utility scripts (`scripts/`)

- `e2e-payment-check.ps1`: positive path end-to-end payment validation
- `e2e-payment-negative-check.ps1`: negative payment contract checks
- `generate-razorpay-signature.js`: helper for Razorpay signature generation
- `get-latest-otp.js`: fetch latest OTP from DB for test accounts
- `md_to_docx.py`: converts markdown paper to DOCX

---

## 18. Deployment & Infrastructure

### Containerization

- `client/Dockerfile`: deps/dev/build/prod stages, prod served via nginx
- `server/Dockerfile`: base/dev/prod stages
- `docker-compose.yml`: dev with Mongo + bind mounts for live code
- `docker-compose.prod.yml`: client+server behind nginx reverse proxy
- `nginx/nginx.conf`: routes `/api/` to server and `/` to client

### CI/CD

- **CI (`.github/workflows/ci.yml`)**
  - Trigger: pull_request -> `main`
  - Runs: server tests with coverage + client lint
- **Deploy (`.github/workflows/deploy.yml`)**
  - Trigger: push -> `main`
  - Builds docker images
  - Push/deploy steps are placeholders (echo instructions for ACR/target env)

### Env differences

- **Dev:** local compose + exposed ports + source bind mounts
- **Prod:** nginx reverse proxy + exposed port 80 + no bundled Mongo service in prod compose

---

## 19. Known Issues & TODOs

### Explicit TODOs in code

1. `server/src/routes/v1/Course.js` - comment: "TODO: Put IsAdmin Middleware here" (route currently already uses `isAdmin`; comment is stale).
2. `server/src/controllers/Section.js` - TODO to improve populate behavior.
3. `client/src/components/core/Dashboard/InstructorCourses/CoursesTable.jsx` - TODO to improve no-course state text.

### Known limitations/risks observed

- Secrets are present in committed env files (`server/.env`, `client/.env`) -> security risk.
- No backend rate-limiting despite README mention.
- No refresh-token flow; only short-lived JWT + forced re-login.
- API response contracts are partially legacy and rely on global response-normalization middleware.
- `RoleGuard` returns `null` on unauthorized UI route (no redirect/feedback).
- Some UI values are hardcoded placeholders (e.g., fixed course duration display in course table).

---

## 20. Developer Notes

### Non-obvious architectural decisions

- **Response normalization layer (`server/src/app.js`)** wraps legacy and modern responses into unified envelope; this is critical for frontend compatibility.
- **Dual course schema fields (`Course.js`)** intentionally maintain old/new contracts (`courseName/title`, `courseContent/sections`) with pre-save sync.
- **Token normalization appears in both client and server** to tolerate stale quoted or repeated `Bearer` token formats.
- **Payment verification is defensive** (`paymentService.js`) and validates signature, order ownership, amount, and capture status before enrollment.

### Critical files (high-risk to change casually)

- `server/src/app.js` (envelope + middleware order)
- `server/src/middlewares/auth.js` (token parsing and role checks)
- `server/src/services/paymentService.js` (payment security and enrollment integrity)
- `server/src/models/Course.js` (legacy/normalized field synchronization)
- `client/src/services/apiconnector.js` and `client/src/services/axiosInstance.js` (auth interceptor behavior)
- `client/src/App.jsx` (route-level access control composition)

### Onboarding tips for new developers

1. Start by reading `README.md`, `client/src/App.jsx`, `server/src/app.js`, and `server/src/routes/v1/*`.
2. Understand API envelope conventions before changing controller responses.
3. Keep frontend expectations for `courseDetails`, `categoryPageDetails`, and `getFullCourseDetails` stable (tests assert contracts).
4. Rotate/remove committed secrets and move to secure secret management before any real production deployment.

