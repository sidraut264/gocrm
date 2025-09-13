"use client";

import useSWR from "swr";
import { Users, TrendingUp, ArrowRight } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Home() {
  const { data, error } = useSWR("/api/dashboard", fetcher);

  const stats = [
    {
      name: "Total Contacts",
      value: data?.totalContacts ?? "—",
      icon: Users,
    },
    {
      name: "Active Deals",
      value: data?.activeDeals ?? "—",
      icon: TrendingUp,
    },
  ];

  return (
    <div className="min-h-full bg-background">
      <div className="px-6 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Dashboard
            </h1>
            <p className="text-muted-foreground">
              Welcome back! Here's an overview of your CRM.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.name}
                  className="bg-card border rounded-lg p-6 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5 text-muted-foreground" />
                    </div>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-card-foreground mb-1">
                      {stat.value}
                    </p>
                    <p className="text-muted-foreground text-sm">{stat.name}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Actions */}
          <div className="bg-card border rounded-lg p-8 mb-12">
            <h2 className="text-xl font-semibold text-card-foreground mb-6">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a
                href="/contacts"
                className="group flex items-center gap-4 p-4 bg-muted hover:bg-muted/80 rounded-lg transition-all duration-200"
              >
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                    View Contacts
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </a>
              
              <a
                href="/deals"
                className="group flex items-center gap-4 p-4 bg-muted hover:bg-muted/80 rounded-lg transition-all duration-200"
              >
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                    View Deals
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </a>
            </div>
          </div>

          {/* Getting Started Section */}
          <div className="bg-card border rounded-lg p-8">
            <h2 className="text-xl font-semibold text-card-foreground mb-6">
              Getting Started
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left side - Steps */}
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-medium">
                    1
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground mb-1">
                      Add your contacts
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Start building your contact database by adding customer information.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-medium">
                    2
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground mb-1">
                      Track your deals
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Monitor your sales opportunities and track their progress.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-medium">
                    3
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground mb-1">
                      Grow your business
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Use insights from your CRM to make better business decisions.
                    </p>
                  </div>
                </div>
              </div>

              {/* Right side - CTA */}
              <div className="flex flex-col justify-center">
                <div className="bg-muted border rounded-lg p-6 text-center">
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Ready to get started?
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Add your first contact and begin building relationships.
                  </p>
                  <a
                    href="/contacts"
                    className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2.5 rounded-lg font-medium transition-colors"
                  >
                    <Users className="w-4 h-4" />
                    Go to Contacts
                    <ArrowRight className="w-4 w-4" />
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