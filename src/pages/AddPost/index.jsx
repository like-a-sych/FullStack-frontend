import React, { useEffect } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { observer } from "mobx-react-lite";
import SimpleMDE from "react-simplemde-editor";

import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";

import "easymde/dist/easymde.min.css";
import styles from "./AddPost.module.scss";

import { authStore } from "../../store/auth";
import axios from "../../axios";

export const AddPost = observer(() => {
	const { id } = useParams();
	const isAuth = authStore.isAuth;
	const navigate = useNavigate();
	const inputFileRef = React.useRef(null);
	const isEditing = Boolean(id);

	const [isLoading, setLoading] = React.useState(false);
	const [imageUrl, setImageUrl] = React.useState(undefined);
	const [text, setText] = React.useState("");
	const [title, setTitle] = React.useState("");
	const [tags, setTags] = React.useState("");

	const handleChangeFile = async (event) => {
		try {
			const formData = new FormData();
			const file = event.target.files[0];
			formData.append("image", file);
			const { data } = await axios.post("/upload", formData);
			setImageUrl(data.url);
		} catch (error) {
			console.warn(error);
			alert("Ошибка загрузки файла");
		}
	};
	const onClickRemoveImage = () => {
		setImageUrl(undefined);
	};
	const onChange = React.useCallback((value) => {
		setText(value);
	}, []);

	const onSubmit = async () => {
		try {
			setLoading(true);

			const fields = {
				title,
				text,
				tags: tags.split(","),
				imageUrl,
			};

			const { data } = isEditing
				? await axios.patch(`/posts/${id}`, fields)
				: await axios.post("/posts", fields);

			const _id = isEditing ? id : data._id;
			navigate(`/posts/${_id}`);
		} catch (error) {
			console.log(error);
			alert("Ошибка при создании статьи");
		}
	};

	useEffect(() => {
		if (id) {
			axios.get(`posts/${id}`).then(({ data }) => {
				setTitle(data.title);
				setText(data.text);
				setTags(data.tags.join(","));
				setImageUrl(data.imageUrl);
			});
		}
	}, [id]);

	const options = React.useMemo(
		() => ({
			spellChecker: false,
			maxHeight: "400px",
			autofocus: true,
			placeholder: "Введите текст...",
			status: false,
			autosave: {
				enabled: true,
				delay: 1000,
			},
		}),
		[]
	);

	if (!window.localStorage.getItem("token") && !isAuth) {
		return <Navigate to="/" />;
	}

	return (
		<Paper style={{ padding: 30 }}>
			<Button
				onClick={() => inputFileRef.current.click()}
				variant="outlined"
				size="large"
			>
				Загрузить превью
			</Button>
			<input
				type="file"
				ref={inputFileRef}
				onChange={handleChangeFile}
				hidden
			/>
			{imageUrl && (
				<>
					<Button
						variant="contained"
						color="error"
						onClick={onClickRemoveImage}
						style={{ marginLeft: 10 }}
					>
						Удалить
					</Button>
					<img
						className={styles.image}
						src={`http://localhost:4444${imageUrl}`}
						alt="Uploaded"
					/>
				</>
			)}
			<br />
			<br />
			<TextField
				classes={{ root: styles.title }}
				variant="standard"
				placeholder="Заголовок статьи..."
				value={title}
				onChange={(e) => setTitle(e.target.value)}
				fullWidth
			/>
			<TextField
				classes={{ root: styles.tags }}
				variant="standard"
				placeholder="Тэги"
				value={tags}
				onChange={(e) => setTags(e.target.value)}
				fullWidth
			/>
			<SimpleMDE
				className={styles.editor}
				value={text}
				onChange={onChange}
				options={options}
			/>
			<div className={styles.buttons}>
				<Button onClick={onSubmit} size="large" variant="contained">
					{isEditing ? "Сохранить" : "Опубликовать"}
				</Button>
				<Link to="/">
					<Button size="large">Отмена</Button>
				</Link>
			</div>
		</Paper>
	);
});
