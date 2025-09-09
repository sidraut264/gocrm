"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  Home, 
  Users, 
  TrendingUp, 
  Calendar, 
  Settings, 
  HelpCircle,
  ChevronLeft,
  Plus,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const navItems = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/contacts", label: "Contacts", icon: Users, badge: "124" },
  { href: "/deals", label: "Deals", icon: TrendingUp, badge: "32" },
  { href: "/calendar", label: "Calendar", icon: Calendar },
];

const bottomNavItems = [
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/help", label: "Help & Support", icon: HelpCircle },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={cn(
      "h-screen border-r border-slate-800/60 bg-slate-900/95 backdrop-blur-sm flex flex-col transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="flex h-16 items-center justify-between px-6  border-b border-slate-800/60">
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">GoCRM</span>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
        )}
        
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg hover:bg-slate-800/60 transition-all duration-200 text-slate-400 hover:text-white hover:scale-105"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <ChevronLeft className={cn(
            "h-4 w-4 transition-transform duration-200",
            collapsed && "rotate-180"
          )} />
        </button>
      </div>

      {/* Quick Actions */}
      {!collapsed && (
        <div className="px-4 py-4 border-b border-slate-800/60">
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white gap-2 justify-start transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/25">
            <Plus className="h-4 w-4" />
            Add Contact
          </Button>
        </div>
      )}

      {/* Main Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || 
            (item.href !== "/" && pathname.startsWith(item.href));
          
          return (
            <div key={item.href} className="relative">
              <Link
                href={item.href}
                className={cn(
                  "group relative flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200 overflow-hidden",
                  isActive
                    ? "bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-white border border-blue-500/30 shadow-lg shadow-blue-500/10"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/60 hover:scale-[1.02]",
                  collapsed && "justify-center px-3"
                )}
              >
                {/* Active indicator bar */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-blue-400 to-purple-500 rounded-r-full" />
                )}
                
                {/* Icon with hover animation */}
                <Icon className={cn(
                  "h-5 w-5 transition-all duration-200 flex-shrink-0",
                  isActive 
                    ? "text-blue-400" 
                    : "text-slate-400 group-hover:text-white group-hover:scale-110"
                )} />
                
                {!collapsed && (
                  <div className="flex items-center justify-between w-full">
                    <span className="transition-colors duration-200">{item.label}</span>
                    {item.badge && (
                      <span className={cn(
                        "px-2 py-1 text-xs rounded-lg font-medium transition-all duration-200",
                        isActive 
                          ? "bg-blue-500/20 text-blue-300 border border-blue-500/30" 
                          : "bg-slate-800 text-slate-300 group-hover:bg-slate-700 group-hover:scale-105"
                      )}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </Link>
              
              {/* Tooltip for collapsed state */}
              {collapsed && (
                <div className="absolute left-full ml-2 px-3 py-2 bg-slate-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-50 border border-slate-700/60 shadow-lg">
                  {item.label}
                  <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2 w-2 h-2 bg-slate-800 rotate-45 border-l border-b border-slate-700/60" />
                </div>
              )}
            </div>
          );
        })}
        
        {/* Recent Activity */}
        {!collapsed && (
          <>
            <div className="my-6 border-t border-slate-800/60" />
            
            <div className="space-y-3">
              <div className="px-3">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Recent Activity
                </h3>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800/40 transition-all duration-200 cursor-pointer group hover:scale-[1.01]">
                  <div className="w-2 h-2 bg-green-500 rounded-full transition-transform duration-200 group-hover:scale-125"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-300 group-hover:text-white transition-colors duration-200 truncate">New contact added</p>
                    <p className="text-xs text-slate-500">2 min ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800/40 transition-all duration-200 cursor-pointer group hover:scale-[1.01]">
                  <div className="w-2 h-2 bg-blue-500 rounded-full transition-transform duration-200 group-hover:scale-125"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-300 group-hover:text-white transition-colors duration-200 truncate">Deal updated</p>
                    <p className="text-xs text-slate-500">5 min ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800/40 transition-all duration-200 cursor-pointer group hover:scale-[1.01]">
                  <div className="w-2 h-2 bg-orange-500 rounded-full transition-transform duration-200 group-hover:scale-125"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-300 group-hover:text-white transition-colors duration-200 truncate">Follow-up due</p>
                    <p className="text-xs text-slate-500">1 hour ago</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </nav>

      {/* Bottom Navigation */}
      <div className="p-4 border-t border-slate-800/60 space-y-2">
        {bottomNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <div key={item.href} className="relative group">
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-slate-800/60 text-white"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/40 hover:scale-[1.02]",
                  collapsed && "justify-center"
                )}
              >
                <Icon className="h-4 w-4 flex-shrink-0 transition-transform duration-200 group-hover:scale-110" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
              
              {/* Tooltip for collapsed state */}
              {collapsed && (
                <div className="absolute left-full ml-2 px-3 py-2 bg-slate-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-50 border border-slate-700/60 shadow-lg">
                  {item.label}
                  <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2 w-2 h-2 bg-slate-800 rotate-45 border-l border-b border-slate-700/60" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Upgrade CTA - Simplified */}
      {!collapsed && (
        <div className="p-4">
          <div className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-xl p-4 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/10">
            <div className="text-center">
              <h4 className="text-sm font-semibold text-white mb-1">Upgrade to Pro</h4>
              <p className="text-xs text-slate-300 mb-3">Get unlimited contacts and advanced features</p>
              <Button size="sm" className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-xs transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25">
                Upgrade Now
              </Button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}