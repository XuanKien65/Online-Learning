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
                        ⭐ ${course.rating} (${course.reviews} đánh giá)
                    </p>

                    <div class="course-information">

                        <span>
                            👤 ${course.instructor}
                        </span>

                        <span>
                            📚 ${course.lessons} bài học
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


// Hiển thị tất cả khóa học lên trang index.html.
function renderCourseCards() {
    const coursesGrid = document.getElementById("coursesGrid");

    /*
        Trang course-detail.html không có phần tử coursesGrid.

        Vì vậy, nếu không tìm thấy coursesGrid thì hàm sẽ dừng lại
        để tránh xảy ra lỗi JavaScript.
    */
    if (!coursesGrid) {
        return;
    }

    /*
        map() duyệt qua từng khóa học và chuyển mỗi khóa học
        thành một đoạn mã HTML.

        join("") nối tất cả các đoạn HTML lại với nhau.
    */
    coursesGrid.innerHTML = courses
        .map(function (course) {
            return createCourseCard(course);
        })
        .join("");
}


// Chạy hàm hiển thị khóa học sau khi HTML đã tải xong.
document.addEventListener(
    "DOMContentLoaded",
    renderCourseCards
);


/*
    Đưa mảng courses và hàm formatPrice vào đối tượng window.

    Nhờ đó, file detail.js có thể sử dụng dữ liệu khóa học
    được khai báo trong file app.js.
*/
window.courseData = courses;
window.formatCoursePrice = formatPrice;