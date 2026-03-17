import { User } from './user';

export type ActivityType = {
  id: string;
  category: string;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
  user: User;
  details: ActivityDetailsType;
};

export type ActivityDetailsType =
  | WalkingActivityDetailsType
  | RunningActivityDetailsType
  | HikingActivityDetailsType
  | CyclingActivityDetailsType
  | SwimmingActivityDetailsType;

export type WalkingActivityDetailsType = {
  distance: number;
  duration: number;
};

export type RunningActivityDetailsType = {
  distance: number;
  duration: number;
};

export type HikingActivityDetailsType = {
  distance: number;
  duration: number;
  location: string;
};

export type CyclingActivityDetailsType = {
  distance: number;
  duration: number;
};

export type SwimmingActivityDetailsType = {
  distance: number;
  duration: number;
};

export type CreateActivityState = {
  errors: Record<string, string[] | undefined>;
  message: string;
  data: { title: string; description: string; category: string };
  ok: boolean;
};
