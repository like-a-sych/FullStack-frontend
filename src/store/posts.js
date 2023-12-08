import { makeAutoObservable, runInAction } from "mobx";
import axios from "../axios";

class Posts {
	constructor() {
		makeAutoObservable(this);
	}
	_pending = false;
	_posts = [];
	_tags = [];

	get pending() {
		return this._pending;
	}
	get posts() {
		return this._posts;
	}
	get tags() {
		return this._tags;
	}

	set pending(bool) {
		runInAction(() => {
			this._pending = bool;
		});
	}
	set posts(posts) {
		runInAction(() => {
			this._posts = posts;
		});
	}
	set tags(tags) {
		runInAction(() => {
			this._tags = tags;
		});
	}

	async getPosts() {
		this.pending = true;
		try {
			const data = await axios.get("/posts");
			this.posts = data.data;
		} catch (error) {
			console.log(error);
		} finally {
			this.pending = false;
		}
	}

	async removePost(id) {
		await axios.delete(`/posts/${id}`);
	}

	async getTags() {
		this.pending = true;
		try {
			const data = await axios.get("/tags");
			this.tags = data.data;
		} catch (error) {
			console.log(error);
		} finally {
			this.pending = false;
		}
	}
}

export const postsStore = new Posts();
