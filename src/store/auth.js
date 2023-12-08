import { makeAutoObservable, runInAction } from "mobx";
import axios from "../axios";

class Authorization {
	constructor() {
		makeAutoObservable(this);
	}

	_pending = false;
	_data = null;
	_errorMsg = "";

	get isAuth() {
		return this._data !== null;
	}

	get userData() {
		return this._data;
	}
	get errorMsg() {
		return this._errorMsg;
	}

	get pending() {
		return this._pending;
	}

	set pending(bool) {
		runInAction(() => {
			this._pending = bool;
		});
	}
	set userData(data) {
		runInAction(() => {
			this._data = data;
		});
	}
	set errorMsg(data) {
		runInAction(() => {
			this._errorMsg = data;
		});
	}

	logOut() {
		this.userData = null;
	}

	async getUserData(params) {
		this.pending = true;
		try {
			const data = await axios.post("/auth/login", params);
			this.userData = data.data;
		} catch (error) {
			this.errorMsg = error.response.data;
		} finally {
			this.pending = false;
		}
	}
	async getAuth() {
		this.pending = true;
		try {
			const data = await axios.get("/auth/me");
			this.userData = data.data;
		} catch (error) {
		} finally {
			this.pending = false;
		}
	}
}

export const authStore = new Authorization();
