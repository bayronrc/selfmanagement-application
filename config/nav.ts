import { NavConfig } from "@/types/nav";
import {
  Braces,
  ClipboardListIcon,
  FolderKanban,
} from "lucide-react";

export const navConfig: NavConfig = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: FolderKanban,
    },
    {
      title: "Órdenes",
      url: "/ordenes",
      icon: ClipboardListIcon,
      items: [
        {
          title: "Cargar Órdenes",
          url: "/ordenes/upload",
        },
      ],
    },
    {
      title: "RIPS",
      url: "/rips",
      icon: Braces,
    },
  ],
};
