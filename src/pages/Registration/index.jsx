import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { observer } from "mobx-react-lite";

import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";

import styles from "./Login.module.scss";

import { registerStore } from "../../store/register";

export const Registration = observer(() => {
	const {
		register,
		handleSubmit,
		setError,
		formState: { errors, isValid },
	} = useForm({
		defaultValues: {
			fullName: "Вася Пупекин",
			email: "test1@test1.ru",
			password: "123",
		},
		mode: "onChange",
	});

	const isAuth = registerStore.isAuth;
	const userData = registerStore.userData;
	const errorMsg = registerStore.errorMsg;

	const onSubmit = (values) => {
		registerStore.errorMsg = "";
		registerStore.getRegister(values);
	};

	useEffect(() => {
		if (isAuth) {
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
				Создание аккаунта
			</Typography>
			<div className={styles.avatar}>
				<Avatar sx={{ width: 100, height: 100 }} />
			</div>
			<form onSubmit={handleSubmit(onSubmit)}>
				<TextField
					className={styles.field}
					label="Полное имя"
					fullWidth
					error={Boolean(errors.fullName?.message)}
					helperText={errors.fullName?.message}
					{...register("fullName", { required: "Укажите полное имя" })}
				/>
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
					className={styles.field}
					label="Пароль"
					type="password"
					fullWidth
					error={Boolean(errors.password?.message)}
					helperText={errors.password?.message}
					{...register("password", { required: "Укажите пароль" })}
				/>
				<Button
					disabled={!isValid}
					type="submit"
					size="large"
					variant="contained"
					fullWidth
				>
					Зарегистрироваться
				</Button>
			</form>
		</Paper>
	);
});
