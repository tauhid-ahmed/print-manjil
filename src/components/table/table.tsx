"use client";

import * as React from "react";
import { ArrowUpDown, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

type SortDirection = "asc" | "desc";
type SortField = "id" | "name" | "email";

interface TableProps {
  data: Array<{
    id: string | number;
    name: string;
    email: string;
  }>;
}

export default function Table({ data }: TableProps) {
  const [sort, setSort] = React.useState<`${SortField}:${SortDirection}` | "">(
    ""
  );
  const [selectedRows, setSelectedRows] = React.useState<Set<string | number>>(
    new Set()
  );

  const handleSort = (field: SortField) => {
    setSort((prevSort) => {
      const [prevField, prevOrder] = prevSort
        ? (prevSort.split(":") as [SortField, SortDirection])
        : [];
      if (field !== prevField) return `${field}:asc`;
      if (prevOrder === "asc") return `${field}:desc`;
      return "";
    });
  };

  const sortedData = React.useMemo(() => {
    if (!sort) return data;

    const [field, direction] = sort.split(":") as [SortField, SortDirection];

    return [...data].sort((a, b) => {
      const valueA = a[field];
      const valueB = b[field];

      let compareValue = 0;

      if (typeof valueA === "number" && typeof valueB === "number") {
        compareValue = valueA - valueB;
      } else {
        compareValue = String(valueA)
          .toLowerCase()
          .localeCompare(String(valueB).toLowerCase());
      }

      return direction === "asc" ? compareValue : -compareValue;
    });
  }, [data, sort]);

  const toggleAllRows = () => {
    if (selectedRows.size === data.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(data.map((row) => row.id)));
    }
  };

  const toggleRow = (id: string | number) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedRows(newSelected);
  };

  return (
    <table className="w-full divide-y divide-gray-700">
      <TableHead
        onSort={handleSort}
        currentSort={sort}
        onSelectAll={toggleAllRows}
        allSelected={selectedRows.size === data.length}
        someSelected={selectedRows.size > 0 && selectedRows.size < data.length}
      />
      <TableBody
        data={sortedData}
        selectedRows={selectedRows}
        onToggleRow={toggleRow}
      />
    </table>
  );
}

interface TableHeadProps {
  onSort: (field: SortField) => void;
  currentSort: `${SortField}:${SortDirection}` | "";
  onSelectAll: () => void;
  allSelected: boolean;
  someSelected: boolean;
}

function TableHead({
  onSort,
  currentSort,
  onSelectAll,
  allSelected,
  someSelected,
}: TableHeadProps) {
  const getSortIcon = (field: SortField) => {
    const [currentField, direction] = currentSort
      ? (currentSort.split(":") as [SortField, SortDirection])
      : [];

    if (field !== currentField) return <ArrowUpDown className="h-4 w-4" />;
    return direction === "asc" ? (
      <ChevronUp className="h-4 w-4" />
    ) : (
      <ChevronDown className="h-4 w-4" />
    );
  };

  return (
    <thead className="bg-gray-900">
      <tr>
        <th className="w-12 py-2 px-4">
          <Checkbox
            checked={allSelected}
            indeterminate={someSelected && !allSelected}
            onChange={onSelectAll}
          />
        </th>
        {[
          { key: "id" as const, label: "ID" },
          { key: "name" as const, label: "Name" },
          { key: "email" as const, label: "Email" },
        ].map(({ key, label }) => (
          <th
            key={key}
            className="p-4 text-left text-sm font-medium text-gray-300"
          >
            <button
              onClick={() => onSort(key)}
              className="inline-flex items-center gap-1 hover:text-gray-300"
            >
              {label}
              <span className="text-gray-300">{getSortIcon(key)}</span>
            </button>
          </th>
        ))}
      </tr>
    </thead>
  );
}

interface TableBodyProps {
  data: TableProps["data"];
  selectedRows: Set<string | number>;
  onToggleRow: (id: string | number) => void;
}

function TableBody({ data, selectedRows, onToggleRow }: TableBodyProps) {
  return (
    <tbody className="divide-y divide-gray-700">
      {data.map(({ id, name, email }) => (
        <tr
          key={id}
          className={cn(
            "hover:bg-gray-900",
            selectedRows.has(id) && "bg-gray-900"
          )}
        >
          <td className="w-12 py-2 px-4">
            <Checkbox
              checked={selectedRows.has(id)}
              onChange={() => onToggleRow(id)}
            />
          </td>
          <td className="p-4 text-sm text-gray-300">{id}</td>
          <td className="p-4 text-sm font-medium text-gray-300">{name}</td>
          <td className="p-4 text-sm text-gray-300">{email}</td>
        </tr>
      ))}
    </tbody>
  );
}

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  indeterminate?: boolean;
}

function Checkbox({ indeterminate = false, ...props }: CheckboxProps) {
  const ref = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (ref.current) {
      ref.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  return (
    <input
      ref={ref}
      type="checkbox"
      className="h-4 w-4 cursor-pointer rounded border-gray-700 text-blue-600 focus:ring-blue-500"
      {...props}
    />
  );
}
