import Table from "./table";
import Search from "./search";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function Index({
  searchParams,
}: {
  searchParams: { search?: string; page?: string };
}) {
  const url = new URL("https://api.razzakfashion.com");

  if (searchParams?.page) {
    url.searchParams.set("page", searchParams.page);
  }

  if (searchParams?.search) {
    url.searchParams.set("search", searchParams.search);
    url.searchParams.delete("page");
  }

  const response = await fetch(url.toString());
  const { data, ...metadata } = await response.json();

  return (
    <div className="mx-auto w-full max-w-3xl overflow-hidden rounded-lg px-8 flex items-center flex-col justify-center">
      <div className="self-start">
        <Search />
      </div>
      <div className="mt-6 w-full border border-gray-700 rounded overflow-hidden">
        <Table data={data} />
      </div>
      <div className="flex justify-end gap-8 py-6 items-center self-end">
        <div className="">
          <strong>
            {(metadata.current_page - 1) * metadata.per_page + 1 || 1}
          </strong>{" "}
          -{" "}
          <strong>
            {metadata.current_page * metadata.per_page >= metadata.total
              ? metadata.total
              : metadata.current_page * metadata.per_page}
          </strong>{" "}
          of <strong>{metadata.total}</strong>
        </div>
        <div className="flex gap-4">
          <Link
            className={cn(
              "border border-blue-500 text-gray-100 px-4 py-1 rounded",
              !metadata.prev_page_url && "pointer-events-none opacity-50"
            )}
            href={`/?page=${
              searchParams.page && +searchParams.page > 1
                ? +searchParams.page - 1
                : 1
            }`}
          >
            Prev
          </Link>
          <Link
            className={cn(
              "border border-blue-500 text-gray-100 px-4 py-1 rounded",
              !metadata.next_page_url && "pointer-events-none opacity-50"
            )}
            href={`/?page=${searchParams.page ? +searchParams.page + 1 : 2}`}
          >
            Next
          </Link>
        </div>
      </div>
    </div>
  );
}
