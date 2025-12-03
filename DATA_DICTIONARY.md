# Data Dictionary

This document describes the data fields in all CSV files located in `/public/data/`.

---

## 1. qguide_departments.csv

Aggregated statistics for courses grouped by department.

| Field Name | Type | Description |
|------------|------|-------------|
| `department` | String | Department code (e.g., PHIL, ARMENST, MODGRK) |
| `num_courses` | Integer | Total number of courses offered by the department |
| `avg_rating` | Float | Average overall course rating for the department (scale: 1-5) |
| `avg_hours` | Float | Average hours per week students spend on department courses |
| `avg_enrollment` | Float | Average number of students enrolled per course |
| `total_enrollment` | Integer | Total number of students enrolled across all department courses |
| `min_rating` | Float | Lowest course rating in the department (scale: 1-5) |
| `max_rating` | Float | Highest course rating in the department (scale: 1-5) |

---

## 2. qguide_individual_sections.csv

Detailed Q Guide data for individual course sections, including ratings, instructor information, and enrollment.

| Field Name | Type | Description |
|------------|------|-------------|
| `fas_id` | String | Unique FAS (Faculty of Arts and Sciences) course identifier |
| `course_code` | String | Course code with number (e.g., "PHIL 16") |
| `course_title` | String | Full title of the course including section number |
| `department` | String | Department code |
| `professor` | String | Name of the instructor/professor |
| `semester` | String | Semester and year combined (e.g., "2024Spring") |
| `year` | Integer | Academic year |
| `term` | String | Academic term (e.g., Spring, Fall) |
| `rating` | Float | Overall course rating (scale: 1-5) |
| `rating_fas_mean` | Float | FAS-wide mean rating for comparison (scale: 1-5) |
| `materials_rating` | Float | Rating for course materials quality (scale: 1-5) |
| `assignments_rating` | Float | Rating for assignments quality (scale: 1-5) |
| `feedback_rating` | Float | Rating for quality and timeliness of feedback (scale: 1-5) |
| `section_rating` | Float | Rating for section quality (scale: 1-5) |
| `instructor_rating` | Float | Overall instructor rating (scale: 1-5) |
| `lectures_effective` | Float | Rating for effectiveness of lectures (scale: 1-5) |
| `instructor_accessible` | Float | Rating for instructor accessibility (scale: 1-5) |
| `generates_enthusiasm` | Float | Rating for instructor's ability to generate enthusiasm (scale: 1-5) |
| `facilitates_discussion` | Float | Rating for instructor's facilitation of discussion (scale: 1-5) |
| `recommendation_rating` | Float | Overall recommendation rating (scale: 1-5) |
| `hours_per_week` | Float | Average hours per week students spend on the course |
| `num_students` | Integer | Number of students enrolled in the section |

---

## 3. qguide_latest_semester.csv

Most recent semester data for each course, including categorical classifications.

| Field Name | Type | Description |
|------------|------|-------------|
| `fas_id` | String | Unique FAS course identifier |
| `course_code` | String | Course code with number |
| `course_title` | String | Full title of the course including section number |
| `department` | String | Department code |
| `rating` | Float | Overall course rating (scale: 1-5) |
| `rating_fas_mean` | Float | FAS-wide mean rating for comparison (scale: 1-5) |
| `materials_rating` | Float | Rating for course materials quality (scale: 1-5) |
| `assignments_rating` | Float | Rating for assignments quality (scale: 1-5) |
| `feedback_rating` | Float | Rating for quality and timeliness of feedback (scale: 1-5) |
| `section_rating` | Float | Rating for section quality (scale: 1-5) |
| `instructor_rating` | Float | Overall instructor rating (scale: 1-5) |
| `lectures_effective` | Float | Rating for effectiveness of lectures (scale: 1-5) |
| `instructor_accessible` | Float | Rating for instructor accessibility (scale: 1-5) |
| `generates_enthusiasm` | Float | Rating for instructor's ability to generate enthusiasm (scale: 1-5) |
| `facilitates_discussion` | Float | Rating for instructor's facilitation of discussion (scale: 1-5) |
| `recommendation_rating` | Float | Overall recommendation rating (scale: 1-5) |
| `hours_per_week` | Float | Average hours per week students spend on the course |
| `num_students` | Integer | Number of students enrolled |
| `semester` | String | Most recent semester offered (e.g., "2024Spring") |
| `num_semesters_offered` | Integer | Total number of semesters the course has been offered |
| `rating_category` | String | Categorical rating classification (e.g., "Good", "Excellent") |
| `workload_category` | String | Categorical workload classification (e.g., "Light", "Moderate", "Heavy") |
| `size_category` | String | Categorical class size classification (e.g., "Small", "Medium", "Large") |

---

## 4. qguide_timeseries.csv

Time series data showing how courses have been rated across multiple semesters.

| Field Name | Type | Description |
|------------|------|-------------|
| `fas_id` | String | Unique FAS course identifier |
| `course_code` | String | Course code with number |
| `department` | String | Department code |
| `semester` | String | Semester and year (e.g., "2024Spring") |
| `year` | Integer | Academic year |
| `term` | String | Academic term (e.g., Spring, Fall) |
| `rating` | Float | Overall course rating for that semester (scale: 1-5) |
| `rating_fas_mean` | Float | FAS-wide mean rating for that semester (scale: 1-5) |
| `materials_rating` | Float | Rating for course materials quality (scale: 1-5) |
| `assignments_rating` | Float | Rating for assignments quality (scale: 1-5) |
| `feedback_rating` | Float | Rating for quality and timeliness of feedback (scale: 1-5) |
| `section_rating` | Float | Rating for section quality (scale: 1-5) |
| `instructor_rating` | Float | Overall instructor rating (scale: 1-5) |
| `lectures_effective` | Float | Rating for effectiveness of lectures (scale: 1-5) |
| `instructor_accessible` | Float | Rating for instructor accessibility (scale: 1-5) |
| `generates_enthusiasm` | Float | Rating for instructor's ability to generate enthusiasm (scale: 1-5) |
| `facilitates_discussion` | Float | Rating for instructor's facilitation of discussion (scale: 1-5) |
| `recommendation_rating` | Float | Overall recommendation rating (scale: 1-5) |
| `hours_per_week` | Float | Average hours per week students spend on the course |
| `num_students` | Integer | Number of students enrolled that semester |
| `num_sections` | Integer | Number of sections offered that semester |

---

## Rating Scale

All rating fields use a **1-5 scale** where:
- **5.0** = Excellent
- **4.0** = Good
- **3.0** = Average
- **2.0** = Below Average
- **1.0** = Poor

## Notes

- **Q Guide**: Harvard's course evaluation system (Quality Guide)
- **FAS**: Faculty of Arts and Sciences
- All rating comparisons use the FAS-wide mean (`rating_fas_mean`) as a benchmark
- Course identifiers (`fas_id`) are consistent across all datasets and can be used for joining data

