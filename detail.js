/*
    detail.js

    File này thực hiện các công việc:

    - Lấy id khóa học trên đường dẫn URL.
    - Tìm khóa học tương ứng trong mảng courseData.
    - Hiển thị thông tin chi tiết khóa học.
    - Hiển thị mục tiêu học tập.
    - Hiển thị mô tả.
    - Tạo Bootstrap Accordion cho chương trình học.

    Problem 3 (bổ sung):
    - Checkbox đánh dấu hoàn thành từng bài học, lưu vào localStorage.
    - Thanh Progress Bar hiển thị % bài học đã hoàn thành.
    - Hệ thống Quiz 3 câu/chương với điều kiện Pass/Fail.
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


// ============================================================
// PROBLEM 03 — localStorage: lưu tiến độ bài học + kết quả quiz
// ============================================================

// Khóa dùng để lưu toàn bộ tiến độ học tập vào localStorage.
const PROGRESS_STORAGE_KEY = "learnhubProgress";

// Số câu trả lời đúng tối thiểu để Pass (trên tổng 3 câu/chương).
const QUIZ_PASS_SCORE = 2;

// Đọc dữ liệu tiến độ đã lưu, nếu chưa có hoặc lỗi thì trả về object rỗng.
function loadProgressStore() {
    const rawData = localStorage.getItem(PROGRESS_STORAGE_KEY);

    if (!rawData) {
        return {};
    }

    try {
        return JSON.parse(rawData);
    } catch (error) {
        return {};
    }
}

// Biến toàn cục lưu tiến độ của tất cả khóa học, đọc một lần khi tải trang.
let progressStore = loadProgressStore();

// Ghi lại toàn bộ progressStore vào localStorage.
function saveProgressStore() {
    localStorage.setItem(
        PROGRESS_STORAGE_KEY,
        JSON.stringify(progressStore)
    );
}

// Lấy (hoặc khởi tạo) tiến độ của một khóa học theo id.
function getCourseProgress(courseId) {
    if (!progressStore[courseId]) {
        progressStore[courseId] = {
            lessons: {},
            quizzes: {}
        };
    }

    return progressStore[courseId];
}


// ============================================================
// PROBLEM 03 — Checkbox hoàn thành bài học + Progress Bar
// ============================================================

// Đếm tổng số bài học của khóa học.
function countTotalLessons(course) {
    return course.curriculum.reduce(function (total, section) {
        return total + section.lessons.length;
    }, 0);
}

// Đếm số bài học đã được đánh dấu hoàn thành.
function countCompletedLessons(courseProgress) {
    return Object.values(courseProgress.lessons)
        .filter(Boolean).length;
}

// Cập nhật thanh Progress Bar theo số bài học đã hoàn thành.
function renderProgressBar(course) {
    const courseProgress = getCourseProgress(course.id);

    const total = countTotalLessons(course);
    const completed = countCompletedLessons(courseProgress);

    const percent =
        total === 0 ? 0 : Math.round((completed / total) * 100);

    const progressBar =
        document.getElementById("courseProgressBar");

    progressBar.style.width = `${percent}%`;
    progressBar.textContent = `${percent}%`;
    progressBar.setAttribute("aria-valuenow", String(percent));

    document.getElementById("progressText").textContent =
        `${completed}/${total} bài học hoàn thành`;
}

// Xử lý khi người dùng tick/bỏ tick checkbox một bài học.
function handleLessonCheckboxChange(checkbox) {
    const course = getSelectedCourse();
    const lessonKey = checkbox.dataset.lessonKey;

    const courseProgress = getCourseProgress(course.id);
    courseProgress.lessons[lessonKey] = checkbox.checked;
    saveProgressStore();

    // Đổi giao diện dòng bài học (gạch ngang khi đã hoàn thành).
    const lessonItem = checkbox.closest(".lesson-item");
    lessonItem.classList.toggle("lesson-completed", checkbox.checked);

    renderProgressBar(course);
}


// ============================================================
// PROBLEM 03 — Hệ thống Quiz (3 câu / chương)
// ============================================================

// Trộn ngẫu nhiên thứ tự các phần tử trong mảng (không đổi mảng gốc).
function shuffleArray(items) {
    const result = items.slice();

    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }

    return result;
}

// Lấy toàn bộ tên bài học của các phần KHÁC phần đang xét (dùng làm đáp án nhiễu).
function getLessonsOutsideSection(course, sectionIndex) {
    const lessons = [];

    course.curriculum.forEach(function (section, index) {
        if (index !== sectionIndex) {
            lessons.push(...section.lessons);
        }
    });

    return lessons;
}

// Tạo câu hỏi dạng "bài học nào thuộc phần này" cho 1 bài học cụ thể.
function buildLessonQuestion(course, section, sectionIndex, lessonIndex) {
    const correctAnswer = section.lessons[lessonIndex];

    const otherLessons = getLessonsOutsideSection(course, sectionIndex)
        .filter(function (lesson) {
            return lesson !== correctAnswer;
        });

    const distractors = shuffleArray(otherLessons).slice(0, 3);

    // Nếu khóa học không đủ bài học khác để làm đáp án nhiễu, thêm đáp án giả.
    while (distractors.length < 3) {
        distractors.push(
            `Bài học không thuộc "${section.title}" (${distractors.length + 1})`
        );
    }

    const options = shuffleArray([correctAnswer, ...distractors]);

    return {
        question: `Bài học nào sau đây thuộc phần "${section.title}"?`,
        options: options,
        correctIndex: options.indexOf(correctAnswer)
    };
}

// Tạo câu hỏi dạng "phần này có bao nhiêu bài học".
function buildLessonCountQuestion(section) {
    const correctCount = section.lessons.length;

    const wrongCounts = [correctCount - 1, correctCount + 1, correctCount + 2]
        .filter(function (count) {
            return count > 0 && count !== correctCount;
        });

    const options = shuffleArray([correctCount, ...wrongCounts.slice(0, 3)])
        .map(String);

    return {
        question: `Phần "${section.title}" có tất cả bao nhiêu bài học?`,
        options: options,
        correctIndex: options.indexOf(String(correctCount))
    };
}

// Tạo đúng 3 câu hỏi cho một phần (chương) học.
function buildQuizForSection(course, section, sectionIndex) {
    const secondLessonIndex =
        section.lessons.length > 1 ? 1 : 0;

    return [
        buildLessonQuestion(course, section, sectionIndex, 0),
        buildLessonQuestion(course, section, sectionIndex, secondLessonIndex),
        buildLessonCountQuestion(section)
    ];
}

// Tạo ngân hàng câu hỏi cho toàn bộ các phần của khóa học.
function buildQuizBank(course) {
    return course.curriculum.map(function (section, sectionIndex) {
        return buildQuizForSection(course, section, sectionIndex);
    });
}

// Ngân hàng câu hỏi quiz của khóa học đang xem, tạo lại mỗi khi vào trang.
let quizBank = [];

// Lưu phần (chương) đang làm quiz để biết chấm điểm cho phần nào.
let currentQuizSectionIndex = null;

// Hiển thị modal quiz với 3 câu hỏi của phần được chọn.
function openQuizModal(sectionIndex) {
    const course = getSelectedCourse();
    const section = course.curriculum[sectionIndex];
    const questions = quizBank[sectionIndex];

    currentQuizSectionIndex = sectionIndex;

    document.getElementById("quizModalLabel").textContent =
        `Bài kiểm tra - ${section.title}`;

    const quizModalBody = document.getElementById("quizModalBody");

    quizModalBody.innerHTML = questions
        .map(function (question, questionIndex) {
            const optionsHtml = question.options
                .map(function (option, optionIndex) {
                    const inputId = `quiz-q${questionIndex}-opt${optionIndex}`;

                    return `
                        <div class="form-check">

                            <input
                                class="form-check-input"
                                type="radio"
                                name="quiz-question-${questionIndex}"
                                id="${inputId}"
                                value="${optionIndex}"
                            >

                            <label class="form-check-label" for="${inputId}">
                                ${option}
                            </label>

                        </div>
                    `;
                })
                .join("");

            return `
                <div class="quiz-question">

                    <p class="quiz-question-text">
                        Câu ${questionIndex + 1}: ${question.question}
                    </p>

                    <div class="quiz-options">
                        ${optionsHtml}
                    </div>

                </div>
            `;
        })
        .join("");

    // Xóa kết quả và mở lại nút Nộp bài mỗi lần mở quiz mới.
    document.getElementById("quizResultMessage").innerHTML = "";
    document.getElementById("quizSubmitBtn").disabled = false;

    const quizModalElement = document.getElementById("quizModal");
    const quizModal = bootstrap.Modal.getOrCreateInstance(quizModalElement);
    quizModal.show();
}

// Cập nhật badge Pass/Fail hiển thị cạnh nút làm bài của một phần.
function renderQuizBadge(sectionIndex, quizResult) {
    const badge =
        document.getElementById(`quizBadge-${sectionIndex}`);

    if (!badge) {
        return;
    }

    if (quizResult.passed) {
        badge.textContent =
            `Đã đạt (${quizResult.score}/${quizResult.total})`;
        badge.className = "quiz-status-badge quiz-status-pass";
    } else {
        badge.textContent =
            `Chưa đạt (${quizResult.score}/${quizResult.total})`;
        badge.className = "quiz-status-badge quiz-status-fail";
    }
}

// Chấm điểm khi người dùng bấm nút "Nộp bài".
function handleQuizSubmit() {
    const course = getSelectedCourse();
    const sectionIndex = currentQuizSectionIndex;
    const questions = quizBank[sectionIndex];

    let answeredCount = 0;
    let correctCount = 0;

    questions.forEach(function (question, questionIndex) {
        const selectedInput = document.querySelector(
            `input[name="quiz-question-${questionIndex}"]:checked`
        );

        if (selectedInput) {
            answeredCount++;

            if (Number(selectedInput.value) === question.correctIndex) {
                correctCount++;
            }
        }
    });

    const resultMessage =
        document.getElementById("quizResultMessage");

    // Bắt buộc trả lời đủ 3 câu trước khi chấm điểm.
    if (answeredCount < questions.length) {
        resultMessage.innerHTML =
            `<span class="text-danger">Vui lòng trả lời hết ${questions.length} câu hỏi.</span>`;
        return;
    }

    const passed = correctCount >= QUIZ_PASS_SCORE;

    const courseProgress = getCourseProgress(course.id);
    const quizResult = {
        score: correctCount,
        total: questions.length,
        passed: passed
    };

    courseProgress.quizzes[sectionIndex] = quizResult;
    saveProgressStore();

    resultMessage.innerHTML = passed
        ? `<span class="text-success">Đạt! Trả lời đúng ${correctCount}/${questions.length} câu.</span>`
        : `<span class="text-danger">Chưa đạt. Đúng ${correctCount}/${questions.length} câu (cần tối thiểu ${QUIZ_PASS_SCORE} câu để Pass).</span>`;

    // Khóa nút Nộp bài lại, tránh nộp nhiều lần cho cùng một lượt làm bài.
    document.getElementById("quizSubmitBtn").disabled = true;

    renderQuizBadge(sectionIndex, quizResult);
}


// ============================================================
// Chương trình học (Accordion) — có checkbox + nút làm quiz
// ============================================================

// Tạo danh sách bài học của một phần, kèm checkbox hoàn thành.
function createLessonList(section, sectionIndex, courseProgress) {
    return section.lessons
        .map(function (lesson, lessonIndex) {
            const lessonKey = `${sectionIndex}-${lessonIndex}`;
            const isCompleted = Boolean(courseProgress.lessons[lessonKey]);

            const itemClass = isCompleted
                ? "list-group-item lesson-item lesson-completed"
                : "list-group-item lesson-item";

            return `
                <li class="${itemClass}">

                    <div class="lesson-item-main">

                        <input
                            class="form-check-input lesson-checkbox"
                            type="checkbox"
                            id="lesson-${lessonKey}"
                            data-lesson-key="${lessonKey}"
                            ${isCompleted ? "checked" : ""}
                        >

                        <label for="lesson-${lessonKey}">

                            <span class="lesson-number">
                                ${lessonIndex + 1}
                            </span>

                            <span>
                                ${lesson}
                            </span>

                        </label>

                    </div>

                    <span class="badge text-bg-light">
                        Video
                    </span>

                </li>
            `;
        })
        .join("");
}

// Tạo khối nút "Làm bài kiểm tra" + badge Pass/Fail cho một phần.
function createSectionQuizFooter(sectionIndex, courseProgress) {
    const quizResult = courseProgress.quizzes[sectionIndex];

    let badgeClass = "quiz-status-badge";
    let badgeText = "Chưa làm bài kiểm tra";

    if (quizResult) {
        badgeClass = quizResult.passed
            ? "quiz-status-badge quiz-status-pass"
            : "quiz-status-badge quiz-status-fail";

        badgeText = quizResult.passed
            ? `Đã đạt (${quizResult.score}/${quizResult.total})`
            : `Chưa đạt (${quizResult.score}/${quizResult.total})`;
    }

    return `
        <div class="section-quiz-footer">

            <span id="quizBadge-${sectionIndex}" class="${badgeClass}">
                ${badgeText}
            </span>

            <button
                type="button"
                class="btn btn-outline-primary btn-sm quiz-start-btn"
                data-section-index="${sectionIndex}"
            >
                📝 Làm bài kiểm tra (3 câu)
            </button>

        </div>
    `;
}


// Hiển thị Bootstrap Accordion cho chương trình khóa học.
function renderCurriculum(course) {
    const curriculumAccordion =
        document.getElementById("curriculumAccordion");

    const courseProgress = getCourseProgress(course.id);

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
                                ${createLessonList(section, sectionIndex, courseProgress)}
                            </ul>

                            ${createSectionQuizFooter(sectionIndex, courseProgress)}

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

    // Problem 3: tạo ngân hàng câu hỏi quiz và cập nhật thanh tiến độ.
    quizBank = buildQuizBank(course);

    renderProgressBar(course);
}


// Gắn sự kiện tick checkbox bài học (dùng event delegation).
function initLessonProgressEvents() {
    const curriculumAccordion =
        document.getElementById("curriculumAccordion");

    curriculumAccordion.addEventListener("change", function (event) {
        if (!event.target.classList.contains("lesson-checkbox")) {
            return;
        }

        handleLessonCheckboxChange(event.target);
    });
}

// Gắn sự kiện mở quiz và nộp bài quiz.
function initQuizEvents() {
    const curriculumAccordion =
        document.getElementById("curriculumAccordion");

    curriculumAccordion.addEventListener("click", function (event) {
        const quizButton = event.target.closest(".quiz-start-btn");

        if (!quizButton) {
            return;
        }

        const sectionIndex = Number(quizButton.dataset.sectionIndex);
        openQuizModal(sectionIndex);
    });

    document.getElementById("quizSubmitBtn")
        .addEventListener("click", handleQuizSubmit);
}


// Chạy hàm sau khi toàn bộ HTML đã tải xong.
document.addEventListener("DOMContentLoaded", function () {
    renderCourseDetail();
    initLessonProgressEvents();
    initQuizEvents();
});
