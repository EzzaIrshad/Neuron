"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useTableFilterStore } from "@/stores/useTableFilterStore";
import { toast } from "sonner";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown, ChevronUp, MoreHorizontal } from "lucide-react";
import { Carousel, Card } from "@/components/ui/apple-cards-carousel";
import { useAuthStore } from "@/stores/useAuthStore";
import { useCloudStore } from "@/stores/useCloudStore";
import { CloudModel } from "@/types/CloudModel";
import { createClient } from "@/lib/supabase/client";

export default function Home() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { files, fetchFiles, updateFile } = useCloudStore();
  const [editFileId, setEditFileId] = useState<string>("");
  const [editName, setEditName] = useState("");
  const [previewImageSrc, setPreviewImageSrc] = useState<string | null>(null);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const { search } = useTableFilterStore();
  const supabase = createClient();

  async function fetchUsersByEmails(emails: string[]) {
    // Step 1: Set allowed emails using your RPC function
    const { error: rpcError } = await supabase.rpc('set_allowed_emails', {
      allowed_emails: emails,
    });

    if (rpcError) {
      console.error('Error setting allowed emails:', rpcError);
      return null;
    }

    // Step 2: Now fetch the users
    const { data: users, error } = await supabase
      .from('profiles')
      .select('id, email')
      .in('email', ['mahnoorbabar61@gmail.com']);

    if (error) {
      console.error('Error fetching users:', error);
      return null;
    }

    return users;
  }

  // ✅ Example usage
  const emailArray = ['mahnoorbabar61@gmail.com', 'fitmorelifenow@gmail.com'];

  fetchUsersByEmails(emailArray).then((users) => {
    if (users?.length) {
      console.log('✅ Fetched users:', users);
    } else {
      console.log('❌ No users found for the given emails.');
    }
  });

  // // Redirect to login if not authenticated
  // useEffect(() => {
  //   if (!user?.id) {
  //     router.push("/");
  //   }
  // }, [user, router]);

  // Fetch files for authenticated user
  useEffect(() => {
    if (user?.id) {
      fetchFiles(user.id).catch((error) =>
        toast.error(`Failed to fetch recent files: ${error.message}`)
      );
    }
  }, [user, fetchFiles]);

  // Sync search from Zustand with table column filters
  useEffect(() => {
    setColumnFilters([{ id: "name", value: search }]);
  }, [search]);

  // Memoize recent images for Carousel
  const recentImages = useMemo(
    () =>
      files
        .filter((file) => file.type === "image" && !file.is_trashed && file.file_url)
        .map((file) => ({
          id: file.id,
          src: file.file_url,
          throwback: `Uploaded on ${new Date(file.created_at!).toLocaleDateString()}`,
          date: new Date(file.created_at!).getFullYear().toString(),
        })),
    [files]
  );


  const columns: ColumnDef<CloudModel>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          {column.getIsSorted() === "asc" ? (
            <ChevronUp className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <ChevronDown className="ml-2 h-4 w-4" />
          ) : null}
        </Button>
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {row.original.is_folder ? (
            <Image
              src="/images/icons/folder-icon.png"
              alt="Folder"
              width={16}
              height={16}
            />
          ) : row.original.type === "image" ? (
            <Image
              src="/images/icons/image-icon.png"
              alt="Image"
              width={16}
              height={16}
            />
          ) : row.original.type === "video" ? (
            <Image
              src="/images/icons/video-icon.png"
              alt="Video"
              width={16}
              height={16}
            />
          ) : row.original.type === "audio" ? (
            <Image
              src="/images/icons/audio-icon.png"
              alt="Audio"
              width={16}
              height={16}
            />
          ) : row.original.file_extension === "pdf" ? (
            <Image
              src="/images/icons/file-icon.png"
              alt="PDF"
              width={16}
              height={16}
            />
          ) : (
            "📄"
          )}
          {row.getValue("name")}
        </div>
      ),
    },
    {
      accessorKey: "updated_at",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Modified
          {column.getIsSorted() === "asc" ? (
            <ChevronUp className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <ChevronDown className="ml-2 h-4 w-4" />
          ) : null}
        </Button>
      ),
      cell: ({ row }) =>
        new Date(row.getValue("updated_at")).toLocaleDateString(),
    },
    {
      accessorKey: "size",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          File Size
          {column.getIsSorted() === "asc" ? (
            <ChevronUp className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <ChevronDown className="ml-2 h-4 w-4" />
          ) : null}
        </Button>
      ),
      cell: ({ row }) =>
        row.original.is_folder
          ? "-"
          : `${((row.getValue("size") as number) / 1024 / 1024).toFixed(2)} MB`,
    },
    {
      accessorKey: "is_shared",
      header: "Sharing",
      cell: ({ row }) => (row.getValue("is_shared") ? "Shared" : "Private"),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const file = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  setEditFileId(file.id);
                  setEditName(file.name);
                }}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={async () => {
                  try {
                    await useCloudStore.getState().deleteFile(file.id);
                    useCloudStore.setState((state) => ({
                      files: state.files.filter((f) => f.id !== file.id),
                    }));
                    toast.success(`${file.name} moved to trash`);
                  } catch (error: unknown) {
                    toast.error(`Failed to delete ${file.name}: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
                  }
                }}
              >
                Delete
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  if (file.is_folder) {
                    router.push(`/cloud/files?folder=${file.id}`);
                  } else if (file.file_extension === "pdf") {
                    window.open(file.file_url, "_blank");
                  } else if (file.type === "image" || file.type === "video") {
                    setPreviewImageSrc(file.file_url);
                  }
                }}
              >
                View
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: files,
    columns,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      rowSelection,
      columnFilters,
    },
  });

  const handleEdit = async () => {
    if (!editName.trim()) {
      toast.error("Name cannot be empty");
      return;
    }
    if (/[<>:"/\\|?*]/.test(editName)) {
      toast.error("Name contains invalid characters");
      return;
    }
    try {
      await updateFile(editFileId, { name: editName });
      toast.success(`Renamed to ${editName}`);
      setEditFileId("");
      setEditName("");
    } catch (error: unknown) {
      toast.error(`Failed to rename: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
    }
  };

  const cards = recentImages.map((card, index) => (
    <Card key={card.id} card={card} index={index} />
  ));

  if (!user?.id) {
    return null; // Render nothing while redirecting
  }

  return (
    <div className="w-full px-6 py-4">
      {files.length === 0 && !recentImages.length ? (
        <div className="flex flex-col items-center justify-center text-2xl h-[70vh]">
          <span className="text-[22px] font-medium">
            Your recent files will show up here.
          </span>
          <Image
            src="/images/recentFiles.png"
            alt="Cloud"
            width={200}
            height={200}
          />
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <h2 className="text-[clamp(1rem,1.5vw,1.5rem)] font-medium">
              Recent Images
            </h2>
            <div className="w-full">
              <Carousel items={cards} />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="text-[clamp(1rem,1.5vw,1.5rem)] font-medium">
              Recent Files
            </h2>
            <div className="rounded-md border bg-white">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={columns.length} className="h-24 text-center">
                        No results.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      )}

      <Dialog open={!!editFileId} onOpenChange={() => setEditFileId("")}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit File Name</DialogTitle>
          </DialogHeader>
          <Input
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            placeholder="Enter new file name"
          />
          <DialogFooter>
            <Button variant="ghost" onClick={() => setEditFileId("")}>
              Cancel
            </Button>
            <Button onClick={handleEdit}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {previewImageSrc && (
        <Dialog open={!!previewImageSrc} onOpenChange={() => setPreviewImageSrc(null)}>
          <DialogContent className="w-full h-auto p-0 overflow-hidden" >
            <DialogTitle className="sr-only">Preview</DialogTitle>
            {previewImageSrc.endsWith(".mp4") ? (
              <video controls className="w-full h-auto">
                <source src={previewImageSrc} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <Image src={previewImageSrc} alt="Preview" width={1920} height={1080} className="h-auto" />
            )}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}