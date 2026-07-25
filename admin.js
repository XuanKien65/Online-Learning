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
*/
let adminCourses = [];

let currentPage = 1;

let activeFilters = {
    keyword: "",
    category: "all",
    status: "all"
};


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


/*
    Xử lý sự kiện bấm nút Sửa hoặc Xóa trên một dòng khóa học.

    Cũng dùng event delegation vì các dòng trong bảng được tạo lại
    (innerHTML) mỗi lần render.

    Logic mở modal Sửa / Xóa thật sự sẽ được triển khai ở phần CRUD
    tiếp theo của Problem 04. Ở đây chỉ ghi log để xác nhận đã bắt
    đúng sự kiện và đúng khóa học được chọn.
*/
function handleTableActionClick(event) {
    const editButton = event.target.closest(".btn-edit-course");

    const deleteButton = event.target.closest(".btn-delete-course");

    if (editButton) {
        const courseId = Number(editButton.dataset.courseId);

        // TODO (phần CRUD tiếp theo): mở modal courseFormModal và điền dữ liệu khóa học.
        console.log("Yêu cầu sửa khóa học có id:", courseId);

        return;
    }

    if (deleteButton) {
        const courseId = Number(deleteButton.dataset.courseId);

        // TODO (phần CRUD tiếp theo): mở modal deleteConfirmModal để xác nhận xóa.
        console.log("Yêu cầu xóa khóa học có id:", courseId);
    }
}


/*
    Xử lý sự kiện bấm nút "+ Thêm khóa học mới".

    Logic mở modal và lưu khóa học mới sẽ được triển khai ở phần CRUD
    tiếp theo của Problem 04.
*/
function handleAddCourseClick() {
    // TODO (phần CRUD tiếp theo): mở modal courseFormModal ở chế độ "Thêm mới".
    console.log("Yêu cầu mở form thêm khóa học mới.");
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