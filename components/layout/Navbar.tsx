"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, Search, Settings, User, LogOut, Menu } from "lucide-react";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Navbar() {
  const [searchFocused, setSearchFocused] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await signOut({
        redirect: false,
        callbackUrl: "/login",
      });

      toast.success("Logged out successfully", {
        description: "See you next time!",
      });

      router.push("/login");
    } catch (error) {
      toast.error("Logout failed", {
        description: "Please try again",
      });
    } finally {
      setLoggingOut(false);
    }
  };

  const userInitials =
    session?.user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "U";

  return (
    <header className="sticky top-0 z-30 bg-slate-900/80 backdrop-blur-lg border-b border-slate-800/60">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Left side */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all duration-200 hover:scale-105"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Open menu</span>
          </Button>

          <div className="hidden sm:block">
            <h1 className="text-lg font-semibold text-white flex items-center gap-2">
              Welcome back 👋 {session?.user?.name || ""}
            </h1>
            <p className="text-sm text-slate-400 hidden md:block">{today}</p>
          </div>
        </div>

        {/* Center - Search */}
        <div className="flex-1 max-w-2xl mx-4 hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search contacts, deals, or notes..."
              className={`
                w-full pl-10 pr-4 py-2.5 bg-slate-800/60 border rounded-lg text-white placeholder-slate-400 
                focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200
                hover:bg-slate-800/80
                ${searchFocused ? "border-blue-500/50 bg-slate-800/80" : "border-slate-700/60"}
              `}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all duration-200 hover:scale-105"
          >
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="relative p-2 text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all duration-200 hover:scale-105"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            <span className="sr-only">Notifications</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="hidden sm:flex p-2 text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all duration-200 hover:scale-105"
          >
            <Settings className="h-5 w-5" />
            <span className="sr-only">Settings</span>
          </Button>

          {/* Profile dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-3 p-2 hover:bg-slate-800/60 rounded-lg transition-all duration-200 hover:scale-[1.02]"
              >
                <Avatar className="h-8 w-8 ring-2 ring-transparent hover:ring-blue-500/30 transition-all duration-200">
                  {session?.user?.image ? (
                    <AvatarImage src={session.user.image} alt={session.user.name || "User"} />
                  ) : (
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm font-medium">
                      {userInitials}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-white">{session?.user?.name || "User"}</p>
                  <p className="text-xs text-slate-400">{session?.user?.email || ""}</p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 bg-slate-900/95 backdrop-blur-sm border border-slate-800/60 text-white shadow-xl"
            >
              <div className="px-2 py-2">
                <p className="text-sm font-medium">{session?.user?.name}</p>
                <p className="text-xs text-slate-400">{session?.user?.email}</p>
              </div>
              <DropdownMenuSeparator className="bg-slate-800/60" />

              <DropdownMenuItem className="text-slate-300 hover:text-white hover:bg-slate-800/60 cursor-pointer transition-all duration-200">
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>

              <DropdownMenuItem className="text-slate-300 hover:text-white hover:bg-slate-800/60 cursor-pointer transition-all duration-200">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>

              <DropdownMenuSeparator className="bg-slate-800/60" />

              <DropdownMenuItem
                onClick={handleLogout}
                disabled={loggingOut}
                className="text-red-400 hover:text-red-300 hover:bg-red-500/10 cursor-pointer transition-all duration-200 focus:bg-red-500/10 focus:text-red-300"
              >
                <LogOut className={`mr-2 h-4 w-4 ${loggingOut ? "animate-spin" : ""}`} />
                {loggingOut ? "Logging out..." : "Logout"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
