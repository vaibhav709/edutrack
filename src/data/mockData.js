export const studentData = {
  name: "Vaibhav Shelke",
  role: "Student",
  semester: 5,
  attendance: 87,
  gpa: 8.4,
  assignmentsCompleted: 24,
  assignmentsTotal: 28,
  predictedGrade: "A",
  attendanceChange: 3,
  gpaChange: 0.2,
};

export const performanceTrend = [
  { month: "Aug", score: 72, avg: 68 },
  { month: "Sep", score: 75, avg: 70 },
  { month: "Oct", score: 78, avg: 72 },
  { month: "Nov", score: 80, avg: 73 },
  { month: "Dec", score: 82, avg: 74 },
  { month: "Jan", score: 85, avg: 75 },
];

export const weeklyStudy = [
  { day: "Mon", hours: 4 },
  { day: "Tue", hours: 5 },
  { day: "Wed", hours: 7 },
  { day: "Thu", hours: 6 },
  { day: "Fri", hours: 4 },
  { day: "Sat", hours: 3 },
  { day: "Sun", hours: 2 },
];

export const deadlines = [
  { title: "ML Assignment 3 – Neural Networks", course: "Machine Learning", date: "Feb 18", status: "Pending" },
  { title: "DBMS Lab Report", course: "Database Management", date: "Feb 22", status: "Pending" },
  { title: "SE Project Phase 2", course: "Software Engineering", date: "Mar 1", status: "Upcoming" },
];

export const notifications = [
  { message: "ML Assignment 3 due in 5 days", time: "2 hours ago", type: "warning" },
  { message: "Grades updated for CS502", time: "1 day ago", type: "info" },
  { message: "Attendance warning: CS504 below 75%", time: "3 days ago", type: "danger" },
];

export const subjects = [
  { name: "Machine Learning", code: "CS501", internal: 42, exam: 78, total: 120, percentage: 100, attendance: 92, credits: 4 },
  { name: "Database Management", code: "CS502", internal: 38, exam: 72, total: 110, percentage: 100, attendance: 85, credits: 4 },
  { name: "Software Engineering", code: "CS503", internal: 45, exam: 82, total: 127, percentage: 100, attendance: 88, credits: 3 },
  { name: "Computer Networks", code: "CS504", internal: 40, exam: 75, total: 115, percentage: 100, attendance: 90, credits: 4 },
  { name: "Cloud Computing", code: "CS505", internal: 44, exam: 80, total: 124, percentage: 100, attendance: 87, credits: 3 },
];

export const radarData = [
  { subject: "CS501", score: 85 },
  { subject: "CS502", score: 78 },
  { subject: "CS503", score: 90 },
  { subject: "CS504", score: 82 },
  { subject: "CS505", score: 88 },
];

export const predictionData = {
  predictedFinalScore: 90,
  confidenceLevel: 85,
  riskLevel: "Low Risk",
  riskDescription: "Your current performance indicates low risk of academic difficulties. Continue your current pace to maintain this status.",
  studentStanding: "+2.1% monthly",
  improvementTips: "-1.5% monthly",
  aiPredictedGrade: "A",
  gradeRange: "A to A+",
  frequency: "80%",
  predictionVsActual: [
    { month: "Aug", predicted: 74, actual: 72 },
    { month: "Sep", predicted: 76, actual: 75 },
    { month: "Oct", predicted: 79, actual: 78 },
    { month: "Nov", predicted: 81, actual: 80 },
    { month: "Dec", predicted: 84, actual: 82 },
    { month: "Jan", predicted: 87, actual: 85 },
    { month: "Feb", predicted: 90, actual: null },
  ],
  contributingFactors: [
    { name: "Attendance", value: 30 },
    { name: "Internal Marks", value: 25 },
    { name: "Assignments", value: 20 },
    { name: "Quiz Performance", value: 25 },
  ],
  subjectPredictions: [
    { subject: "Machine Learning", current: "85%", predicted: "88%", grade: "A", improvement: "+3%" },
    { subject: "Database Management", current: "78%", predicted: "82%", grade: "B+", improvement: "+4%" },
    { subject: "Software Engineering", current: "88%", predicted: "91%", grade: "A+", improvement: "+3%" },
    { subject: "Computer Networks", current: "82%", predicted: "85%", grade: "A", improvement: "+3%" },
    { subject: "Cloud Computing", current: "87%", predicted: "89%", grade: "A", improvement: "+2%" },
  ],
};

export const facultyData = {
  name: "Dr. Syed Ismail",
  role: "Faculty",
  totalStudents: 7,
  atRiskStudents: 4,
  averageAttendance: 78,
  averageGpa: 7.53,
  attendanceChange: 2,
  gpaChange: 0.3,
};

export const classPerformance = [
  { range: "90-100", count: 2 },
  { range: "80-89", count: 14 },
  { range: "70-79", count: 8 },
  { range: "60-69", count: 4 },
  { range: "Below 60", count: 2 },
];

export const riskDistribution = [
  { name: "Low Risk", value: 3, color: "#22c55e" },
  { name: "Medium Risk", value: 2, color: "#f59e0b" },
  { name: "High Risk", value: 2, color: "#ef4444" },
];

export const attendanceTrend = [
  { month: "Aug", attendance: 84 },
  { month: "Sep", attendance: 88 },
  { month: "Oct", attendance: 82 },
  { month: "Nov", attendance: 84 },
  { month: "Dec", attendance: 88 },
  { month: "Jan", attendance: 86 },
];

export const studentsAtRisk = [
  { name: "Michael Brown", id: "S003", semester: 5, gpa: 6.2, attendance: 65, risk: "High Risk" },
  { name: "Sophia Davis", id: "S004", semester: 5, gpa: 7.5, attendance: 78, risk: "Medium Risk" },
];

export const allStudents = [
  { name: "Vaibhav Shelke", email: "vaibhav.shelke@university.edu", id: "S001", department: "Computer Science", semester: 5, gpa: 8.4, attendance: 87, risk: "Low Risk", predictedGrade: "A" },
  { name: "Shashwat Mishra", email: "shashwat.mishra@university.edu", id: "S002", department: "Computer Science", semester: 5, gpa: 9.1, attendance: 92, risk: "Low Risk", predictedGrade: "A+" },
  { name: "Luv Arora", email: "luv.arora@university.edu", id: "S003", department: "Computer Science", semester: 5, gpa: 6.2, attendance: 65, risk: "High Risk", predictedGrade: "C" },
  { name: "Sophia Davis", email: "sophia.davis@university.edu", id: "S004", department: "Computer Science", semester: 5, gpa: 7.5, attendance: 78, risk: "Medium Risk", predictedGrade: "B+" },
  { name: "James Wilson", email: "james.wilson@university.edu", id: "S005", department: "Computer Science", semester: 5, gpa: 6.8, attendance: 70, risk: "Medium Risk", predictedGrade: "B" },
  { name: "Olivia Martinez", email: "olivia.martinez@university.edu", id: "S006", department: "Computer Science", semester: 5, gpa: 8.9, attendance: 95, risk: "Low Risk", predictedGrade: "A" },
  { name: "Noah Anderson", email: "noah.anderson@university.edu", id: "S007", department: "Computer Science", semester: 5, gpa: 5.8, attendance: 62, risk: "High Risk", predictedGrade: "C" },
];

export const reportsData = {
  totalStudents: 7,
  passRate: 89,
  averageGpa: 7.6,
  atRiskCount: 4,
  subjectPerformance: [
    { subject: "CS501", avg: 78, highest: 95, lowest: 55 },
    { subject: "CS502", avg: 74, highest: 92, lowest: 50 },
    { subject: "CS503", avg: 82, highest: 96, lowest: 62 },
    { subject: "CS504", avg: 76, highest: 90, lowest: 58 },
    { subject: "CS505", avg: 80, highest: 94, lowest: 60 },
  ],
  monthlyProgress: [
    { month: "Aug", passRate: 82, avgScore: 72 },
    { month: "Sep", passRate: 85, avgScore: 74 },
    { month: "Oct", passRate: 83, avgScore: 76 },
    { month: "Nov", passRate: 87, avgScore: 78 },
    { month: "Dec", passRate: 88, avgScore: 80 },
    { month: "Jan", passRate: 89, avgScore: 82 },
  ],
  skillAssessment: [
    { skill: "Problem Solving", score: 78 },
    { skill: "Programming", score: 85 },
    { skill: "Theory", score: 72 },
    { skill: "Communication", score: 68 },
    { skill: "Teamwork", score: 80 },
  ],
  gradeDistribution: [
    { grade: "A+", count: 8 },
    { grade: "A", count: 12 },
    { grade: "B+", count: 10 },
    { grade: "B", count: 7 },
    { grade: "C", count: 4 },
  ],
};

// Login Credentials
export const loginCredentials = {
  students: [
    { name: "Vaibhav Shelke", id: "S001", loginId: "vaibhav.shelke", password: "VaibhavPass@123" },
    { name: "Shashwat Mishra", id: "S002", loginId: "shashwat.mishra", password: "ShashwatPass@123" },
    { name: "Luv Arora", id: "S003", loginId: "luv.arora", password: "LuvPass@123" },
  ],
  faculty: [
    { name: "Dr. Syed Ismail", id: "F001", loginId: "dr.syed.ismail", password: "DrSyedPass@123" },
  ],
};
