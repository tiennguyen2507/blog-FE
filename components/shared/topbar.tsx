"use client";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { AppSwitcher } from "./app-switcher";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function Topbar() {
  const router = useRouter();
  const [user, setUser] = useState<{
    avatar?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
  } | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        try {
          setUser(JSON.parse(userStr));
        } catch {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    }
  }, []);

  return (
    <div className="flex h-14 items-center justify-between border-b px-4">
      {/* Search */}
      <div className="flex items-center max-w-xl">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Search..."
            className="pl-8 bg-gray-50/50"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* App Switcher */}
        {/* <AppSwitcher /> */}

        {/* Notifications */}
        {/* <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-600" />
        </Button> */}

        {/* Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar>
                {user?.avatar ? (
                  <AvatarImage src={user.avatar} alt="avatar" />
                ) : (
                  <AvatarFallback>{user?.firstName?.[0] || "U"}</AvatarFallback>
                )}
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            <div className="flex flex-col items-center gap-1 p-2">
              <Avatar className="h-12 w-12">
                {user?.avatar ? (
                  <AvatarImage src={user.avatar} alt="avatar" />
                ) : (
                  <AvatarFallback>{user?.firstName?.[0] || "U"}</AvatarFallback>
                )}
              </Avatar>
              {user && (
                <>
                  <div className="font-semibold mt-1">
                    {user.firstName} {user.lastName}
                  </div>
                  <div className="text-xs text-gray-500">{user.email}</div>
                </>
              )}
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600"
              onClick={() => {
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");
                localStorage.removeItem("user");
                router.push("/login");
              }}
            >
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
