import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Members from "./pages/Members";
import MemberDetails from "./pages/MemberDetails";
import Counter from "./pages/Counter";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
    return (
        <BrowserRouter>

            <Routes>

                <Route path="/" element={<Landing />} />

                <Route path="/login" element={<Login />} />

                <Route path="/register" element={<Register />} />

                <Route element={<ProtectedRoute />}>

                    <Route
                        path="/dashboard"
                        element={<Dashboard />}
                    />

                    <Route
                        path="/members"
                        element={<Members />}
                    />

                    <Route
                        path="/members/:id"
                        element={<MemberDetails />}
                    />

                    <Route
                        path="/counter"
                        element={<Counter />}
                    />

                </Route>

            </Routes>

        </BrowserRouter>
    );
}

export default App;