"use client"

import { useState, useEffect } from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { createClient } from "@/lib/supabase/client"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { UserModel } from "@/types/UserModel";

export const description = "An interactive area chart"

interface ChartData {
    date: string
    viewer: number
    register: number
}

const chartConfig = {
    visitors: {
        label: "Visitors",
    },
    viewer: {
        label: "Viewer",
        color: "#00C951",
    },
    register: {
        label: "Register",
        color: "#7BF1A8",
    },
} satisfies ChartConfig

// 1. Create the date range (Jan to June 2024)
const createDateRange = () => {
    const start = new Date("2025-05-01")
    const end = new Date("2025-06-30")
    const map: Record<string, { visitor: number; registerUser: number }> = {}

    for (
        let d = new Date(start);
        d <= end;
        d.setDate(d.getDate() + 1)
    ) {
        const dateStr = d.toISOString().split("T")[0]
        map[dateStr] = { visitor: 0, registerUser: 0 }
    }

    return map
}

export function TotalVisitorChart({ data }: { data: UserModel[] }) {

    const [chartData, setChartData] = useState<ChartData[]>([])
    const [filteredData, setFilteredData] = useState<ChartData[]>([])
    const [timeRange, setTimeRange] = useState("7d")

    useEffect(() => {
        const fetchData = async () => {
            const supabase = createClient()
            try {
                const { data: viewer, error: viewerError } = await supabase
                    .from("visitors")
                    .select("id, created_at")

                if (viewerError) throw viewerError

                const grouped = createDateRange()

                // Dynamically calculate the start date based on the selected timeRange
                const referenceDate = new Date()
                let daysToSubtract = 90
                if (timeRange === "30d") {
                    daysToSubtract = 30
                } else if (timeRange === "7d") {
                    daysToSubtract = 7
                }
                const startDate = new Date(referenceDate)
                startDate.setDate(referenceDate.getDate() - daysToSubtract)

                const isInRange = (dateStr: string) => {
                    const date = new Date(dateStr)
                    return date >= startDate && date <= referenceDate
                }
                // Group visitor data
                viewer?.forEach((item) => {
                    const date = item.created_at.split("T")[0]
                    if (!isInRange(date)) return
                    if (!grouped[date]) grouped[date] = { visitor: 0, registerUser: 0 }
                    grouped[date].visitor += 1
                })
                // Group register user data (from props)
                data?.forEach((item) => {
                    const date = item.created_at.split("T")[0]
                    if (!isInRange(date)) return
                    if (!grouped[date]) grouped[date] = { visitor: 0, registerUser: 0 }
                    grouped[date].registerUser += 1
                })


                const allChartData: ChartData[] = Object.entries(grouped)
                    .map(([date, values]) => ({
                        date,
                        viewer: values.visitor,
                        register: values.registerUser,
                    }))
                    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

                setChartData(allChartData)
            } catch (error) {
                console.error("Error fetching visitor data:", error)
            }
        }

        fetchData()
    }, [data, timeRange])

    useEffect(() => {
        if (!chartData.length) return

        const filteredData = chartData.filter((item) => {
            const date = new Date(item.date)
            const referenceDate = new Date("2025-06-30")
            let daysToSubtract = 90
            if (timeRange === "30d") {
                daysToSubtract = 30
            } else if (timeRange === "7d") {
                daysToSubtract = 7
            }
            const startDate = new Date(referenceDate)
            startDate.setDate(startDate.getDate() - daysToSubtract)
            return date >= startDate
        })

        setFilteredData(filteredData)
    }, [timeRange, chartData])

    console.log("Visitor Chart Data:", chartData);

    return (
        <Card className="pt-0">
            <CardHeader className="flex items-center gap-2 border-b py-5 flex-col">
                <div className="grid flex-1 gap-1">
                    <CardTitle>Total Visitors</CardTitle>
                    <CardDescription>
                        Showing total visitors for the last 3 months
                    </CardDescription>
                </div>
                <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger
                        className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex"
                        aria-label="Select a value"
                    >
                        <SelectValue placeholder="Last 7 days" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                        <SelectItem value="7d" className="rounded-lg">
                            Last 7 days
                        </SelectItem>
                        <SelectItem value="30d" className="rounded-lg">
                            Last 30 days
                        </SelectItem>
                        <SelectItem value="90d" className="rounded-lg">
                            Last 3 months
                        </SelectItem>
                    </SelectContent>
                </Select>
            </CardHeader>
            <CardContent className="px-2 sm:px-6">
                <ChartContainer
                    config={chartConfig}
                    className="aspect-auto h-[250px] w-full"
                >
                    <AreaChart data={filteredData}>
                        <defs>
                            <linearGradient id="fillViewer" x1="0" y1="0" x2="0" y2="1">
                                <stop
                                    offset="5%"
                                    stopColor="#00C951"
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="#00C951"
                                    stopOpacity={0.1}
                                />
                            </linearGradient>
                            <linearGradient id="fillRegister" x1="0" y1="0" x2="0" y2="1">
                                <stop
                                    offset="5%"
                                    stopColor="#7BF1A8"
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="#7BF1A8"
                                    stopOpacity={0.1}
                                />
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            minTickGap={32}
                            tickFormatter={(value) => {
                                const date = new Date(value)
                                return date.toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                })
                            }}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent
                                    labelFormatter={(value) => {
                                        return new Date(value).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                        })
                                    }}
                                    indicator="dot"
                                />
                            }
                        />
                        <Area
                            dataKey="register"
                            type="natural"
                            fill="url(#fillRegister)"
                            stroke="var(--color-register)"
                            stackId="a"
                        />
                        <Area
                            dataKey="viewer"
                            type="natural"
                            fill="url(#fillViewer)"
                            stroke="var(--color-viewer)"
                            stackId="a"
                        />
                        <ChartLegend content={<ChartLegendContent />} />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
