/*
    detail.js

    File này thực hiện các công việc:

    - Lấy id khóa học trên đường dẫn URL.
    - Tìm khóa học tương ứng trong mảng courseData.
    - Hiển thị thông tin chi tiết khóa học.
    - Hiển thị mục tiêu học tập.
    - Hiển thị mô tả.
    - Tạo Bootstrap Accordion cho chương trình học.
    - Problem 03: theo dõi tiến độ học (checkbox + progress bar) và làm bài kiểm tra cuối mỗi phần,
      toàn bộ tiến độ được lưu vào localStorage để giữ lại sau khi tải lại trang.
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
                            <i class="bi bi-check-lg"></i>
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


/*
    Problem 03 - Lesson Player & Quiz Feature

    Toàn bộ hàm bên dưới phục vụ cho:
    - Đánh dấu bài học đã hoàn thành bằng checkbox, lưu vào localStorage.
    - Thanh tiến độ "X / Y bài học đã hoàn thành".
    - Huy hiệu hoàn thành khi một phần học xong toàn bộ bài học.
    - Bài kiểm tra cuối mỗi phần (tối thiểu 3 câu hỏi trắc nghiệm), chấm điểm và lưu kết quả Đạt/Không đạt.
*/

// Ngân hàng câu hỏi cho từng phần học, mỗi khóa học đều dùng chung 3 phần nên dùng chung ngân hàng câu hỏi theo chỉ số phần.
const quizBank = [
    {
        questions: [
            {
                question: "HTML là viết tắt của cụm từ nào?",
                options: [
                    "HyperText Markup Language",
                    "HighText Machine Language",
                    "Hyperlink Text Markup Language",
                    "Không có đáp án nào đúng"
                ],
                correctIndex: 0
            },
            {
                question: "Thẻ HTML nào dùng để tạo một đoạn văn bản?",
                options: ["<para>", "<p>", "<pg>", "<text>"],
                correctIndex: 1
            },
            {
                question: "CSS được dùng chủ yếu để làm gì trong một trang web?",
                options: [
                    "Xử lý logic phía máy chủ",
                    "Định dạng giao diện và bố cục trang",
                    "Lưu trữ dữ liệu người dùng",
                    "Nén dữ liệu hình ảnh"
                ],
                correctIndex: 1
            }
        ]
    },
    {
        questions: [
            {
                question: "Từ khóa nào dùng để khai báo một biến có thể thay đổi giá trị trong JavaScript?",
                options: ["const", "let", "final", "static"],
                correctIndex: 1
            },
            {
                question: "Phương thức nào dùng để chọn một phần tử theo id trong DOM?",
                options: [
                    "document.querySelectorAll",
                    "document.getElementById",
                    "document.createElement",
                    "document.getElementsByClass"
                ],
                correctIndex: 1
            },
            {
                question: "Toán tử nào so sánh bằng cả giá trị lẫn kiểu dữ liệu?",
                options: ["==", "=", "===", "!="],
                correctIndex: 2
            }
        ]
    },
    {
        questions: [
            {
                question: "localStorage dùng để làm gì?",
                options: [
                    "Gửi email tự động",
                    "Lưu dữ liệu ngay trên trình duyệt của người dùng",
                    "Kết nối trực tiếp tới cơ sở dữ liệu máy chủ",
                    "Tăng tốc độ đường truyền mạng"
                ],
                correctIndex: 1
            },
            {
                question: "Sự kiện nào được gọi khi người dùng nhấn vào một phần tử?",
                options: ["onchange", "onclick", "onload", "onsubmit"],
                correctIndex: 1
            },
            {
                question: "Cách nào dùng để lặp qua từng phần tử của một mảng trong JavaScript?",
                options: [
                    "array.forEach()",
                    "array.toString()",
                    "array.parse()",
                    "array.stringify()"
                ],
                correctIndex: 0
            }
        ]
    }
];

// Điểm tối thiểu để coi là Đạt bài kiểm tra (theo đề bài: từ 70% trở lên).
const QUIZ_PASS_PERCENT = 70;

// Thoát các ký tự HTML đặc biệt để chèn text vào innerHTML một cách an toàn,
// tránh trường hợp đáp án dạng thẻ như "<p>" bị trình duyệt hiểu nhầm thành HTML thật.
function escapeHtml(text) {
    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

// Sinh id duy nhất cho một bài học, dựa trên khóa học - phần - vị trí bài học.
function buildLessonId(courseId, sectionIndex, lessonIndex) {
    return `c${courseId}-s${sectionIndex}-l${lessonIndex}`;
}

// Tên key lưu danh sách bài học đã hoàn thành của một khóa học trong localStorage.
function getCompletedLessonsKey(courseId) {
    return `learnhub_completed_lessons_${courseId}`;
}

// Đọc danh sách id bài học đã hoàn thành từ localStorage.
function loadCompletedLessons(courseId) {
    const rawData = localStorage.getItem(getCompletedLessonsKey(courseId));

    if (!rawData) {
        return [];
    }

    try {
        const parsedData = JSON.parse(rawData);
        return Array.isArray(parsedData) ? parsedData : [];
    } catch (error) {
        return [];
    }
}

// Lưu danh sách id bài học đã hoàn thành vào localStorage.
function saveCompletedLessons(courseId, completedIds) {
    localStorage.setItem(
        getCompletedLessonsKey(courseId),
        JSON.stringify(completedIds)
    );
}

// Tên key lưu kết quả bài kiểm tra từng phần của một khóa học trong localStorage.
function getQuizResultsKey(courseId) {
    return `learnhub_quiz_results_${courseId}`;
}

// Đọc kết quả bài kiểm tra (pass/fail theo từng phần) từ localStorage.
function loadQuizResults(courseId) {
    const rawData = localStorage.getItem(getQuizResultsKey(courseId));

    if (!rawData) {
        return {};
    }

    try {
        const parsedData = JSON.parse(rawData);
        return typeof parsedData === "object" && parsedData !== null ? parsedData : {};
    } catch (error) {
        return {};
    }
}

// Lưu kết quả Đạt/Không đạt của một phần vào localStorage.
function saveQuizResult(courseId, sectionIndex, result) {
    const quizResults = loadQuizResults(courseId);
    quizResults[sectionIndex] = result;

    localStorage.setItem(
        getQuizResultsKey(courseId),
        JSON.stringify(quizResults)
    );
}

// Kiểm tra một phần học đã hoàn thành hết bài học hay chưa.
function isSectionComplete(course, sectionIndex, completedIds) {
    const section = course.curriculum[sectionIndex];

    return section.lessons.every(function (lesson, lessonIndex) {
        const lessonId = buildLessonId(course.id, sectionIndex, lessonIndex);
        return completedIds.includes(lessonId);
    });
}

// Vẽ lại thanh tiến độ tổng "X / Y bài học đã hoàn thành" ở đầu phần chương trình học.
function renderCurriculumProgress(course, completedIds) {
    const progressContainer = document.getElementById("curriculumProgress");

    if (!progressContainer) {
        return;
    }

    const totalLessons = course.curriculum.reduce(function (sum, section) {
        return sum + section.lessons.length;
    }, 0);

    const doneCount = completedIds.length;
    const percent = totalLessons === 0 ? 0 : Math.round((doneCount / totalLessons) * 100);

    progressContainer.innerHTML = `
        <div class="curriculum-progress-label">
            ${doneCount} / ${totalLessons} bài học đã hoàn thành
        </div>

        <div class="progress" role="progressbar" aria-label="Tiến độ học tập">
            <div
                class="progress-bar bg-success"
                style="width: ${percent}%"
                aria-valuenow="${percent}"
                aria-valuemin="0"
                aria-valuemax="100"
            ></div>
        </div>
    `;
}

// Bật hoặc tắt huy hiệu hoàn thành trên tiêu đề một phần, tuỳ theo phần đó đã học xong hết chưa.
function updateSectionBadge(course, sectionIndex, completedIds) {
    const headingEl = document.getElementById(`heading-${sectionIndex}`);

    if (!headingEl) {
        return;
    }

    const badgeEl = headingEl.querySelector(".section-complete-badge");

    if (!badgeEl) {
        return;
    }

    if (isSectionComplete(course, sectionIndex, completedIds)) {
        badgeEl.classList.remove("d-none");
    } else {
        badgeEl.classList.add("d-none");
    }
}

// Tạo danh sách bài học của một phần, mỗi bài học có một checkbox đánh dấu hoàn thành.
function createLessonList(section, sectionIndex, courseId, completedIds) {
    return section.lessons
        .map(function (lesson, lessonIndex) {
            const lessonId = buildLessonId(courseId, sectionIndex, lessonIndex);
            const isChecked = completedIds.includes(lessonId);

            return `
                <li class="list-group-item lesson-item">

                    <div class="lesson-item-main">

                        <input
                            class="form-check-input lesson-checkbox"
                            type="checkbox"
                            id="${lessonId}"
                            data-lesson-id="${lessonId}"
                            data-section-index="${sectionIndex}"
                            ${isChecked ? "checked" : ""}
                        >

                        <label class="lesson-item-label" for="${lessonId}">
                            <span class="lesson-number">
                                ${lessonIndex + 1}
                            </span>

                            <span>
                                ${escapeHtml(lesson)}
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

// Tạo phần chữ cái a), b), c)... đứng trước mỗi đáp án trắc nghiệm.
function optionLetter(optionIndex) {
    return String.fromCharCode(97 + optionIndex);
}

// Vẽ form bài kiểm tra (câu hỏi + các đáp án radio + nút nộp bài) cho một phần học.
function renderQuizForm(course, sectionIndex) {
    const sectionQuiz = quizBank[sectionIndex];
    const sectionTitle = course.curriculum[sectionIndex].title;

    const questionsHtml = sectionQuiz.questions
        .map(function (question, questionIndex) {
            const optionsHtml = question.options
                .map(function (option, optionIndex) {
                    const inputId = `quiz-${sectionIndex}-${questionIndex}-${optionIndex}`;

                    return `
                        <div class="quiz-option">
                            <input
                                class="form-check-input"
                                type="radio"
                                name="quiz-${sectionIndex}-q${questionIndex}"
                                id="${inputId}"
                                value="${optionIndex}"
                            >

                            <label class="form-check-label" for="${inputId}">
                                ${optionLetter(optionIndex)}) ${escapeHtml(option)}
                            </label>
                        </div>
                    `;
                })
                .join("");

            return `
                <div class="quiz-question">
                    <p class="quiz-question-text">
                        Câu ${questionIndex + 1}. ${escapeHtml(question.question)}
                    </p>

                    <div class="quiz-options">
                        ${optionsHtml}
                    </div>
                </div>
            `;
        })
        .join("");

    return `
        <h3 class="quiz-title">
            Bài kiểm tra: ${escapeHtml(sectionTitle)}
        </h3>

        ${questionsHtml}

        <button
            type="button"
            class="btn btn-primary quiz-submit-btn"
            data-section-index="${sectionIndex}"
        >
            Nộp bài
        </button>
    `;
}

// Mở hoặc đóng bảng bài kiểm tra khi bấm nút "Làm bài kiểm tra".
function toggleQuizPanel(course, sectionIndex) {
    const panelEl = document.getElementById(`quiz-panel-${sectionIndex}`);

    if (!panelEl) {
        return;
    }

    const isHidden = panelEl.classList.contains("d-none");

    // Nếu bảng chưa có nội dung, vẽ form câu hỏi lần đầu tiên.
    if (isHidden && panelEl.innerHTML.trim() === "") {
        panelEl.innerHTML = renderQuizForm(course, sectionIndex);
    }

    panelEl.classList.toggle("d-none");
}

// Mở accordion của phần học kế tiếp sau khi người học đã Đạt bài kiểm tra.
function openNextSection(sectionIndex) {
    const nextCollapseEl = document.getElementById(`collapse-${sectionIndex + 1}`);

    if (!nextCollapseEl) {
        return;
    }

    const nextCollapse = bootstrap.Collapse.getOrCreateInstance(nextCollapseEl);
    nextCollapse.show();

    nextCollapseEl.scrollIntoView({ behavior: "smooth", block: "start" });
}

// Chấm điểm bài kiểm tra, hiển thị kết quả từng câu (đúng màu xanh, sai màu đỏ) và thông báo Đạt/Không đạt.
function handleQuizSubmit(course, sectionIndex, panelEl) {
    const sectionQuiz = quizBank[sectionIndex];
    let correctCount = 0;

    const resultQuestionsHtml = sectionQuiz.questions
        .map(function (question, questionIndex) {
            const checkedInput = panelEl.querySelector(
                `input[name="quiz-${sectionIndex}-q${questionIndex}"]:checked`
            );
            const selectedIndex = checkedInput ? Number(checkedInput.value) : -1;

            if (selectedIndex === question.correctIndex) {
                correctCount++;
            }

            const optionsHtml = question.options
                .map(function (option, optionIndex) {
                    let optionClass = "quiz-option-result";

                    if (optionIndex === question.correctIndex) {
                        optionClass += " correct";
                    } else if (optionIndex === selectedIndex) {
                        optionClass += " wrong";
                    }

                    return `
                        <div class="${optionClass}">
                            ${optionLetter(optionIndex)}) ${escapeHtml(option)}
                        </div>
                    `;
                })
                .join("");

            return `
                <div class="quiz-question">
                    <p class="quiz-question-text">
                        Câu ${questionIndex + 1}. ${escapeHtml(question.question)}
                    </p>

                    <div class="quiz-options">
                        ${optionsHtml}
                    </div>
                </div>
            `;
        })
        .join("");

    const totalQuestions = sectionQuiz.questions.length;
    const percent = Math.round((correctCount / totalQuestions) * 100);
    const passed = percent >= QUIZ_PASS_PERCENT;
    const hasNextSection = sectionIndex < course.curriculum.length - 1;

    saveQuizResult(course.id, sectionIndex, passed ? "pass" : "fail");

    const bannerHtml = passed
        ? `
            <div class="quiz-result-banner pass">
                <span><i class="bi bi-patch-check-fill"></i> Chúc mừng, bạn đã Đạt bài kiểm tra! (${correctCount} / ${totalQuestions} câu đúng)</span>

                ${hasNextSection
                    ? `<button type="button" class="btn btn-success quiz-continue-btn" data-section-index="${sectionIndex}">Tiếp tục phần sau</button>`
                    : ""}
            </div>
        `
        : `
            <div class="quiz-result-banner fail">
                <span>Bạn chưa Đạt bài kiểm tra (${correctCount} / ${totalQuestions} câu đúng). Cần đúng từ ${QUIZ_PASS_PERCENT}% trở lên.</span>

                <button type="button" class="btn btn-warning quiz-retake-btn" data-section-index="${sectionIndex}">Làm lại bài kiểm tra</button>
            </div>
        `;

    panelEl.innerHTML = `
        <h3 class="quiz-title">
            Kết quả: ${escapeHtml(course.curriculum[sectionIndex].title)}
        </h3>

        ${resultQuestionsHtml}

        ${bannerHtml}
    `;
}

// Gắn toàn bộ sự kiện cho Problem 03: tick bài học, làm bài kiểm tra, nộp bài, làm lại, tiếp tục.
function initLessonAndQuizEvents(course) {
    const curriculumAccordion = document.getElementById("curriculumAccordion");

    if (!curriculumAccordion) {
        return;
    }

    // Tick checkbox bài học: lưu lại tiến độ và cập nhật thanh tiến độ + huy hiệu phần học.
    curriculumAccordion.addEventListener("change", function (event) {
        if (!event.target.classList.contains("lesson-checkbox")) {
            return;
        }

        const checkboxEl = event.target;
        const lessonId = checkboxEl.dataset.lessonId;
        const sectionIndex = Number(checkboxEl.dataset.sectionIndex);

        let completedIds = loadCompletedLessons(course.id);

        if (checkboxEl.checked) {
            if (!completedIds.includes(lessonId)) {
                completedIds.push(lessonId);
            }
        } else {
            completedIds = completedIds.filter(function (id) {
                return id !== lessonId;
            });
        }

        saveCompletedLessons(course.id, completedIds);
        renderCurriculumProgress(course, completedIds);
        updateSectionBadge(course, sectionIndex, completedIds);
    });

    // Xử lý các nút bấm liên quan tới bài kiểm tra bằng cách bắt sự kiện click trên toàn bộ accordion.
    curriculumAccordion.addEventListener("click", function (event) {
        const takeQuizBtn = event.target.closest(".take-quiz-btn");
        if (takeQuizBtn) {
            toggleQuizPanel(course, Number(takeQuizBtn.dataset.sectionIndex));
            return;
        }

        const submitBtn = event.target.closest(".quiz-submit-btn");
        if (submitBtn) {
            const sectionIndex = Number(submitBtn.dataset.sectionIndex);
            const panelEl = document.getElementById(`quiz-panel-${sectionIndex}`);
            handleQuizSubmit(course, sectionIndex, panelEl);
            return;
        }

        const retakeBtn = event.target.closest(".quiz-retake-btn");
        if (retakeBtn) {
            const sectionIndex = Number(retakeBtn.dataset.sectionIndex);
            const panelEl = document.getElementById(`quiz-panel-${sectionIndex}`);
            panelEl.innerHTML = renderQuizForm(course, sectionIndex);
            return;
        }

        const continueBtn = event.target.closest(".quiz-continue-btn");
        if (continueBtn) {
            openNextSection(Number(continueBtn.dataset.sectionIndex));
        }
    });
}


// Hiển thị Bootstrap Accordion cho chương trình khóa học, kèm checkbox tiến độ và nút làm bài kiểm tra.
function renderCurriculum(course) {
    const curriculumAccordion =
        document.getElementById("curriculumAccordion");

    const completedIds = loadCompletedLessons(course.id);
    const quizResults = loadQuizResults(course.id);

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

            // Huy hiệu hoàn thành chỉ hiện khi toàn bộ bài học trong phần đã được tick hoàn thành.
            const badgeHiddenClass =
                isSectionComplete(course, sectionIndex, completedIds)
                    ? ""
                    : " d-none";

            // Nếu người học đã Đạt bài kiểm tra của phần này thì hiện thêm nhãn nhỏ bên cạnh nút.
            const passedTagHtml =
                quizResults[sectionIndex] === "pass"
                    ? `<span class="quiz-passed-tag"><i class="bi bi-check-circle-fill"></i> Đã đạt bài kiểm tra</span>`
                    : "";

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
                            <span class="accordion-title-text">
                                ${escapeHtml(section.title)} — ${section.lessons.length} bài học
                            </span>

                            <span class="section-complete-badge${badgeHiddenClass}">
                                <i class="bi bi-check-circle-fill"></i>
                            </span>
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
                                ${createLessonList(section, sectionIndex, course.id, completedIds)}
                            </ul>

                            <div class="section-quiz-area">

                                <div class="quiz-toggle-row">

                                    <button
                                        type="button"
                                        class="btn btn-outline-primary take-quiz-btn"
                                        data-section-index="${sectionIndex}"
                                    >
                                        <i class="bi bi-pencil-square"></i> Làm bài kiểm tra
                                    </button>

                                    ${passedTagHtml}

                                </div>

                                <div
                                    id="quiz-panel-${sectionIndex}"
                                    class="quiz-panel d-none"
                                ></div>

                            </div>

                        </div>

                    </div>

                </div>
            `;
        })
        .join("");

    renderCurriculumProgress(course, completedIds);
}


// Hiển thị toàn bộ thông tin khóa học lên trang.
function renderCourseDetail(course) {
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
        Dùng innerHTML vì cần chèn icon ngôi sao Bootstrap Icons phía trước.
    */
    document.getElementById("courseRating").innerHTML =
        `<i class="bi bi-star-fill text-warning"></i> ${course.rating} (${course.reviews} đánh giá)`;

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


// Chạy sau khi toàn bộ HTML đã tải xong: hiển thị khóa học rồi bật tính năng Problem 03.
document.addEventListener("DOMContentLoaded", function () {
    const course = getSelectedCourse();

    renderCourseDetail(course);
    initLessonAndQuizEvents(course);
});
