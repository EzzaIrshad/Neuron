"use client"

import { TrendingUp } from "lucide-react"
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

import { UserModel } from "@/types/UserModel"
 import { format } from "date-fns";

export const description = "A radar chart with lines only"

const chartConfig = {
  free: {
    label: "Free",
    color: "#8EC5FF",
  },
  paid: {
    label: "Paid",
    color: "#2B7FFF",
  },
} satisfies ChartConfig


export function UserMonthChart({ data }: { data: UserModel[] })  {
   
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
  ];

// Pre-populated dummy users for Jan-May
  const dummyUsers = [
    { created_at: "2025-01-15", current_package: "free" },
    { created_at: "2025-01-20", current_package: "paid" },
    { created_at: "2025-02-05", current_package: "free" },
    { created_at: "2025-02-18", current_package: "free" },
    { created_at: "2025-03-10", current_package: "paid" },
    { created_at: "2025-03-21", current_package: "paid" },
    { created_at: "2025-04-09", current_package: "free" },
    { created_at: "2025-04-22", current_package: "free" },
    { created_at: "2025-05-11", current_package: "paid" },
    { created_at: "2025-05-30", current_package: "free" },
    { created_at: "2025-01-08", current_package: "free" },
    { created_at: "2025-01-25", current_package: "paid" },
    { created_at: "2025-02-12", current_package: "paid" },
    { created_at: "2025-02-27", current_package: "free" },
    { created_at: "2025-03-05", current_package: "free" },
    { created_at: "2025-03-18", current_package: "paid" },
    { created_at: "2025-04-15", current_package: "paid" },
    { created_at: "2025-04-28", current_package: "free" },
    { created_at: "2025-05-03", current_package: "free" },
    { created_at: "2025-05-19", current_package: "paid" },
  ]

const mergedUsers = [...dummyUsers, ...(Array.isArray(data) ? data : [])]

  // Build the stats using a default base for all months
  const defaultData: Record<
    string,
    { month: string; paid: number; free: number; pending: number }
  > = months.reduce((acc, month) => {
    acc[month] = { month, paid: 0, free: 0, pending: 0 }
    return acc
  }, {} as Record<string, { month: string; paid: number; free: number; pending: number }>)

  const mergedData = mergedUsers.reduce((acc, user) => {
    const month = format(new Date(user.created_at), "MMMM")

    if (!acc[month]) {
      acc[month] = { month, paid: 0, free: 0, pending: 0 }
    }

    if (user.current_package === "paid") {
      acc[month].paid += 3
    } else if (user.current_package === "unpaid") {
      acc[month].pending += 5
    } else {
      acc[month].free += 1
    }

    return acc
  }, { ...defaultData })

  const chartData = months.map((month) => mergedData[month])

const date = new Date();

  return (
    <Card>
      <CardHeader className="items-center">
        <CardTitle>Monthly</CardTitle>
        <CardDescription>
          Showing user from Jan-Jun 2025
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadarChart data={chartData}>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <PolarAngleAxis dataKey="month" />
            <PolarGrid radialLines={false} />

            <Radar
              dataKey="paid"
              fill="var(--color-paid)"
              fillOpacity={0}
              stroke="var(--color-paid)"
              strokeWidth={2}
            />
            <Radar
              dataKey="free"
              fill="var(--color-free)"
              fillOpacity={0}
              stroke="var(--color-free)"
              strokeWidth={2}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Trending up by 0.1% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground flex items-center gap-2 leading-none">
              {format(date, "MMMM yyyy")} 
        </div>
      </CardFooter>
    </Card>
  )
}

