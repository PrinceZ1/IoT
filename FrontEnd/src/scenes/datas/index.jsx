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
import _ from "lodash"; // Import lodash for debounce

const Datas = () => {
  const [data, setData] = React.useState([]); // Dữ liệu từ API
  const [totalItems, setTotalItems] = React.useState(0); // Tổng số mục
  const [page, setPage] = React.useState(1); // Trang hiện tại
  const [pageSize, setPageSize] = React.useState(10); // Kích thước trang
  const [loading, setLoading] = React.useState(false); // Trạng thái tải
  const [error, setError] = React.useState(null); // Trạng thái lỗi
  const [filterValues, setFilterValues] = React.useState({
    temperature: "",
    humidity: "",
    light: "",
    timestamp: "",
  });
  const [filterField, setFilterField] = React.useState(""); // Lựa chọn filter
  const [sortDirection, setSortDirection] = React.useState(""); // Lựa chọn sắp xếp
  const [inputValue, setInputValue] = React.useState(""); // Giá trị nhập vào

  // Hàm gọi API
  const fetchData = async () => {
    setLoading(true);
    setError(null); // Reset lỗi trước khi gọi API
    try {
      const params = {
        pageNumber: page - 1, // Điều chỉnh để gửi đúng `pageNumber` cho API
        pageSize,
      };

      // Thêm các bộ lọc không rỗng vào params
      if (filterValues.temperature)
        params.temperature = filterValues.temperature;
      if (filterValues.humidity) params.humidity = filterValues.humidity;
      if (filterValues.light) params.light = filterValues.light;
      if (filterValues.timestamp) params.timestamp = filterValues.timestamp;
      if (filterField && inputValue) params[filterField] = inputValue;
      if (sortDirection) {
        params.sortBy = filterField;
        params.sortDirection = sortDirection;
      }

      const response = await axios.get("http://localhost:8080/sensor", {
        params,
      });

      // Gán dữ liệu API trả về
      const apiData = response.data.content.map((item) => ({
        id: item.id,
        temperature: `${item.temperature}℃`,
        humidity: `${item.humidity}%`,
        light: `${item.light} Lux`,
        timestamp: new Date(item.timestamp).toLocaleString("en-GB"), // Định dạng thời gian
      }));

      // Cập nhật dữ liệu và trạng thái phân trang từ API trả về
      setData(apiData);
      setTotalItems(response.data.totalItems); // Tổng số mục
      setPage(response.data.currentPage); // Cập nhật trang hiện tại từ API
      setPageSize(response.data.pageSize); // Cập nhật kích thước trang từ API
    } catch (error) {
      console.error("Error fetching data", error);
      setError("Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Debounced fetch function to limit API calls during input
  const debounceFetchData = React.useCallback(_.debounce(fetchData, 500), [
    filterValues,
    page,
    pageSize,
  ]);

  // Gọi fetchData khi tải trang hoặc thay đổi page/pageSize/filterValues
  React.useEffect(() => {
    debounceFetchData();
  }, [page, pageSize, filterValues, filterField, sortDirection]);

  // Cấu hình các cột
  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "temperature", headerName: "Temperature (℃)", flex: 1 },
    { field: "humidity", headerName: "Humidity (%)", flex: 1 },
    { field: "light", headerName: "Light (Lux)", flex: 1 },
    { field: "timestamp", headerName: "Timestamp", flex: 1 },
  ];

  // Xử lý khi người dùng nhập bộ lọc
  const handleFilterChange = (event) => {
    setInputValue(event.target.value);
    setPage(1); // Reset về trang đầu khi thay đổi bộ lọc
  };

  // Xử lý khi người dùng thay đổi filterField
  const handleFilterFieldChange = (event) => {
    setFilterField(event.target.value);
    setPage(1);
  };

  // Xử lý khi người dùng thay đổi sortDirection
  const handleSortDirectionChange = (event) => {
    setSortDirection(event.target.value);
  };

  // Xử lý khi người dùng bấm nút tìm kiếm
  const handleSearch = () => {
    fetchData();
  };

  // Xử lý khi người dùng thay đổi số trang (pageNumber) bằng Pagination
  const handlePageChange = (event, value) => {
    setPage(value); // Cập nhật trang mới khi người dùng chọn trang
  };

  // Xử lý khi người dùng thay đổi kích thước trang
  const handlePageSizeChange = (event) => {
    setPageSize(event.target.value); // Cập nhật kích thước trang
    setPage(1); // Reset về trang đầu khi thay đổi kích thước trang
  };

  // Hàm Reset để trở về trạng thái ban đầu
  const handleReset = () => {
    setFilterField(""); // Xóa trường tìm kiếm
    setInputValue(""); // Xóa giá trị tìm kiếm
    setSortDirection(""); // Xóa sắp xếp
    setFilterValues({ temperature: "", humidity: "", light: "", timestamp: "" }); // Xóa các bộ lọc cụ thể
    setPage(1); // Đặt lại trang đầu tiên
    fetchData(); // Gọi lại API để tải dữ liệu ban đầu
  };

  return (
    <Box m="20px">
      <h1>Data Sensor</h1>

      {/* Input và các lựa chọn filter/sort */}
      <Box display="flex" alignItems="center" mb="20px">
        <TextField
          label="Enter Value"
          variant="outlined"
          value={inputValue}
          onChange={handleFilterChange}
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
          <MenuItem value="temperature">Temperature</MenuItem>
          <MenuItem value="humidity">Humidity</MenuItem>
          <MenuItem value="light">Light</MenuItem>
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
        <Button variant="contained" color="primary" onClick={handleSearch}>
          Search
        </Button>
        <Button variant="outlined" color="secondary" onClick={handleReset} style={{ marginLeft: "10px" }}>
          Reset
        </Button>
      </Box>

      <Box
        height="60vh"
        sx={{
          "& .MuiDataGrid-root": { border: "none" },
          "& .MuiDataGrid-cell": { border: "none" },
        }}
      >
        <DataGrid
          rows={data} // Dữ liệu từ API
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

export default Datas;
