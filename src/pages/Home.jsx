import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";

import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Grid from "@mui/material/Grid";

import { Post } from "../components/Post";
import { TagsBlock } from "../components/TagsBlock";
import { CommentsBlock } from "../components/CommentsBlock";

import { postsStore } from "../store/posts";
import { authStore } from "../store/auth";

export const Home = observer(() => {
	useEffect(() => {
		postsStore.getPosts();
		postsStore.getTags();
	}, []);

	const posts = postsStore.posts;
	const tags = postsStore._tags;
	const pending = postsStore._pending;
	const userData = authStore._data;

	return (
		<>
			<Tabs
				style={{ marginBottom: 15 }}
				value={0}
				aria-label="basic tabs example"
			>
				<Tab label="Новые" />
				<Tab label="Популярные" />
			</Tabs>
			<Grid container spacing={4}>
				<Grid xs={8} item>
					{(pending ? [...Array(5)] : posts).map((post, index) =>
						pending ? (
							<Post key={index} isLoading={true} />
						) : (
							<Post
								key={`id-${Math.random()}`}
								id={post._id}
								title={post.title}
								imageUrl={
									post.imageUrl && `http://localhost:4444${post.imageUrl}`
								}
								user={post.user}
								createdAt={post.createdAt}
								viewsCount={post.viewsCount}
								commentsCount={3}
								tags={post.tags}
								isEditable={userData?._id === post.user._id}
							/>
						)
					)}
				</Grid>
				<Grid xs={4} item>
					<TagsBlock items={tags} isLoading={pending} />
					<CommentsBlock
						items={[
							{
								user: {
									fullName: "Вася Пупкин",
									avatarUrl: "https://mui.com/static/images/avatar/1.jpg",
								},
								text: "Это тестовый комментарий",
							},
							{
								user: {
									fullName: "Иван Иванов",
									avatarUrl: "https://mui.com/static/images/avatar/2.jpg",
								},
								text: "When displaying three lines or more, the avatar is not aligned at the top. You should set the prop to align the avatar at the top",
							},
						]}
						isLoading={false}
					/>
				</Grid>
			</Grid>
		</>
	);
});
