import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ChatRoom from "@/pages/chat";
import { Home } from "./pages/home";
import { useEffect, useState } from "react";

function App() {
        const [username, setUsername] = useState<string|null>(localStorage.getItem("username"))
        useEffect(() => {
            if (username) {
                localStorage.setItem("username",username)
            }
        },[username])
    return (
        <Router>
            <Routes>
                <Route path="/chat/:id" element={<ChatRoom />} />
                <Route path="/" element={<Home username={username} setUsername={setUsername} />} />
            </Routes>
        </Router>
    )
}

export default App
