import { Table } from "antd";
import Search from "antd/es/transfer/search";
import { useEffect, useState } from "react";
import Message from "./Message";

const BASE_URL = "https://jsonplaceholder.typicode.com";
const LIMIT = 10;
const columns = [
  {
    title: "ID",
    dataIndex: "id",
    key: "1",
    width: 80,
    fixed: "left",
  },
  {
    title: "Title",
    dataIndex: "title",
    key: "2",
    width: 400,
  },
  {
    title: "User ID",
    dataIndex: "userId",
    key: "3",
    width: 150,
  },
  {
    title: "Status",
    dataIndex: "completed",
    key: "4",
    width: 150,
  },
];

function Main() {
  const [searchQuery, setSearchQuery] = useState("");
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState({
    align: "center",
    current: 1,
    pageSize: LIMIT,
    total: 0,
  });

  useEffect(
    function () {
      getTodos(pagination.current, pagination.pageSize);
    },
    [searchQuery]
  );

  async function getTodos(page, pageSize) {
    try {
      setIsLoading(true);
      setError("");
      const res = await fetch(
        `${BASE_URL}/todos?q=${searchQuery}&_start=${
          10 * (page - 1)
        }&_limit=${pageSize}`
      );
      

      setPagination({
        ...pagination,
        current: page,
        pageSize: pageSize,
        total: parseInt(res.headers.get("X-Total-Count"), 10),
      });

      if (!res.ok) throw new Error("Bad internet connection");

      const data = await res.json();

      if (data.length === 0) throw new Error("Todo not found");
      

      const emptyRow = {
        id: "Empty",
        title: "-",
        userId: "-",
        completed: false,
      };

      setTodos(
        [
          ...data,
          ...Array.from({ length: pageSize - data.length }, () => emptyRow),
        ].map((todo) => ({
          ...todo,
          completed: todo.completed ? "✔" : "❌",
        }))
      );
    } catch (error) {
      setError(`${error.message} ⛔`);
    } finally {
      setIsLoading(false);
    }
  }

  function handleTableChange(pagination) {
    getTodos(pagination.current, pagination.pageSize);
  }

  return (
    <div className="container">
      <Search
        input={{ style: { width: "100px" } }}
        placeholder="Search..."
        size="small"
        loading={isLoading}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {!error && (
        <Table
          columns={columns}
          dataSource={todos}
          pagination={pagination}
          onChange={handleTableChange}
          loading={{
            spinning: isLoading,
            delay: 100,
          }}
          scroll={{ x: 600 }}
          bordered
        />
      )}

      {error && <Message>{error}</Message>}
    </div>
  );
}

export default Main;
