import React from "react";

export interface NavSubItem {
  title: string;
  url: string;
  isActive?: boolean;
}

export interface NavItem {
  title: string;
  url: string;
  icon?: React.ReactNode | React.ElementType;
  isActive?: boolean;
  items?: NavSubItem[];
}

export interface NavConfig {
  navMain: NavItem[];
}
