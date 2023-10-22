export type AddPostEvent = {
  type: "AddPost";
  post_type: "blog" | "tour" | "enquire";
};
export type MapEvent = {
  type: "FetchMap";
  map_type: "given" | "current" | "clickIn";
};

export type AddCommentEvent = {
  type: "AddComment";
};

export type LikeEvent = {
  type: "Like";
};

export type BookmarkEvent = {
  type: "Bookmark";
};
