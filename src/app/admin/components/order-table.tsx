import * as React from "react"
import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { useIsMobile } from "@/hooks/use-mobile"
import { CSS } from "@dnd-kit/utilities"
import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconDotsVertical,
  IconGripVertical,
  IconLayoutColumns,
  IconPlus,
} from "@tabler/icons-react"
import {
  ColumnDef,
  ColumnFiltersState,
  FilterFn,
  Row,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { z } from "zod"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

import { ArrowUpDown, CalendarIcon } from "lucide-react"

import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import SearchInput from "@/components/ui/search-input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { useProfileStore } from "@/stores/useProfileStore"
import { Separator } from "@/components/ui/separator"

function ActionsCell({ row }: { row: Row<z.infer<typeof userSchema>> }) {
  const disableUser = useProfileStore((state) => state.disableUser);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
          size="icon"
          disabled={!row.original.is_active}
        >
          <IconDotsVertical />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-32">
        <DropdownMenuItem>Edit</DropdownMenuItem>
        <DropdownMenuItem>Make a copy</DropdownMenuItem>
        <DropdownMenuItem>Favorite</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onClick={() => disableUser(row.original.id)}
          disabled={!row.original.is_active}
        >
          Disable User
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export const userSchema = z.object({
  id: z.string(),
  full_name: z.string().nullable(),
  email: z.string().email(),
  avatar_url: z.string().nullable(),
  role: z.object({
    role_name: z.enum(['admin', 'user', 'editor']),
  }),
  is_active: z.boolean(),
  storage_limit_gb: z.number(),
  storage_used_gb: z.number(),
  current_package: z.string(),
  package_expiry_date: z.string().nullable(), // ISO string
  plan_started_at: z.string().nullable(),     // ISO string
  payment_status: z.enum(['paid', 'unpaid', 'cancel']),
  is_email_verified: z.boolean(),
  last_login: z.string().nullable(),
  signup_source: z.string().nullable(),
  referral_code: z.string().nullable(),
  referred_by: z.string().nullable(),
  country: z.string().nullable(),
  phone_number: z.string().nullable(),
  organization: z.string().nullable(),
  website: z.string().nullable(),
  bio: z.string().nullable(),
  profile_completed: z.boolean(),
  preferred_language: z.string(),
  price: z.number(),
  order_number: z.number(),
  created_at: z.string(),
});

// Create a separate component for the drag handle
function DragHandle({ id, disabled }: { id: number, disabled?: boolean }) {
  const { attributes, listeners } = useSortable({
    id,
  })

  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon"
      className="text-muted-foreground size-7 hover:bg-transparent"
      disabled={disabled}
    >
      <IconGripVertical className="text-muted-foreground size-3" />
      <span className="sr-only">Drag to reorder</span>
    </Button>
  )
}

// Custom Date Range Filter Function
const dateRangeFilter: FilterFn<z.infer<typeof userSchema>> = (row, columnId, value) => {
  const date = new Date(row.getValue(columnId)).getTime()
  const start = value?.start ? new Date(value.start).getTime() : -Infinity
  const end = value?.end ? new Date(value.end).getTime() : Infinity
  return date >= start && date <= end
}

const columns: ColumnDef<z.infer<typeof userSchema>>[] = [
  {
    id: "drag",
    header: () => null,
    cell: ({ row }) => <DragHandle id={row.index + 1} disabled={!row.original.is_active}/>,
  },
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          disabled={!row.original.is_active}
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "order",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Order
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => {
      return <div className="underline">#{String(row.original.order_number).padStart(4, "0")}</div>
    },
    enableHiding: false,

  },
  {
    accessorKey: "cutomer",
    header: "Customer",
    cell: ({ row }) => {
      return <TableCellViewer item={row.original} />
    },
    enableHiding: false,
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => (
      <div className="flex flex-col gap-1">
        <div className="font-medium">{new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(row.original.created_at))}</div>
        <div className="text-gray-500">{new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).format(new Date(row.original.created_at)).toLowerCase()}</div>
      </div>
    ),
    filterFn: dateRangeFilter
  },
  {
    accessorKey: "storage",
    header: () => <div className="w-full text-left">Storage</div>,
    cell: ({ row }) => (
      <div>{row.original.storage_limit_gb} GB</div>
    ),
  },
  {
    accessorKey: "price",
    header: () => <div className="w-full text-left">Price</div>,
    cell: ({ row }) => (
      row.original.price === 0 ? <Badge variant={"outline"}>Free</Badge> :
        <div className="text-[16px] text-gray-800">${row.original.price}</div>
    ),
  },
  {
    accessorKey: "package",
    header: () => <div className="w-full text-left">Package</div>,
    cell: ({ row }) => (
      row.original.current_package === "free" ?
        <Badge variant={"outline"}>Basic</Badge> :
        row.original.current_package === "personal" ?
          <Badge variant={"outline"}>Personal</Badge> :
          <Badge variant={"outline"}>Standard</Badge>
    ),
  },
  {
    accessorKey: "status",
    header: () => <div className="w-full text-left">Staus</div>,
    cell: ({ row }) => (
      row.original.payment_status === 'unpaid' && row.original.price === 0 ?
        <Badge variant={"outline"}>Free</Badge> :
        row.original.payment_status === 'paid' ?
          <Badge variant={"outline"} className="bg-green-100">Paid</Badge> :
          row.original.payment_status === 'cancel' ?
            <Badge variant={"outline"} className="bg-red-100">Cancel</Badge> :
            <Badge variant={"outline"} className="bg-amber-100">Pending</Badge>
    ),
  },
 {
  id: "actions",
  cell: ({ row }) => <ActionsCell row={row} />
},
]

function DraggableRow({ row }: { row: Row<z.infer<typeof userSchema>> }) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.id,
  })

  return (
    <TableRow
      data-state={row.getIsSelected() && "selected"}
      data-disabled={!row.original.is_active}
      data-dragging={isDragging}
      ref={setNodeRef}
      className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80 data-[disabled=true]:opacity-60"
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  )
}


function formatDate(date: Date | undefined) {
  if (!date) {
    return ""
  }

  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })
}

function isValidDate(date: Date | undefined) {
  if (!date) {
    return false
  }
  return !isNaN(date.getTime())
}

// Tab type constants to avoid magic strings
const tabTypes = {
  ALL: 'all',
  INACTIVE: 'inactive',
  PAID: 'paid',
  PENDING: 'pending',
  CANCEL: 'cancel',
  FREE: 'free',
}

export default function OrderTable({
  data: initialData,
}: {
  data: z.infer<typeof userSchema>[]
}) {

  const [data, setData] = React.useState(() => initialData)
  const [rowSelection, setRowSelection] = React.useState({})
  const [tab, setTab] = React.useState("all");
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [globalFilter, setGlobalFilter] = React.useState("")
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  })
  const sortableId = React.useId()
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  )



  // Count each category based on payment status or package type
  const tabCounts = React.useMemo(() => {
    let all = 0, inActive = 0, paid = 0, pending = 0, cancel = 0, free = 0

    for (const d of data) {
      if (d.is_active) all++
      if (!d.is_active) inActive++
      if (d.payment_status === 'paid') paid++
      if (d.payment_status === 'unpaid' && d.current_package !== 'free') pending++
      if (d.payment_status === 'cancel') cancel++
      if (d.current_package === 'free') free++
    }

    return {
      all,
      inActive,
      paid,
      pending,
      cancel,
      free,
    }
  }, [data])

  // Destructure tab counts
  const {
    all: allTabCount,
    inActive: inActiveTabCount,
    paid: paidTabCount,
    pending: pendingTabCount,
    cancel: cancelTabCount,
    free: freeTabCount,
  } = tabCounts

  // Filter data based on current tab
  const filteredData = React.useMemo(() => {
    switch (tab) {
      case tabTypes.ALL:
        return data.filter(p => p.is_active)

      case tabTypes.INACTIVE:
        return data.filter(p => p.is_active === false)

      case tabTypes.PAID:
        return data.filter(p => p.payment_status === 'paid')

      case tabTypes.PENDING:
        return data.filter(p => p.payment_status === 'unpaid' && p.current_package !== 'free')

      case tabTypes.CANCEL:
        return data.filter(p => p.payment_status === 'cancel')

      case tabTypes.FREE:
        return data.filter(p => p.current_package === 'free')

      default:
        return data
    }
  }, [data, tab])

  // Get only the IDs from the filtered data
  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => filteredData.map(({ id }) => id),
    [filteredData]
  )

  const globalFilterFn: FilterFn<z.infer<typeof userSchema>> = (row, columnId, filterValue) => {
    const search = filterValue.toLowerCase()

    return (
      String(row.original.order_number).toLowerCase().includes(search) ||
      String(row.original.full_name).toLowerCase().includes(search)
    )
  }

  const [startopen, setStartOpen] = React.useState(false)
  const [endopen, setEndOpen] = React.useState(false)
  const [startdate, setStartDate] = React.useState<Date | undefined>(
    new Date("2025-01-01")
  )
  const [startmonth, setStartMonth] = React.useState<Date | undefined>(startdate)
  const [startvalue, setStartValue] = React.useState(formatDate(startdate))

  const [enddate, setEndDate] = React.useState<Date | undefined>(
    new Date("2025-01-01")
  )
  const [endmonth, setEndMonth] = React.useState<Date | undefined>(enddate)
  const [endvalue, setEndValue] = React.useState(formatDate(enddate))

  // Custom Date Range Filter Function
  const dateRangeFilter: FilterFn<z.infer<typeof userSchema>> = (row, columnId, value) => {
    const date = new Date(row.getValue(columnId)).getTime()
    const start = value?.start ? new Date(value.start).getTime() : -Infinity
    const end = value?.end ? new Date(value.end).getTime() : Infinity
    return date >= start && date <= end
  }


  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
      globalFilter,
    },
    getRowId: (row) => row.id.toString(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn,
    filterFns: {
      dateRange: dateRangeFilter,
    },
  })

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (active && over && active.id !== over.id) {
      setData((data) => {
        const oldIndex = dataIds.indexOf(active.id)
        const newIndex = dataIds.indexOf(over.id)
        return arrayMove(data, oldIndex, newIndex)
      })
    }
  }

  // Apply filter when dates change
  // React.useEffect(() => {
  //   const column = table.getColumn("date")
  //   if (column) {
  //     column.setFilterValue({
  //       start: startdate,
  //       end: enddate,
  //     })
  //   }
  // }, [startdate, enddate])

  return (
    <Tabs
      value={tab} onValueChange={(value) => setTab(value)}
      className="w-full flex-col justify-start gap-6"
    >
      <div className="flex items-center justify-between px-4 lg:px-6">
        <Label htmlFor="view-selector" className="sr-only">
          View
        </Label>
        <TabsList className="**:data-[slot=badge]:bg-muted-foreground/30   **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 space-x-3  @4xl/main:flex">
          <TabsTrigger
            value="all">
            All <Badge variant="secondary">{allTabCount}</Badge>
          </TabsTrigger>
          <TabsTrigger value="inactive">
            Disable <Badge variant="secondary">{inActiveTabCount}</Badge>
          </TabsTrigger>
          <TabsTrigger value="paid">
            Paid <Badge variant="secondary">{paidTabCount}</Badge>
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending <Badge variant="secondary">{pendingTabCount}</Badge>
          </TabsTrigger>
          <TabsTrigger value="cancel">
            Cancel <Badge variant="secondary">{cancelTabCount}</Badge>
          </TabsTrigger>
          <TabsTrigger value="free">
            Free <Badge variant="secondary">{freeTabCount}</Badge>
          </TabsTrigger>
        </TabsList>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <IconLayoutColumns />
                <span className="hidden lg:inline">Customize Columns</span>
                <span className="lg:hidden">Columns</span>
                <IconChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {table
                .getAllColumns()
                .filter(
                  (column) =>
                    typeof column.accessorFn !== "undefined" &&
                    column.getCanHide()
                )
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" size="sm">
            <IconPlus />
            <span className="hidden lg:inline">Add Section</span>
          </Button>
        </div>
      </div>
      <div className="flex flex-row gap-8 px-4 lg:px-6">
        <div className="flex flex-none flex-col gap-3">
          <Label htmlFor="startdate" className="px-1">
            Start Date
          </Label>
          <div className="relative flex gap-2">
            <Input
              id="startdate"
              value={startvalue}
              placeholder="June 01, 2025"
              className="bg-background pr-10"
              onChange={(e) => {
                const date = new Date(e.target.value)
                setStartValue(e.target.value)
                if (isValidDate(date)) {
                  setStartDate(date)
                  setStartMonth(date)
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown") {
                  e.preventDefault()
                  setStartOpen(true)
                }
              }}
            />
            <Popover open={startopen} onOpenChange={setStartOpen}>
              <PopoverTrigger asChild>
                <Button
                  id="date-picker"
                  variant="ghost"
                  className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
                >
                  <CalendarIcon className="size-3.5" />
                  <span className="sr-only">Select date</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto overflow-hidden p-0"
                align="end"
                alignOffset={-8}
                sideOffset={10}
              >
                <Calendar
                  mode="single"
                  selected={startdate}
                  captionLayout="dropdown"
                  month={startmonth}
                  onMonthChange={setStartMonth}
                  onSelect={(date) => {
                    setStartDate(date)
                    setStartValue(formatDate(date))
                    setStartOpen(false)
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <div className="flex flex-none flex-col gap-3">
          <Label htmlFor="enddate" className="px-1">
            End Date
          </Label>
          <div className="relative flex gap-2">
            <Input
              id="enddate"
              value={endvalue}
              placeholder="June 01, 2025"
              className="bg-background pr-10"
              onChange={(e) => {
                const date = new Date(e.target.value)
                setEndValue(e.target.value)
                if (isValidDate(date)) {
                  setEndDate(date)
                  setEndMonth(date)
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown") {
                  e.preventDefault()
                  setEndOpen(true)
                }
              }}
            />
            <Popover open={endopen} onOpenChange={setEndOpen}>
              <PopoverTrigger asChild>
                <Button
                  id="date-picker"
                  variant="ghost"
                  className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
                >
                  <CalendarIcon className="size-3.5" />
                  <span className="sr-only">Select date</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto overflow-hidden p-0"
                align="end"
                alignOffset={-8}
                sideOffset={10}
              >
                <Calendar
                  mode="single"
                  selected={enddate}
                  captionLayout="dropdown"
                  month={endmonth}
                  onMonthChange={setEndMonth}
                  onSelect={(date) => {
                    setEndDate(date)
                    setEndValue(formatDate(date))
                    setEndOpen(false)
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-3">
          <Label htmlFor="enddate" className="px-1">
            Search
          </Label>
          <SearchInput value={globalFilter} onChange={(e) => setGlobalFilter(e.target.value)} />
        </div>

      </div>
      <TabsContent
        value={tab}
        className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
      >
        <div className="overflow-hidden rounded-lg border">
          <DndContext
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={handleDragEnd}
            sensors={sensors}
            id={sortableId}
          >
            <Table>
              <TableHeader className="bg-muted sticky top-0 z-10">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id} colSpan={header.colSpan}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                        </TableHead>
                      )
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody className="**:data-[slot=table-cell]:first:w-8">
                {table.getRowModel().rows?.length ? (
                  <SortableContext
                    items={dataIds}
                    strategy={verticalListSortingStrategy}
                  >
                    {table.getRowModel().rows.map((row) => (
                      <DraggableRow key={row.id} row={row} />
                    ))}
                  </SortableContext>
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </DndContext>
        </div>
        <div className="flex items-center justify-between px-4">
          <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="flex w-full items-center gap-8 lg:w-fit">
            <div className="hidden items-center gap-2 lg:flex">
              <Label htmlFor="rows-per-page" className="text-sm font-medium">
                Rows per page
              </Label>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value))
                }}
              >
                <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                  <SelectValue
                    placeholder={table.getState().pagination.pageSize}
                  />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-fit items-center justify-center text-sm font-medium">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </div>
            <div className="ml-auto flex items-center gap-2 lg:ml-0">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to first page</span>
                <IconChevronsLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to previous page</span>
                <IconChevronLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to next page</span>
                <IconChevronRight />
              </Button>
              <Button
                variant="outline"
                className="hidden size-8 lg:flex"
                size="icon"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to last page</span>
                <IconChevronsRight />
              </Button>
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  )
}




function TableCellViewer({ item }: { item: z.infer<typeof userSchema> }) {
  const isMobile = useIsMobile()
  
  return (
    <Drawer direction={isMobile ? "bottom" : "right"}>
      <DrawerTrigger asChild>
        <Button variant="link" className="text-foreground w-fit px-0 text-left" disabled={!item.is_active}>
          <div className="w-32 flex flex-row gap-4 items-center mt-3">

            <Avatar className="size-12">
              <AvatarImage src={item.avatar_url || ""} alt="@shadcn" />
              <AvatarFallback>{item.full_name?.split(' ').map(word => word[0]).join('').slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>

            <div>
              <h4 className="font-medium text-[16px]">{item.full_name}</h4>
              <p className="text-gray-500 text-[14px]">{item.email}</p>
            </div>
          </div>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="gap-1">
          <DrawerTitle className="flex flex-col items-center">
            <Avatar className="size-30 overflow-visible items-center justify-center">
              <AvatarImage className="size-20 rounded-full" src={item.avatar_url || ""} alt="@shadcn" />
              <AvatarFallback>{item.full_name?.split(' ').map(word => word[0]).join('').slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-medium text-2xl mt-5">{item.full_name}</h4>
            </div>
          </DrawerTitle>
          <DrawerDescription className="sr-only">
            Showing total visitors for the last 6 months
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
          {!isMobile && (
            <>

              <Separator />
            </>
          )}
          <form className="flex flex-col gap-4">
            <div className="flex flex-col gap-3">
              <Label htmlFor="user">User</Label>
              <Input readOnly id="user" value={item.full_name ?? ""} />
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="email">Email</Label>
              <Input readOnly id="email" value={item.email} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="packageuser">Package</Label>
                <Input readOnly value={item.current_package === "free" ? "Basic" : "Personal"} />
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="status">Status</Label>
                <Input readOnly value={item.payment_status === "unpaid" && item.price === 0 ? "Free" : "Paid"} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="storage">Storage</Label>
                <Input readOnly id="storage" value={item.storage_limit_gb} />
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="date">Date</Label>
                <Input readOnly id="date" value={new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(item.created_at))} />
              </div>
            </div>

          </form>
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button>Done</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}