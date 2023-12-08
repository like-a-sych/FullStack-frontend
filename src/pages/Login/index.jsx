import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { observer } from "mobx-react-lite";

import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";

import styles from "./Login.module.scss";

import { authStore } from "../../store/auth";

export const Login = observer(() => {
	const {
		register,
		handleSubmit,
		setError,
		formState: { errors, isValid },
	} = useForm({
		defaultValues: {
			email: "test@test.ru",
			password: "123",
		},
		mode: "onChange",
	});

	const isAuth = authStore.isAuth;
	const userData = authStore.userData;
	const errorMsg = authStore.errorMsg;

	const onSubmit = (values) => {
		authStore.errorMsg = "";
		authStore.getUserData(values);
	};

	useEffect(() => {
		if (!window.localStorage.getItem("token") && isAuth) {
			window.localStorage.setItem("token", userData.token);
		}
		if (errorMsg) {
			errorMsg.forEach((element) => {
				setError(element.path, { type: "custom", message: element.msg });
			});
		}
	}, [userData, isAuth, errorMsg, setError]);

	if (isAuth) {
		return <Navigate to="/" />;
	}
	return (
		<Paper classes={{ root: styles.root }}>
			<Typography classes={{ root: styles.title }} variant="h5">
				Вход в аккаунт
			</Typography>
			<form onSubmit={handleSubmit(onSubmit)}>
				<TextField
					className={styles.field}
					label="E-Mail"
					error={Boolean(errors.email?.message)}
					helperText={errors.email?.message}
					fullWidth
					type="email"
					{...register("email", { required: "Укажите почту" })}
				/>
				<TextField
					type="password"
					className={styles.field}
					label="Пароль"
					error={Boolean(errors.password?.message)}
					helperText={errors.password?.message}
					fullWidth
					{...register("password", { required: "Укажите пароль" })}
				/>
				<Button
					disabled={!isValid}
					type="submit"
					size="large"
					variant="contained"
					fullWidth
				>
					Войти
				</Button>
			</form>
		</Paper>
	);
});
