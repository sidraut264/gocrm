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
import { User, LogOut, Menu } from "lucide-react";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Navbar() {
  const [loggingOut, setLoggingOut] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await signOut({
        redirect: false,
        callbackUrl: "/login",
      });

      toast.success("Logged out successfully");
      router.push("/login");
    } catch (error) {
      toast.error("Logout failed");
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
    <header className="sticky top-0 z-30 bg-slate-900 border-b border-slate-800">
      <div className="flex h-14 items-center justify-between px-4 sm:px-6">
        {/* Left side */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Open menu</span>
          </Button>

          <div className="hidden sm:block">
            <h1 className="text-sm font-medium text-slate-200">
              Welcome back,{" "}
              <span className="font-semibold">
                {session?.user?.name || "User"}
              </span>
            </h1>
          </div>
        </div>

        {/* Right side - Profile */}
        <div className="flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-3 p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800"
              >
                <Avatar className="h-8 w-8">
                  {session?.user?.image ? (
                    <AvatarImage
                      src={session.user.image}
                      alt={session.user.name || "User"}
                    />
                  ) : (
                    <AvatarFallback className="bg-blue-600 text-white text-sm font-medium">
                      {userInitials}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-slate-200">
                    {session?.user?.name || "User"}
                  </p>
                  <p className="text-xs text-slate-400">
                    {session?.user?.email || ""}
                  </p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 bg-slate-900 border border-slate-800 text-slate-200"
            >
              <div className="px-2 py-2">
                <p className="text-sm font-medium">{session?.user?.name}</p>
                <p className="text-xs text-slate-400">{session?.user?.email}</p>
              </div>
              <DropdownMenuSeparator className="bg-slate-800" />

              <DropdownMenuItem className="cursor-pointer text-slate-300 hover:bg-slate-800 hover:text-white">
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>

              <DropdownMenuSeparator className="bg-slate-800" />

              <DropdownMenuItem
                onClick={handleLogout}
                disabled={loggingOut}
                className="cursor-pointer text-red-400 hover:bg-red-500/10 hover:text-red-300"
              >
                <LogOut
                  className={`mr-2 h-4 w-4 ${
                    loggingOut ? "animate-spin" : ""
                  }`}
                />
                {loggingOut ? "Logging out..." : "Logout"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
