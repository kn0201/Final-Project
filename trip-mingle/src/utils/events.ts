import { LatLng } from "react-native-maps";

export type AddPostEvent = {
  type: "AddPost";
  post_type: "blog" | "tour" | "enquire";
};
export type MapEvent = {
  type: "FetchMap";
  map_type: "given" | "current" | "clickIn";
};
export type MapPositionEvent = {
  type: "MapPosition";
  center: LatLng;
};

export type AddCommentEvent = {
  type: "AddComment";
};

export type LikeEvent = {
  type: "Like";
  post_id: number;
  number_of_like: number;
};

export type BookmarkEvent = {
  type: "Bookmark";
};

export type ApplyTourEvent = {
  type: "ApplyTour";
};

export type SaveLocationEvent = {
  type: "SaveLocation";
};

export type AcceptEvent = {
  type: "Accept";
};

export type LoginEvent = {
  type: "Login";
};

export type UpdateProfileEvent = {
  type: "UpdateProfile";
};
export type AddSnapEvent = {
  type: "AddSnap";
};
export type DeleteEvent = {
  type: "Delete";
};

export type ConfirmEvent = {
  type: "Confirm";
};

export type RejectEvent = {
  type: "Reject";
};

export type CloseEvent = {
  type: "Close";
};

export type RatingEvent = {
  type: "Rating";
};

export type AddPlanEvent = {
  type: "AddPlan";
};
