import { Alert } from "antd";

function Message({ children }) {
  return <Alert message={children} type="error" showIcon closable />;
}

export default Message;
