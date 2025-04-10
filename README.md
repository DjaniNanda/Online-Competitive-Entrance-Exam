# 🎓 Online Competitive Entrance Exam Platform

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/Python-3.8+-green.svg)
![Node.js](https://img.shields.io/badge/Node.js-14+-green.svg)
![Django](https://img.shields.io/badge/Django-latest-red.svg)
![React](https://img.shields.io/badge/React-latest-blue.svg)

> A comprehensive web-based platform for conducting secure online competitive entrance examinations with integrated payment processing, user management, and advanced exam administration.

![Platform Login](./images/2.jpg)
*Overview of the Online Exam Platform dashboard*

## ✨ Features

### 🔐 User Roles & Permissions

#### 👨‍🎓 Candidate
- Create account and authenticate securely
- Take scheduled exams with secure proctoring
- Access detailed performance analytics and results
- Download  result transcripts

![Candidate Dashboard](./images/3.jpg)
*Candidate dashboard showing available exams and progress*

#### 👨‍🏫 Administrator (Teacher)
- Design and manage question banks
- Configure exam parameters (duration, scoring)
- Monitor real-time exam statistics
- Generate comprehensive performance reports

![Administrator Interface](./images/6.jpg)
*Administrator interface for exam management*

#### 👨‍💼 System Admin
- Complete system oversight and configuration
- Manage user accounts and permissions
- Track payment history and financial reports
- Configure system-wide settings
- Access audit logs and security features

![Admin Interface](./images/5.jpg)
### 🛠️ Core Functionalities

| Feature | Description |
|---------|-------------|
| **Authentication** | Multi-factor authentication with role-based access control |
| **Payment System** | Seamless Stripe integration with subscription options |
| **Exam Engine** | Support for multiple question types with anti-cheating measures |
| **Analytics** | Detailed insights into candidate performance and exam statistics |
| **Responsive Design** | Optimized for desktop, tablet, and mobile devices |

![Exam Interface](./images/4.jpg)

## 🚀 Getting Started

### Prerequisites
- Python 3.8+
- Node.js 14+
- Stripe account
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/DjaniNanda/Online-Competitive-Entrance-Exam.git
   cd Online-Competitive-Entrance-Exam
   ```

2. **Set up the backend**
   ```bash
   cd backend
   pip install -r requirements.txt
   python manage.py migrate
   python manage.py createsuperuser
   python manage.py runserver
   ```

3. **Set up the frontend**
   ```bash
   cd ../frontend
   npm install
   npm start
   ```
4. **Configure The ExamSession**
    create a new examsession

5. **Configure Stripe**
   - Add your Stripe API keys in `.env` file (use `.env.example` as template)
   - Set up webhook endpoints for payment event handling

## 💾 Database Schema

The application uses SQLite for development (PostgreSQL recommended for production)

## 📞 Contact

For questions, support, or contributions, please contact:
- Email: djaninandapetrus@gmail.com
- GitHub: [Your GitHub Profile](https://github.com/DjaniNanda)