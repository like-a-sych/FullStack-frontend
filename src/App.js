import { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { Route, Routes } from "react-router-dom";

import Container from "@mui/material/Container";

import { Header } from "./components";
import { Home, FullPost, Registration, AddPost, Login } from "./pages";

import { authStore } from "./store/auth";

const App = observer(() => {
	useEffect(() => {
		authStore.getAuth();
	}, []);
	return (
		<>
			<Header />
			<Container maxWidth="lg">
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/posts/:id" element={<FullPost />} />
					<Route path="/posts/:id/edit" element={<AddPost />} />
					<Route path="/add-post" element={<AddPost />} />
					<Route path="login" element={<Login />} />
					<Route path="register" element={<Registration />} />
				</Routes>
			</Container>
		</>
	);
});

export default App;
