// tạo ra middleware để quản lý việc sắp xếp dữ liệu cho nhìu trang quản lý

module.exports = function sortMiddleware(req, res, next) {
    // sử dụng biến cục bộ để xử lý yêu cầu gửi lên trên url
    res.locals._sort = {
        enabled: false, // ko có param thì tắt
        type: 'default',
    };
    // kiểm tra nếu query truyền lên có param _sort thì thực hiện việc gán lại các giá trị
    if (req.query.hasOwnProperty('_sort')) {
        // res.locals._sort.enabled = true;
        // res.locals._sort.type = req.query.type;
        // res.locals._sort.column = req.query.column;

        // nối 2 object theo thứ tự phải sang trái
        Object.assign(res.locals._sort, {
            enabled: true,
            type: req.query.type,
            column: req.query.column,
        });
    }
    next();
};
