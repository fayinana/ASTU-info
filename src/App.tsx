import { useEffect } from "react";
import "./index.css";
import { fetchUsers } from "./api/user";

export default function App() {
  useEffect(() => {
    const featchUsers = async () => {
      await fetchUsers({ type: "teacher" });
      console.log("====================================");
      console.log();
      console.log("====================================");
    };
    featchUsers();
  });
  return <div className="text-primary">Hello World</div>;
}
