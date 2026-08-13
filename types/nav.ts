import { ComponentType } from "react";

export interface NavSubItem {
  title: string;
  url: string;
  isActive?: boolean;
}

export interface NavItem {
  title: string;
  url: string;
  icon?: ComponentType<{ className?: string }>;
  isActive?: boolean;
  items?: NavSubItem[];
}

export interface NavConfig {
  navMain: NavItem[];
}
// }: {
//   items: {
//     title: string
//     url: string
//     icon: React.ReactNode
//     isActive?: boolean
//     items?: {
//       title: string
//       url: string
//     }[]
//   }[]
// }) {
