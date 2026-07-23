/*
    detail.js

    File này thực hiện các công việc:

    - Lấy id khóa học trên đường dẫn URL.
    - Tìm khóa học tương ứng trong mảng courseData.
    - Hiển thị thông tin chi tiết khóa học.
    - Hiển thị mục tiêu học tập.
    - Hiển thị mô tả.
    - Tạo Bootstrap Accordion cho chương trình học.
*/


// Lấy id khóa học từ URL, ví dụ course-detail.html?id=2.
function getCourseIdFromUrl() {
    const urlParameters =
        new URLSearchParams(window.location.search);

    const courseId =
        Number(urlParameters.get("id"));

    /*
        Nếu đường dẫn không có id hoặc id không hợp lệ,
        chương trình mặc định hiển thị khóa học có id bằng 1.
    */
    if (!courseId) {
        return 1;
    }

    return courseId;
}


// Tìm khóa học có id trùng với id trên URL.
function getSelectedCourse() {
    const courseId = getCourseIdFromUrl();

    /*
        find() tìm phần tử đầu tiên thỏa mãn điều kiện.

        Ở đây, chương trình tìm khóa học có id bằng với
        id lấy được từ đường dẫn URL.
    */
    const selectedCourse = window.courseData.find(
        function (course) {
            return course.id === courseId;
        }
    );

    /*
        Nếu không tìm được khóa học phù hợp,
        chương trình sử dụng khóa học đầu tiên trong mảng.
    */
    if (!selectedCourse) {
        return window.courseData[0];
    }

    return selectedCourse;
}


// Hiển thị danh sách những kiến thức người học sẽ nhận được.
function renderLearningGoals(course) {
    const learningGoals =
        document.getElementById("learningGoals");

    learningGoals.innerHTML = course.learn
        .map(function (goal) {
            return `
                <div class="col-md-6">

                    <div class="learning-goal-item">

                        <span class="learning-goal-icon">
                            ✓
                        </span>

                        <span>
                            ${goal}
                        </span>

                    </div>

                </div>
            `;
        })
        .join("");
}


// Hiển thị các đoạn mô tả của khóa học.
function renderCourseDescription(course) {
    const courseDescription =
        document.getElementById("courseDescription");

    courseDescription.innerHTML = course.description
        .map(function (paragraph) {
            return `
                <p>
                    ${paragraph}
                </p>
            `;
        })
        .join("");
}


// Tạo danh sách bài học của một phần.
function createLessonList(section) {
    return section.lessons
        .map(function (lesson, lessonIndex) {
            return `
                <li class="list-group-item lesson-item">

                    <div>

                        <span class="lesson-number">
                            ${lessonIndex + 1}
                        </span>

                        <span>
                            ${lesson}
                        </span>

                    </div>

                    <span class="badge text-bg-light">
                        Video
                    </span>

                </li>
            `;
        })
        .join("");
}


// Hiển thị Bootstrap Accordion cho chương trình khóa học.
function renderCurriculum(course) {
    const curriculumAccordion =
        document.getElementById("curriculumAccordion");

    curriculumAccordion.innerHTML = course.curriculum
        .map(function (section, sectionIndex) {
            /*
                Mỗi phần cần id riêng để Bootstrap biết
                phần nào sẽ được mở hoặc đóng.
            */
            const headingId =
                `heading-${sectionIndex}`;

            const collapseId =
                `collapse-${sectionIndex}`;

            /*
                Phần đầu tiên được mở sẵn.

                Các phần còn lại sẽ đóng khi trang vừa tải.
            */
            const buttonClass =
                sectionIndex === 0
                    ? "accordion-button"
                    : "accordion-button collapsed";

            const collapseClass =
                sectionIndex === 0
                    ? "accordion-collapse collapse show"
                    : "accordion-collapse collapse";

            const expandedValue =
                sectionIndex === 0
                    ? "true"
                    : "false";

            return `
                <div class="accordion-item">

                    <h2
                        class="accordion-header"
                        id="${headingId}"
                    >

                        <button
                            class="${buttonClass}"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#${collapseId}"
                            aria-expanded="${expandedValue}"
                            aria-controls="${collapseId}"
                        >
                            ${section.title}
                            — ${section.lessons.length} bài học
                        </button>

                    </h2>

                    <div
                        id="${collapseId}"
                        class="${collapseClass}"
                        aria-labelledby="${headingId}"
                        data-bs-parent="#curriculumAccordion"
                    >

                        <div class="accordion-body p-0">

                            <ul class="list-group list-group-flush">
                                ${createLessonList(section)}
                            </ul>

                        </div>

                    </div>

                </div>
            `;
        })
        .join("");
}


// Hiển thị toàn bộ thông tin khóa học lên trang.
function renderCourseDetail() {
    const course = getSelectedCourse();

    /*
        Thay đổi tiêu đề trên tab trình duyệt.
    */
    document.title =
        `${course.title} - LearnHub`;

    /*
        Hiển thị tên khóa học tại các vị trí khác nhau.
    */
    document.getElementById("courseTitle").textContent =
        course.title;

    document.getElementById("detailThumbnailTitle").textContent =
        course.title;

    document.getElementById("breadcrumbCourseTitle").textContent =
        course.title;

    /*
        Hiển thị danh mục khóa học.
    */
    document.getElementById("detailCategory").textContent =
        course.category;

    document.getElementById("courseCategoryBadge").textContent =
        course.category;

    /*
        Hiển thị điểm đánh giá và số lượt đánh giá.
    */
    document.getElementById("courseRating").textContent =
        `⭐ ${course.rating} (${course.reviews} đánh giá)`;

    /*
        Hiển thị số lượng học viên.

        toLocaleString("vi-VN") giúp định dạng số theo kiểu Việt Nam.
        Ví dụ: 1200 sẽ hiển thị thành 1.200.
    */
    document.getElementById("courseStudents").textContent =
        `${course.students.toLocaleString("vi-VN")} học viên`;

    /*
        Hiển thị số lượng bài học.
    */
    document.getElementById("courseLessons").textContent =
        `${course.lessons} bài học`;

    document.getElementById("curriculumLessonCount").textContent =
        `${course.lessons} bài học`;

    document.getElementById("includeLessonCount").textContent =
        `${course.lessons} bài học video`;

    /*
        Hiển thị tên giảng viên.
    */
    document.getElementById("courseInstructor").textContent =
        course.instructor;

    /*
        Hiển thị giá khóa học.
    */
    document.getElementById("coursePrice").textContent =
        window.formatCoursePrice(course.price);

    /*
        Thay đổi màu ảnh đại diện theo danh mục khóa học.
    */
    document.getElementById("detailThumbnail").className =
        `detail-thumbnail ${course.thumbnailClass}`;

    document.getElementById("sidebarThumbnail").className =
        `sidebar-thumbnail ${course.thumbnailClass}`;

    /*
        Gọi các hàm hiển thị phần nội dung còn lại.
    */
    renderLearningGoals(course);

    renderCourseDescription(course);

    renderCurriculum(course);
}


// Chạy hàm sau khi toàn bộ HTML đã tải xong.
document.addEventListener(
    "DOMContentLoaded",
    renderCourseDetail
);