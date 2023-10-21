export type AddPostEvent = {
  type: "AddPost";
  post_type: "blog" | "tour" | "enquire";
};

export type AddCommentEvent = {
  type: "AddComment";
};
