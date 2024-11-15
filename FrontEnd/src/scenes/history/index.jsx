import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Box,
  TextField,
  Button,
  Pagination,
  MenuItem,
  Select,
} from "@mui/material";
import axios from "axios";

const History = () => {
  const [historyData, setHistoryData] = React.useState([]);
  const [totalItems, setTotalItems] = React.useState(0); // Tổng số mục
  const [page, setPage] = React.useState(1); // Trang hiện tại
  const [pageSize, setPageSize] = React.useState(10); // Kích thước trang
  const [loading, setLoading] = React.useState(false); // Trạng thái tải
  const [error, setError] = React.useState(null); // Trạng thái lỗi

  // Trạng thái cho các trường tìm kiếm và sắp xếp
  const [filterField, setFilterField] = React.useState(""); // Trường cần tìm kiếm
  const [sortDirection, setSortDirection] = React.useState(""); // Trạng thái sắp xếp
  const [inputValue, setInputValue] = React.useState(""); // Giá trị nhập vào

  // Hàm gọi API cho lịch sử
  const fetchHistoryData = async () => {
    setLoading(true);
    setError(null); // Reset lỗi trước khi gọi API
    try {
      const params = {
        pageNumber: page - 1, // Điều chỉnh để gửi đúng `pageNumber` cho API
        pageSize,
        [filterField]: inputValue || undefined, // Tìm kiếm theo trường đã chọn và giá trị nhập
        sortBy: filterField || undefined, // Sắp xếp theo trường đã chọn
        sortDirection: sortDirection || undefined, // Hướng sắp xếp
      };

      const response = await axios.get("http://localhost:8080/led", { params });

      // Gán dữ liệu API trả về
      const apiData = response.data.content.map((item) => ({
        id: item.id,
        deviceName: item.deviceName,
        active: item.active,
        timestamp: new Date(item.timestamp).toLocaleString("en-GB"), // Định dạng thời gian
      }));

      // Cập nhật dữ liệu và trạng thái phân trang từ API trả về
      setHistoryData(apiData);
      setTotalItems(response.data.totalItems); // Tổng số mục
    } catch (error) {
      console.error("Error fetching history data", error);
      setError("Failed to fetch history data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Gọi fetchHistoryData khi tải trang hoặc thay đổi page/pageSize/filterField/sortDirection
  React.useEffect(() => {
    fetchHistoryData();
  }, [page, pageSize, filterField, inputValue, sortDirection]);

  // Cấu hình các cột
  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "deviceName", headerName: "Device Name", flex: 1 },
    { field: "active", headerName: "Status", flex: 1 },
    { field: "timestamp", headerName: "Timestamp", flex: 1 },
  ];

  // Xử lý khi người dùng thay đổi số trang (pageNumber) bằng Pagination
  const handlePageChange = (event, value) => {
    setPage(value); // Cập nhật trang mới khi người dùng chọn trang
  };

  // Xử lý khi người dùng thay đổi kích thước trang
  const handlePageSizeChange = (event) => {
    setPageSize(event.target.value); // Cập nhật kích thước trang
    setPage(1); // Reset về trang đầu khi thay đổi kích thước trang
  };

  // Xử lý khi thay đổi tìm kiếm (field và giá trị)
  const handleFilterFieldChange = (event) => {
    setFilterField(event.target.value);
    setPage(1); // Reset về trang đầu sau khi tìm kiếm
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  // Xử lý khi thay đổi sortDirection
  const handleSortDirectionChange = (event) => {
    setSortDirection(event.target.value);
  };

  // Hàm Reset để trở về trạng thái ban đầu
  const handleReset = () => {
    setFilterField(""); // Xóa trường tìm kiếm
    setInputValue(""); // Xóa giá trị tìm kiếm
    setSortDirection(""); // Xóa sắp xếp
    setPage(1); // Đặt lại trang đầu tiên
    fetchHistoryData(); // Gọi lại API để tải dữ liệu ban đầu
  };

  return (
    <Box m="20px">
      <h1>Active History</h1>

      {/* Input và các lựa chọn filter/sort */}
      <Box display="flex" alignItems="center" mb="20px">
        <TextField
          label="Enter Value"
          variant="outlined"
          value={inputValue}
          onChange={handleInputChange}
          style={{ marginRight: "20px" }}
        />
        <Select
          value={filterField}
          onChange={handleFilterFieldChange}
          displayEmpty
          style={{ marginRight: "20px" }}
        >
          <MenuItem value="" disabled>
            Filter By
          </MenuItem>
          <MenuItem value="deviceName">Device Name</MenuItem>
          <MenuItem value="active">Active</MenuItem>
          <MenuItem value="timestamp">Timestamp</MenuItem>
        </Select>
        <Select
          value={sortDirection}
          onChange={handleSortDirectionChange}
          displayEmpty
          style={{ marginRight: "20px" }}
        >
          <MenuItem value="" disabled>
            Sort Type
          </MenuItem>
          <MenuItem value="asc">Asc</MenuItem>
          <MenuItem value="desc">Desc</MenuItem>
        </Select>
        <Button variant="contained" color="primary" onClick={fetchHistoryData}>
          Search
        </Button>
        <Button variant="outlined" color="secondary" onClick={handleReset} style={{ marginLeft: "10px" }}>
          Reset
        </Button>
      </Box>

      {/* Bảng lịch sử */}
      <Box
        height="60vh"
        sx={{
          "& .MuiDataGrid-root": { border: "none" },
          "& .MuiDataGrid-cell": { border: "none" },
        }}
      >
        <DataGrid
          rows={historyData} // Dữ liệu từ API
          columns={columns} // Các cột đã định nghĩa
          pageSize={pageSize} // Kích thước trang
          rowCount={totalItems} // Tổng số dòng từ API
          loading={loading} // Hiển thị trạng thái tải
          paginationMode="server" // Phân trang từ server
          hideFooter={true} // Ẩn phần footer không cần thiết
          disableSelectionOnClick
        />
        {error && <Box color="red">{error}</Box>}
      </Box>

      {/* Điều khiển phân trang */}
      <Box
        display="flex"
        justifyContent="space-between"
        mt="20px"
        alignItems="center"
      >
        {/* Select cho pageSize */}
        <Box display="flex" alignItems="center">
          <span>Page Size: </span>
          <Select
            value={pageSize}
            onChange={handlePageSizeChange}
            style={{ marginLeft: "10px" }}
          >
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={15}>15</MenuItem>
            <MenuItem value={20}>20</MenuItem>
          </Select>
        </Box>

        {/* Pagination cho pageNumber */}
        <Pagination
          count={Math.ceil(totalItems / pageSize)} // Tổng số trang
          page={page} // Trang hiện tại
          onChange={handlePageChange} // Cập nhật trang khi thay đổi
          color="primary"
          showFirstButton
          showLastButton
          siblingCount={1} // Số trang lân cận hiện tại được hiển thị
          boundaryCount={2} // Số trang ở đầu và cuối được hiển thị
        />
      </Box>
    </Box>
  );
};

export default History;
