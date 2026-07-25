/*
    app.js

    File này chứa:
    - Dữ liệu các khóa học.
    - Hàm tạo chương trình học.
    - Hàm định dạng giá tiền.
    - Hàm hiển thị các thẻ khóa học lên trang index.html.
*/


// Tạo chương trình học gồm 3 phần và tổng cộng 12 bài học.
function createCurriculum(topic) {
    return [
        {
            title: `Phần 1 - Giới thiệu về ${topic}`,

            lessons: [
                `Làm quen với ${topic}`,
                `Các khái niệm cơ bản của ${topic}`,
                "Cài đặt môi trường học tập"
            ]
        },

        {
            title: `Phần 2 - Các kỹ năng chính về ${topic}`,

            lessons: [
                "Tìm hiểu các công cụ quan trọng",
                "Thực hành với các ví dụ",
                "Những lỗi thường gặp cần tránh",
                "Bài tập thực hành cuối phần"
            ]
        },

        {
            title: "Phần 3 - Xây dựng dự án hoàn chỉnh",

            lessons: [
                "Lên kế hoạch cho dự án",
                "Tạo cấu trúc dự án",
                "Phát triển các chức năng chính",
                "Kiểm thử dự án",
                "Hoàn thiện và công bố dự án"
            ]
        }
    ];
}


// Danh sách khóa học được viết trực tiếp trong mảng JavaScript.
const courses = [
    {
        id: 1,

        title: "Nền tảng HTML và CSS",

        category: "Lập trình web",

        instructor: "Nguyễn Minh Anh",

        rating: 4.8,

        reviews: 120,

        students: 1200,

        lessons: 12,

        price: 0,

        thumbnailClass: "thumbnail-web",

        shortDescription:
            "Học cách xây dựng các trang web responsive bằng HTML5 và CSS3.",

        description: [
            "Khóa học này giới thiệu những công nghệ cơ bản được sử dụng để tạo nên một trang web hiện đại. Bạn sẽ được học cách sử dụng HTML để xây dựng cấu trúc trang và sử dụng CSS để tạo giao diện đẹp mắt.",

            "Sau khi hoàn thành khóa học, bạn có thể tự xây dựng một trang web responsive hoạt động tốt trên máy tính, máy tính bảng và điện thoại."
        ],

        learn: [
            "Tạo cấu trúc đầy đủ cho một tài liệu HTML.",
            "Sử dụng đúng các thẻ HTML thông dụng.",
            "Trang trí giao diện bằng các bộ chọn và thuộc tính CSS.",
            "Xây dựng giao diện responsive cho nhiều kích thước màn hình."
        ],

        curriculum: createCurriculum("HTML và CSS")
    },

    {
        id: 2,

        title: "JavaScript cơ bản",

        category: "Lập trình web",

        instructor: "Trần Quốc Huy",

        rating: 4.9,

        reviews: 245,

        students: 1850,

        lessons: 12,

        price: 49,

        thumbnailClass: "thumbnail-web",

        shortDescription:
            "Học kiến thức JavaScript cơ bản và tạo các trang web có tính tương tác.",

        description: [
            "JavaScript là ngôn ngữ lập trình giúp trang web có khả năng tương tác với người dùng. Khóa học sẽ giải thích biến, điều kiện, vòng lặp, hàm, mảng và đối tượng thông qua các ví dụ dễ hiểu.",

            "Bạn cũng sẽ học cách JavaScript làm việc với các phần tử HTML thông qua DOM và cách xử lý các sự kiện như nhấn chuột, nhập bàn phím và gửi biểu mẫu."
        ],

        learn: [
            "Hiểu biến, kiểu dữ liệu và toán tử.",
            "Sử dụng câu điều kiện, vòng lặp và hàm.",
            "Làm việc với mảng và đối tượng JavaScript.",
            "Tương tác với HTML thông qua DOM."
        ],

        curriculum: createCurriculum("JavaScript")
    },

    {
        id: 3,

        title: "Thiết kế giao diện UI/UX cơ bản",

        category: "Thiết kế",

        instructor: "Lê Hoàng Lan",

        rating: 4.7,

        reviews: 98,

        students: 940,

        lessons: 12,

        price: 39,

        thumbnailClass: "thumbnail-design",

        shortDescription:
            "Tìm hiểu các nguyên tắc cơ bản của thiết kế giao diện và trải nghiệm người dùng.",

        description: [
            "Khóa học giới thiệu sự khác nhau giữa thiết kế giao diện người dùng và thiết kế trải nghiệm người dùng. Bạn sẽ học cách tìm hiểu nhu cầu người dùng và thiết kế giao diện đơn giản, dễ sử dụng.",

            "Nội dung khóa học bao gồm màu sắc, kiểu chữ, khoảng cách, bản phác thảo, nguyên mẫu và kiểm thử khả năng sử dụng."
        ],

        learn: [
            "Hiểu sự khác nhau giữa UI và UX.",
            "Áp dụng nguyên tắc màu sắc và kiểu chữ.",
            "Tạo bản phác thảo và nguyên mẫu đơn giản.",
            "Đánh giá thiết kế bằng kiểm thử khả năng sử dụng."
        ],

        curriculum: createCurriculum("thiết kế UI/UX")
    },

    {
        id: 4,

        title: "Thiết kế Figma cho người mới",

        category: "Thiết kế",

        instructor: "Phạm Thu Trang",

        rating: 4.6,

        reviews: 86,

        students: 760,

        lessons: 12,

        price: 29,

        thumbnailClass: "thumbnail-design",

        shortDescription:
            "Thiết kế giao diện website và ứng dụng di động bằng Figma.",

        description: [
            "Figma là một công cụ phổ biến dùng để thiết kế giao diện website và ứng dụng di động. Khóa học sẽ giải thích giao diện Figma và các công cụ quan trọng nhất.",

            "Bạn sẽ tạo các thành phần, kiểu dáng có thể tái sử dụng và nguyên mẫu tương tác trong một dự án thiết kế ứng dụng nhỏ."
        ],

        learn: [
            "Sử dụng các công cụ chính trong Figma.",
            "Tạo khung, hình dạng và kiểu chữ.",
            "Xây dựng các thành phần có thể tái sử dụng.",
            "Tạo nguyên mẫu có tính tương tác."
        ],

        curriculum: createCurriculum("Figma")
    },

    {
        id: 5,

        title: "Phân tích dữ liệu bằng Python",

        category: "Khoa học dữ liệu",

        instructor: "Đỗ Đức Long",

        rating: 4.9,

        reviews: 214,

        students: 1680,

        lessons: 12,

        price: 59,

        thumbnailClass: "thumbnail-data",

        shortDescription:
            "Phân tích và xử lý dữ liệu bằng Python, Pandas và NumPy.",

        description: [
            "Khóa học này hướng dẫn quy trình phân tích dữ liệu cơ bản bằng Python. Bạn sẽ học cách đọc, làm sạch, chuyển đổi và phân tích dữ liệu từ nhiều nguồn khác nhau.",

            "Khóa học sử dụng các ví dụ thực tế với NumPy và Pandas để giúp bạn hiểu cách một chuyên viên phân tích dữ liệu giải quyết vấn đề."
        ],

        learn: [
            "Sử dụng Python để phân tích dữ liệu cơ bản.",
            "Đọc và làm sạch dữ liệu bằng Pandas.",
            "Làm việc với mảng bằng NumPy.",
            "Tính toán và tổng hợp các giá trị quan trọng."
        ],

        curriculum: createCurriculum("phân tích dữ liệu bằng Python")
    },

    {
        id: 6,

        title: "Trực quan hóa dữ liệu với Chart.js",

        category: "Khoa học dữ liệu",

        instructor: "Vũ Quang Nam",

        rating: 4.8,

        reviews: 157,

        students: 1100,

        lessons: 12,

        price: 45,

        thumbnailClass: "thumbnail-data",

        shortDescription:
            "Tạo các biểu đồ rõ ràng và có tính tương tác cho ứng dụng web.",

        description: [
            "Trực quan hóa dữ liệu giúp người dùng hiểu thông tin nhanh hơn. Trong khóa học này, bạn sẽ học cách hiển thị dữ liệu bằng biểu đồ cột, biểu đồ đường, biểu đồ tròn và biểu đồ doughnut.",

            "Bạn sẽ sử dụng Chart.js kết hợp với HTML và JavaScript để tạo biểu đồ responsive và cập nhật dữ liệu biểu đồ một cách linh hoạt."
        ],

        learn: [
            "Hiểu các loại biểu đồ thường gặp.",
            "Tạo biểu đồ bằng thư viện Chart.js.",
            "Tùy chỉnh nhãn, trục và chú thích.",
            "Cập nhật dữ liệu biểu đồ bằng JavaScript."
        ],

        curriculum: createCurriculum("trực quan hóa dữ liệu")
    }
];


// Chuyển giá tiền thành chữ MIỄN PHÍ hoặc định dạng USD.
function formatPrice(price) {
    if (price === 0) {
        return "MIỄN PHÍ";
    }

    return `${price} USD`;
}


// Tạo mã HTML cho một thẻ khóa học.
function createCourseCard(course) {
    return `
        <div class="col">

            <article class="card course-card h-100">

                <div class="course-thumbnail ${course.thumbnailClass}">

                    <span>
                        ${course.category}
                    </span>

                    <strong>
                        ${course.title}
                    </strong>

                </div>

                <div class="card-body">

                    <p class="course-category">
                        ${course.category}
                    </p>

                    <h3 class="course-card-title">
                        ${course.title}
                    </h3>

                    <p class="course-rating">
                        <i class="bi bi-star-fill"></i> ${course.rating} (${course.reviews} đánh giá)
                    </p>

                    <div class="course-information">

                        <span>
                            <i class="bi bi-person-fill"></i> ${course.instructor}
                        </span>

                        <span>
                            <i class="bi bi-journal-bookmark-fill"></i> ${course.lessons} bài học
                        </span>

                    </div>

                    <p class="text-secondary">
                        ${course.shortDescription}
                    </p>

                    <div class="course-card-footer">

                        <p class="course-price-small">
                            ${formatPrice(course.price)}
                        </p>

                        <a
                            class="btn btn-primary"
                            href="course-detail.html?id=${course.id}"
                        >
                            Xem chi tiết
                        </a>

                    </div>

                </div>
            </article>

        </div>
    `;
}


// Render tất cả card lên lưới, ẩn card không khớp theo đề bài (không xóa khỏi DOM).
function renderCourseCards() {
    const coursesGrid = document.getElementById("coursesGrid");

    // Thoát nếu không có lưới (trang course-detail.html không có phần tử này).
    if (!coursesGrid) {
        return;
    }

    // Render toàn bộ 6 card lần đầu tiên khi trang tải.
    coursesGrid.innerHTML = courses
        .map(function (course) {
            return createCourseCard(course);
        })
        .join("");
}


// ============================================================
// PROBLEM 02 — Live Search, Category Filter & Sort
// ============================================================

// Biến debounce — dùng để trì hoãn tìm kiếm khi người dùng gõ nhanh.
var searchDebounceTimer = null;

// Lấy từ khóa tìm kiếm hiện tại từ input, chuyển về chữ thường để so sánh.
function getSearchKeyword() {
    var input = document.getElementById("navbarSearchInput");
    return input ? input.value.trim().toLowerCase() : "";
}

// Lấy danh mục đang active từ các tab (đọc data-category trên button).
function getActiveCategory() {
    var activeBtn = document.querySelector("#categoryTabs .category-button.active");
    return activeBtn ? activeBtn.dataset.category : "all";
}

// Lấy giá trị sắp xếp từ dropdown.
function getSortValue() {
    var select = document.getElementById("sortSelect");
    return select ? select.value : "default";
}

/*
    Hàm trung tâm Problem 02: kết hợp search + filter + sort rồi cập nhật giao diện.
    Theo đề bài: card không khớp bị ẨN (display:none), KHÔNG xóa khỏi DOM.
*/
function applySearchFilterSort() {
    var coursesGrid = document.getElementById("coursesGrid");
    if (!coursesGrid) {
        return;
    }

    var keyword  = getSearchKeyword();
    var category = getActiveCategory();
    var sortVal  = getSortValue();

    // Bước 1: Xác định khóa học nào khớp điều kiện (search + category).
    var matched = courses.filter(function (course) {

        // Tìm theo title HOẶC tên giảng viên (đề bài yêu cầu).
        var matchSearch =
            keyword === "" ||
            course.title.toLowerCase().includes(keyword) ||
            course.instructor.toLowerCase().includes(keyword);

        // Lọc theo danh mục (nếu chọn "all" thì hiện tất cả).
        var matchCategory =
            category === "all" || course.category === category;

        return matchSearch && matchCategory;
    });

    // Bước 2: Sắp xếp danh sách khớp theo lựa chọn dropdown.
    if (sortVal === "price-asc") {
        matched = matched.slice().sort(function (a, b) { return a.price - b.price; });
    } else if (sortVal === "price-desc") {
        matched = matched.slice().sort(function (a, b) { return b.price - a.price; });
    } else if (sortVal === "rating-desc") {
        matched = matched.slice().sort(function (a, b) { return b.rating - a.rating; });
    }

    // Bước 3: Lấy tập hợp id của các khóa học khớp để ẩn/hiện card.
    var matchedIds = matched.map(function (c) { return c.id; });

    // Bước 4: Duyệt từng card trong DOM, ẩn hoặc hiện tuỳ theo id khớp hay không.
    var allCards = coursesGrid.querySelectorAll(".col");
    allCards.forEach(function (col) {
        var link = col.querySelector("a[href*='id=']");
        if (!link) {
            return;
        }
        // Lấy id từ href: "course-detail.html?id=2" → 2.
        var params = new URLSearchParams(link.getAttribute("href").split("?")[1]);
        var cardId = Number(params.get("id"));

        if (matchedIds.includes(cardId)) {
            col.style.display = "";
        } else {
            col.style.display = "none";
        }
    });

    // Bước 5: Nếu đang sort thì cần re-order card trong DOM theo thứ tự matched.
    if (sortVal !== "default") {
        matched.forEach(function (course) {
            var targetCol = Array.from(allCards).find(function (col) {
                var link = col.querySelector("a[href*='id=" + course.id + "']");
                return link !== null;
            });
            if (targetCol) {
                coursesGrid.appendChild(targetCol);
            }
        });
    }

    // Bước 6: Hiện/ẩn thông báo "Không tìm thấy khóa học nào".
    var noResultMsg = document.getElementById("noResultMessage");
    if (noResultMsg) {
        if (matched.length === 0) {
            noResultMsg.classList.remove("d-none");
        } else {
            noResultMsg.classList.add("d-none");
        }
    }
}

// Khởi tạo tất cả sự kiện cho Problem 02 (chỉ chạy trên trang index.html).
function initProblem02() {
    var searchInput    = document.getElementById("navbarSearchInput");
    var clearBtn       = document.getElementById("clearSearchBtn");
    var sortSelect     = document.getElementById("sortSelect");
    var categoryBtns   = document.querySelectorAll("#categoryTabs .category-button");

    // Không có phần tử → đang ở trang khác, bỏ qua.
    if (!searchInput) {
        return;
    }

    // --- Live Search: gõ vào ô tìm kiếm, debounce 300ms ---
    searchInput.addEventListener("input", function () {
        // Hiện/ẩn nút xóa nhanh tuỳ vào có text hay không.
        if (clearBtn) {
            if (this.value.length > 0) {
                clearBtn.classList.remove("d-none");
            } else {
                clearBtn.classList.add("d-none");
            }
        }

        // Debounce: chờ 300ms sau lần gõ cuối cùng mới lọc.
        clearTimeout(searchDebounceTimer);
        searchDebounceTimer = setTimeout(applySearchFilterSort, 300);
    });

    // --- Nút xóa nhanh: reset ngay lập tức (không debounce) ---
    if (clearBtn) {
        clearBtn.addEventListener("click", function () {
            searchInput.value = "";
            clearBtn.classList.add("d-none");
            searchInput.focus();
            applySearchFilterSort();
        });
    }

    // --- Category Tabs: click tab → đổi active → lọc ngay ---
    categoryBtns.forEach(function (btn) {
        btn.addEventListener("click", function () {
            // Bỏ active tất cả, bật active tab vừa click.
            categoryBtns.forEach(function (b) {
                b.classList.remove("active");
            });
            this.classList.add("active");
            applySearchFilterSort();
        });
    });

    // --- Sort Dropdown: thay đổi → sắp xếp và render lại ngay ---
    if (sortSelect) {
        sortSelect.addEventListener("change", applySearchFilterSort);
    }
}


// Chạy sau khi HTML tải xong: render card rồi khởi tạo chức năng Problem 02.
document.addEventListener("DOMContentLoaded", function () {
    renderCourseCards();
    initProblem02();
});


/*
    Đưa mảng courses và hàm formatPrice vào đối tượng window.
    Nhờ đó, file detail.js có thể sử dụng dữ liệu được khai báo trong app.js.
*/
window.courseData = courses;
window.formatCoursePrice = formatPrice;