import Image from "next/image";
import { Users, TrendingUp, Calendar, Activity, ArrowRight, Sparkles } from "lucide-react";

export default function Home() {
  const stats = [
    { name: "Total Contacts", value: "2,651", change: "+12%", icon: Users },
    { name: "Active Leads", value: "845", change: "+8%", icon: TrendingUp },
    { name: "This Month", value: "124", change: "+23%", icon: Calendar },
    { name: "Conversion Rate", value: "18.2%", change: "+5%", icon: Activity },
  ];

  const quickActions = [
    { name: "Add New Contact", href: "/contacts/new", icon: Users, color: "bg-blue-600" },
    { name: "View Reports", href: "/reports", icon: TrendingUp, color: "bg-green-600" },
    { name: "Schedule Follow-up", href: "/calendar", icon: Calendar, color: "bg-purple-600" },
  ];

  return (
    <div className="min-h-full bg-slate-950">
      {/* Hero Section */}
      <div className="relative px-6 py-12 sm:px-8 lg:px-12">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-32 w-96 h-96 bg-gradient-to-br from-blue-600/10 to-purple-600/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-gradient-to-br from-green-600/10 to-blue-600/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                GoCRM
              </h1>
            </div>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Welcome back! Here's what's happening with your business today.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.name}
                  className="bg-slate-900/60 backdrop-blur-sm border border-slate-800/60 rounded-xl p-6 hover:bg-slate-900/80 transition-all duration-300 group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5 text-blue-400" />
                    </div>
                    <span className="text-green-400 text-sm font-medium">
                      {stat.change}
                    </span>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white mb-1">
                      {stat.value}
                    </p>
                    <p className="text-slate-400 text-sm">
                      {stat.name}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Actions */}
          <div className="bg-slate-900/40 backdrop-blur-sm border border-slate-800/60 rounded-2xl p-8 mb-12">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Activity className="w-6 h-6 text-blue-400" />
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <a
                    key={action.name}
                    href={action.href}
                    className="group flex items-center gap-4 p-4 bg-slate-800/40 hover:bg-slate-800/60 border border-slate-700/60 rounded-xl transition-all duration-300 hover:border-slate-600/60"
                  >
                    <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium group-hover:text-blue-300 transition-colors">
                        {action.name}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Getting Started Section */}
          <div className="bg-slate-900/40 backdrop-blur-sm border border-slate-800/60 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">
              Getting Started
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left side - Steps */}
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    1
                  </div>
                  <div>
                    <h3 className="text-white font-medium mb-1">
                      Import your contacts
                    </h3>
                    <p className="text-slate-400 text-sm">
                      Upload your existing contact list or add them manually.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    2
                  </div>
                  <div>
                    <h3 className="text-white font-medium mb-1">
                      Organize your pipeline
                    </h3>
                    <p className="text-slate-400 text-sm">
                      Set up your sales stages and track deal progress.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    3
                  </div>
                  <div>
                    <h3 className="text-white font-medium mb-1">
                      Start engaging
                    </h3>
                    <p className="text-slate-400 text-sm">
                      Reach out to leads and track all interactions.
                    </p>
                  </div>
                </div>
              </div>

              {/* Right side - CTA */}
              <div className="flex flex-col justify-center">
                <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-xl p-6 text-center">
                  <h3 className="text-xl font-bold text-white mb-2">
                    Ready to get started?
                  </h3>
                  <p className="text-slate-300 mb-4">
                    Add your first contact and begin building relationships.
                  </p>
                  <a
                    href="/contacts"
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    <Users className="w-4 h-4" />
                    Go to Contacts
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}