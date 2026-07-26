/*
    admin.js

    File này chứa logic của trang admin.html (Problem 04 - Admin Panel).

    Phần được triển khai trong file này:
    - Khởi tạo / đọc dữ liệu khóa học từ localStorage (seed từ app.js nếu trống).
    - READ: hiển thị danh sách khóa học lên bảng.
    - SEARCH + FILTER: tìm kiếm theo tiêu đề, lọc theo danh mục và trạng thái.
    - PAGINATION: phân trang 5 khóa học / trang.

    Các chức năng CREATE / UPDATE / DELETE (mở modal, lưu, xóa...) sẽ được
    bổ sung ở phần tiếp theo của Problem 04. Trong file này, các nút
    Thêm / Sửa / Xóa chỉ được gắn sự kiện tạm thời (placeholder).
*/


// Khóa (key) dùng để lưu danh sách khóa học của admin trong localStorage.
const ADMIN_STORAGE_KEY = "learnhubAdminCourses";

// Số lượng khóa học hiển thị trên mỗi trang.
const COURSES_PER_PAGE = 5;


/*
    Biến lưu trạng thái hiện tại của trang admin.

    adminCourses: toàn bộ danh sách khóa học (nguồn dữ liệu chính).
    currentPage: trang hiện tại đang hiển thị.
    activeFilters: các điều kiện tìm kiếm / lọc đang được áp dụng.
    courseToDeleteId: ID của khóa học đang chờ được xác nhận xóa.
*/
let adminCourses = [];

let currentPage = 1;

let activeFilters = {
    keyword: "",
    category: "all",
    status: "all"
};

let courseToDeleteId = null;


// Đọc danh sách khóa học admin đã lưu trong localStorage.
function readCoursesFromStorage() {
    const storedValue = localStorage.getItem(ADMIN_STORAGE_KEY);

    /*
        Nếu chưa từng lưu dữ liệu (lần đầu mở trang), trả về null
        để hàm gọi nó biết cần seed dữ liệu mặc định.
    */
    if (!storedValue) {
        return null;
    }

    try {
        return JSON.parse(storedValue);
    } catch (error) {
        /*
            Nếu dữ liệu trong localStorage bị lỗi định dạng,
            coi như chưa có dữ liệu để tránh làm crash trang.
        */
        console.error("Không thể đọc dữ liệu admin từ localStorage:", error);

        return null;
    }
}


// Lưu danh sách khóa học admin hiện tại xuống localStorage.
function writeCoursesToStorage(courses) {
    localStorage.setItem(
        ADMIN_STORAGE_KEY,
        JSON.stringify(courses)
    );
}


/*
    Tạo dữ liệu khóa học mặc định cho admin dựa trên mảng "courses"
    đã có sẵn trong app.js (window.courseData).

    Mỗi khóa học admin chỉ giữ lại các trường cần thiết cho việc
    quản lý (không cần description, learn, curriculum...) và bổ
    sung thêm trường "status" (mặc định là "published").
*/
function buildSeedCourses() {
    return window.courseData.map(function (course) {
        return {
            id: course.id,
            title: course.title,
            category: course.category,
            instructor: course.instructor,
            lessons: course.lessons,
            price: course.price,
            rating: course.rating,
            status: "published"
        };
    });
}


/*
    Khởi tạo dữ liệu khóa học cho trang admin.

    Nếu localStorage đã có dữ liệu, sử dụng dữ liệu đó.
    Nếu chưa có (lần đầu mở trang), seed 6 khóa học mặc định
    từ app.js rồi lưu ngay xuống localStorage.
*/
function initAdminCourses() {
    const storedCourses = readCoursesFromStorage();

    if (storedCourses) {
        adminCourses = storedCourses;

        return;
    }

    adminCourses = buildSeedCourses();

    writeCoursesToStorage(adminCourses);
}


// Trả về nhãn tiếng Việt và lớp CSS tương ứng với trạng thái khóa học.
function getStatusBadge(status) {
    if (status === "draft") {
        return {
            label: "Bản nháp",
            className: "status-badge status-badge-draft"
        };
    }

    return {
        label: "Đã xuất bản",
        className: "status-badge status-badge-published"
    };
}


/*
    Lọc danh sách khóa học theo từ khóa tìm kiếm, danh mục và trạng thái
    đang được chọn (activeFilters).

    Cả ba điều kiện được áp dụng đồng thời (mục 7 của đề bài).
*/
function getFilteredCourses() {
    const keyword = activeFilters.keyword.trim().toLowerCase();

    return adminCourses.filter(function (course) {
        const matchesKeyword =
            keyword === "" ||
            course.title.toLowerCase().includes(keyword);

        const matchesCategory =
            activeFilters.category === "all" ||
            course.category === activeFilters.category;

        const matchesStatus =
            activeFilters.status === "all" ||
            course.status === activeFilters.status;

        return matchesKeyword && matchesCategory && matchesStatus;
    });
}


// Tính tổng số trang dựa trên số khóa học sau khi đã lọc.
function getTotalPages(totalFilteredCourses) {
    return Math.max(
        1,
        Math.ceil(totalFilteredCourses / COURSES_PER_PAGE)
    );
}


// Cắt danh sách khóa học đã lọc để chỉ lấy phần thuộc trang hiện tại.
function getCoursesForCurrentPage(filteredCourses) {
    const startIndex = (currentPage - 1) * COURSES_PER_PAGE;

    const endIndex = startIndex + COURSES_PER_PAGE;

    return filteredCourses.slice(startIndex, endIndex);
}


// Tạo mã HTML cho một dòng khóa học trong bảng.
function createCourseRow(course, rowNumber) {
    const statusBadge = getStatusBadge(course.status);

    return `
        <tr>
            <td>${rowNumber}</td>

            <td class="admin-course-title">
                ${course.title}
            </td>

            <td>${course.category}</td>

            <td>${course.instructor}</td>

            <td>${window.formatCoursePrice(course.price)}</td>

            <td>
                <span class="${statusBadge.className}">
                    ${statusBadge.label}
                </span>
            </td>

            <td class="text-end">

                <button
                    class="btn btn-sm btn-outline-primary btn-edit-course"
                    type="button"
                    data-course-id="${course.id}"
                    title="Sửa khóa học"
                >
                    <i class="bi bi-pencil"></i>
                </button>

                <button
                    class="btn btn-sm btn-outline-danger btn-delete-course"
                    type="button"
                    data-course-id="${course.id}"
                    title="Xóa khóa học"
                >
                    <i class="bi bi-trash"></i>
                </button>

            </td>
        </tr>
    `;
}


// Tạo mã HTML cho dòng thông báo khi không có khóa học nào phù hợp.
function createEmptyResultRow() {
    return `
        <tr>
            <td colspan="7" class="admin-empty-row">
                Không tìm thấy khóa học phù hợp với điều kiện tìm kiếm / lọc.
            </td>
        </tr>
    `;
}


// Cập nhật dòng chữ tóm tắt số lượng kết quả phía trên phân trang.
function renderResultsSummary(totalFilteredCourses) {
    const resultsSummary = document.getElementById("resultsSummary");

    if (totalFilteredCourses === 0) {
        resultsSummary.textContent = "Không có khóa học nào phù hợp.";

        return;
    }

    const startIndex = (currentPage - 1) * COURSES_PER_PAGE + 1;

    const endIndex = Math.min(
        currentPage * COURSES_PER_PAGE,
        totalFilteredCourses
    );

    resultsSummary.textContent =
        `Hiển thị ${startIndex} - ${endIndex} trong tổng số ${totalFilteredCourses} khóa học`;
}


// Hiển thị các nút phân trang (Prev, số trang, Next) dựa trên tổng số trang.
function renderPagination(totalPages) {
    const paginationList = document.getElementById("paginationList");

    const items = [];

    /*
        Nút "Prev": bị disable nếu đang ở trang đầu tiên.
    */
    items.push(`
        <li class="page-item ${currentPage === 1 ? "disabled" : ""}">
            <button
                class="page-link"
                type="button"
                data-page="${currentPage - 1}"
            >
                &laquo; Trước
            </button>
        </li>
    `);

    /*
        Các nút số trang: mỗi trang là một nút riêng.

        Với danh sách nhỏ (như trong bài thi), hiển thị đầy đủ số trang
        là đủ rõ ràng và dễ triển khai.
    */
    for (let pageNumber = 1; pageNumber <= totalPages; pageNumber++) {
        items.push(`
            <li class="page-item ${pageNumber === currentPage ? "active" : ""}">
                <button
                    class="page-link"
                    type="button"
                    data-page="${pageNumber}"
                >
                    ${pageNumber}
                </button>
            </li>
        `);
    }

    /*
        Nút "Next": bị disable nếu đang ở trang cuối cùng.
    */
    items.push(`
        <li class="page-item ${currentPage === totalPages ? "disabled" : ""}">
            <button
                class="page-link"
                type="button"
                data-page="${currentPage + 1}"
            >
                Sau &raquo;
            </button>
        </li>
    `);

    paginationList.innerHTML = items.join("");
}


/*
    Hàm hiển thị chính: lọc dữ liệu, tính toán phân trang, vẽ lại bảng
    và thanh phân trang.

    Đây là hàm được gọi lại mỗi khi từ khóa tìm kiếm, bộ lọc hoặc
    trang hiện tại thay đổi.
*/
function renderCoursesTable() {
    const filteredCourses = getFilteredCourses();

    const totalPages = getTotalPages(filteredCourses.length);

    /*
        Nếu trang hiện tại vượt quá tổng số trang (ví dụ sau khi lọc
        làm giảm số kết quả), tự động đưa về trang cuối cùng hợp lệ.
    */
    if (currentPage > totalPages) {
        currentPage = totalPages;
    }

    const coursesOnCurrentPage = getCoursesForCurrentPage(filteredCourses);

    const tableBody = document.getElementById("coursesTableBody");

    if (coursesOnCurrentPage.length === 0) {
        tableBody.innerHTML = createEmptyResultRow();
    } else {
        const startIndex = (currentPage - 1) * COURSES_PER_PAGE;

        tableBody.innerHTML = coursesOnCurrentPage
            .map(function (course, indexOnPage) {
                return createCourseRow(course, startIndex + indexOnPage + 1);
            })
            .join("");
    }

    renderResultsSummary(filteredCourses.length);

    renderPagination(totalPages);
}


function resetCourseForm() {
    const courseForm = document.getElementById("courseForm");
    courseForm.reset();
    document.getElementById("courseFormId").value = "";
    document.getElementById("courseFormCategory").value = "Web Dev";
    document.getElementById("courseFormStatus").value = "published";
    courseForm.classList.remove("was-validated");
}


function showToast(message, type) {
    const toastContainer = document.getElementById("toastContainer");
    const toastClass = type === "danger" ? "text-bg-danger" : "text-bg-success";

    const toastElement = document.createElement("div");
    toastElement.className = `toast align-items-center ${toastClass} border-0`;
    toastElement.setAttribute("role", "status");
    toastElement.setAttribute("aria-live", "polite");
    toastElement.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">${message}</div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    `;

    toastContainer.appendChild(toastElement);

    const toastInstance = new bootstrap.Toast(toastElement, { delay: 2200 });
    toastInstance.show();

    toastElement.addEventListener("hidden.bs.toast", function () {
        toastElement.remove();
    });
}


function openAddCourseModal() {
    const modalTitle = document.getElementById("courseFormModalLabel");
    modalTitle.textContent = "Thêm khóa học mới";
    resetCourseForm();
    courseFormModal.show();
}


function openEditCourseModal(course) {
    const modalTitle = document.getElementById("courseFormModalLabel");
    modalTitle.textContent = "Chỉnh sửa khóa học";

    document.getElementById("courseFormId").value = course.id;
    document.getElementById("courseFormTitle").value = course.title;
    document.getElementById("courseFormCategory").value = course.category;
    document.getElementById("courseFormInstructor").value = course.instructor;
    document.getElementById("courseFormLessons").value = course.lessons;
    document.getElementById("courseFormPrice").value = course.price;
    document.getElementById("courseFormRating").value = course.rating;
    document.getElementById("courseFormStatus").value = course.status;

    const courseForm = document.getElementById("courseForm");
    courseForm.classList.remove("was-validated");
    courseFormModal.show();
}


function openDeleteConfirmModal(course) {
    courseToDeleteId = course.id;
    document.getElementById("deleteConfirmCourseTitle").textContent = course.title;

    const courseFormModalElement = document.getElementById("courseFormModal");
    if (courseFormModalElement.classList.contains("show")) {
        courseFormModal.hide();
    }

    deleteConfirmModal.show();
}


function handleCourseFormSave() {
    const courseForm = document.getElementById("courseForm");

    if (!courseForm.checkValidity()) {
        courseForm.classList.add("was-validated");
        return;
    }

    const courseId = Number(document.getElementById("courseFormId").value || 0);
    const nextCourseId = Math.max(0, ...adminCourses.map(function (course) {
        return course.id;
    })) + 1;

    const courseData = {
        title: document.getElementById("courseFormTitle").value.trim(),
        category: document.getElementById("courseFormCategory").value,
        instructor: document.getElementById("courseFormInstructor").value.trim(),
        lessons: Number(document.getElementById("courseFormLessons").value),
        price: Number(document.getElementById("courseFormPrice").value),
        rating: Number(document.getElementById("courseFormRating").value),
        status: document.getElementById("courseFormStatus").value
    };

    if (courseId) {
        const courseIndex = adminCourses.findIndex(function (course) {
            return course.id === courseId;
        });

        if (courseIndex !== -1) {
            adminCourses[courseIndex] = {
                ...adminCourses[courseIndex],
                ...courseData,
                id: courseId
            };
        }
    } else {
        adminCourses.unshift({
            id: nextCourseId,
            ...courseData
        });
    }

    writeCoursesToStorage(adminCourses);
    renderCoursesTable();
    courseFormModal.hide();
    resetCourseForm();
    showToast(courseId ? "Course updated." : "Course created.", "success");
}


function handleDeleteConfirm() {
    if (!courseToDeleteId) {
        return;
    }

    adminCourses = adminCourses.filter(function (course) {
        return course.id !== courseToDeleteId;
    });

    writeCoursesToStorage(adminCourses);
    renderCoursesTable();
    deleteConfirmModal.hide();
    courseToDeleteId = null;
    showToast("Course deleted.", "success");
}


// Xử lý sự kiện gõ nội dung vào ô tìm kiếm (tìm kiếm trực tiếp - live search).
function handleSearchInput(event) {
    activeFilters.keyword = event.target.value;

    /*
        Mỗi khi điều kiện tìm kiếm / lọc thay đổi,
        luôn quay về trang 1 (yêu cầu mục 8 của đề bài).
    */
    currentPage = 1;

    renderCoursesTable();
}


// Xử lý sự kiện thay đổi bộ lọc danh mục.
function handleCategoryFilterChange(event) {
    activeFilters.category = event.target.value;

    currentPage = 1;

    renderCoursesTable();
}


// Xử lý sự kiện thay đổi bộ lọc trạng thái.
function handleStatusFilterChange(event) {
    activeFilters.status = event.target.value;

    currentPage = 1;

    renderCoursesTable();
}


/*
    Xử lý sự kiện bấm vào các nút phân trang.

    Dùng event delegation (gắn sự kiện lên phần tử cha #paginationList)
    vì các nút bên trong được tạo lại (innerHTML) mỗi lần render.
*/
function handlePaginationClick(event) {
    const clickedButton = event.target.closest(".page-link");

    if (!clickedButton) {
        return;
    }

    const targetPage = Number(clickedButton.dataset.page);

    /*
        Bỏ qua nếu số trang không hợp lệ (ví dụ nút Prev ở trang 1
        sẽ có data-page="0").
    */
    if (!targetPage || targetPage === currentPage) {
        return;
    }

    currentPage = targetPage;

    renderCoursesTable();
}


/* ==========================================================
                    PHẦN CRUD BỔ SUNG
   ========================================================== */

// Lấy Modal Bootstrap (sử dụng Singleton Pattern được Bootstrap cung cấp)
function getCourseFormModal() {
    return bootstrap.Modal.getOrCreateInstance(document.getElementById("courseFormModal"));
}

function getDeleteConfirmModal() {
    return bootstrap.Modal.getOrCreateInstance(document.getElementById("deleteConfirmModal"));
}

// Hiển thị Toast thông báo
function showToast(message) {
    const toastContainer = document.getElementById("toastContainer");
    const toastHtml = `
        <div class="toast align-items-center text-white bg-success border-0 mb-2" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="d-flex">
                <div class="toast-body">
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Đóng"></button>
            </div>
        </div>
    `;
    
    toastContainer.insertAdjacentHTML("beforeend", toastHtml);
    const toastElement = toastContainer.lastElementChild;
    const toastInstance = new bootstrap.Toast(toastElement, { delay: 3000 });
    
    toastInstance.show();

    // Dọn dẹp DOM sau khi toast biến mất
    toastElement.addEventListener('hidden.bs.toast', function () {
        toastElement.remove();
    });
}


/*
    Xử lý sự kiện bấm nút Sửa hoặc Xóa trên một dòng khóa học.
*/
function handleTableActionClick(event) {
    const editButton = event.target.closest(".btn-edit-course");
    const deleteButton = event.target.closest(".btn-delete-course");

    // Xử lý nút Sửa (UPDATE)
    if (editButton) {
        const courseId = Number(editButton.dataset.courseId);
        const course = adminCourses.find(c => c.id === courseId);

        if (course) {
            const form = document.getElementById("courseForm");
            form.reset();
            form.classList.remove("was-validated");

            // Điền dữ liệu vào form
            document.getElementById("courseFormId").value = course.id;
            document.getElementById("courseFormTitle").value = course.title;
            document.getElementById("courseFormCategory").value = course.category;
            document.getElementById("courseFormInstructor").value = course.instructor;
            document.getElementById("courseFormLessons").value = course.lessons;
            document.getElementById("courseFormPrice").value = course.price;
            document.getElementById("courseFormRating").value = course.rating;
            document.getElementById("courseFormStatus").value = course.status;

            document.getElementById("courseFormModalLabel").textContent = "Sửa khóa học";
            getCourseFormModal().show();
        }
        return;
    }

    // Xử lý nút Xóa (DELETE)
    if (deleteButton) {
        const courseId = Number(deleteButton.dataset.courseId);
        const course = adminCourses.find(c => c.id === courseId);

        if (course) {
            courseToDeleteId = courseId;
            document.getElementById("deleteConfirmCourseTitle").textContent = course.title;
            getDeleteConfirmModal().show();
        }
    }
}


/*
    Xử lý sự kiện bấm nút "+ Thêm khóa học mới".
*/
function handleAddCourseClick() {
    const form = document.getElementById("courseForm");
    
    // Reset form và xóa class xác thực
    form.reset();
    form.classList.remove("was-validated");
    document.getElementById("courseFormId").value = "";
    
    // Cập nhật tiêu đề Modal và hiển thị
    document.getElementById("courseFormModalLabel").textContent = "Thêm khóa học mới";
    getCourseFormModal().show();
}

/*
    Xử lý sự kiện Lưu (CREATE / UPDATE)
*/
function handleSaveCourseClick() {
    const form = document.getElementById("courseForm");

    // Validate dữ liệu
    if (!form.checkValidity()) {
        form.classList.add("was-validated");
        return;
    }

    const idField = document.getElementById("courseFormId").value;
    const isEditing = idField !== "";

    // Lấy object khóa học từ form
    const courseData = {
        title: document.getElementById("courseFormTitle").value.trim(),
        category: document.getElementById("courseFormCategory").value,
        instructor: document.getElementById("courseFormInstructor").value.trim(),
        lessons: Number(document.getElementById("courseFormLessons").value),
        price: Number(document.getElementById("courseFormPrice").value),
        rating: Number(document.getElementById("courseFormRating").value),
        status: document.getElementById("courseFormStatus").value
    };

    if (isEditing) {
        // UPDATE (Cập nhật)
        const courseId = Number(idField);
        const index = adminCourses.findIndex(c => c.id === courseId);
        if (index !== -1) {
            // Hợp nhất dữ liệu mới vào khóa học cũ
            adminCourses[index] = { ...adminCourses[index], ...courseData };
            showToast("Course updated.");
        }
    } else {
        // CREATE (Tạo mới)
        let newId = 1;
        if (adminCourses.length > 0) {
            newId = Math.max(...adminCourses.map(c => c.id)) + 1;
        }
        courseData.id = newId;
        adminCourses.push(courseData);
        showToast("Course created.");
    }

    // Lưu vào localStorage, render lại giao diện và đóng Modal
    writeCoursesToStorage(adminCourses);
    renderCoursesTable();
    getCourseFormModal().hide();
}

/*
    Xử lý sự kiện Xác nhận Xóa
*/
function executeDeleteCourse() {
    if (courseToDeleteId !== null) {
        // Lọc bỏ phần tử cần xóa
        adminCourses = adminCourses.filter(c => c.id !== courseToDeleteId);

        // Lưu dữ liệu và render lại
        writeCoursesToStorage(adminCourses);
        renderCoursesTable();

        // Kiểm tra xem khóa học đang xóa có đang được mở trong Modal Sửa không.
        // Nếu có, đóng Modal Sửa.
        const currentEditId = document.getElementById("courseFormId").value;
        if (currentEditId !== "" && Number(currentEditId) === courseToDeleteId) {
            getCourseFormModal().hide();
        }

        getDeleteConfirmModal().hide();
        showToast("Course deleted.");
        courseToDeleteId = null; // Đặt lại sau khi xóa
    }
}


// Gắn toàn bộ sự kiện cần thiết cho trang admin (chỉ gắn một lần khi tải trang).
function initEventListeners() {
    document
        .getElementById("courseSearchInput")
        .addEventListener("input", handleSearchInput);

    document
        .getElementById("categoryFilterSelect")
        .addEventListener("change", handleCategoryFilterChange);

    document
        .getElementById("statusFilterSelect")
        .addEventListener("change", handleStatusFilterChange);

    document
        .getElementById("paginationList")
        .addEventListener("click", handlePaginationClick);

    document
        .getElementById("coursesTableBody")
        .addEventListener("click", handleTableActionClick);

    document
        .getElementById("btnAddCourse")
        .addEventListener("click", handleAddCourseClick);
        
    // Events cho phần CRUD mới
    document
        .getElementById("saveCourseBtn")
        .addEventListener("click", handleSaveCourseClick);

    document
        .getElementById("confirmDeleteBtn")
        .addEventListener("click", executeDeleteCourse);
}


// Hàm khởi chạy toàn bộ trang admin sau khi HTML đã tải xong.
function initAdminPage() {
    initAdminCourses();

    initEventListeners();

    renderCoursesTable();
}


// Chạy hàm khởi tạo sau khi toàn bộ HTML đã tải xong.
document.addEventListener(
    "DOMContentLoaded",
    initAdminPage
);