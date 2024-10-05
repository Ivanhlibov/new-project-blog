import Container from "@mui/material/Container";
import { Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Header } from "./components";
import { Home, FullPost, Registration, AddPost, Login } from "./pages";
import { useEffect } from "react";
import { fetchAuthMe, selectAuth } from "./redux/slices/auth";
import { PostsByTag } from "./pages/PostsByTag";


function App() {
    const dispatch = useDispatch();
    const isAuth = useSelector(selectAuth);

    useEffect(() => {
        dispatch(fetchAuthMe());
    }, [dispatch]); // Добавляем dispatcher как зависимость

    return (
        <>
            <Header />
            <Container maxWidth="lg">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/posts/:id" element={<FullPost />} />
                    <Route path="/posts/:id/edit" element={<AddPost />} />
                    <Route path="/add-post" element={<AddPost />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Registration />} />
                    <Route path="/tag/:tag" element={<PostsByTag />} />
                </Routes>
            </Container>
        </>
    );
}

export default App;
