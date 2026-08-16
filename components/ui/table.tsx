import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { View } from "@/components/ui/view";
import { useColor } from "@/hooks/useColor";
import { BORDER_RADIUS, FONT_SIZE, HEIGHT } from "@/theme/globals";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ChevronUp,
  Search,
} from "lucide-react-native";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ViewStyle,
} from "react-native";

// Types
export interface TableColumn<T = any> {
  id: string;
  header: string;
  accessorKey: string;
  sortable?: boolean;
  filterable?: boolean;
  width?: number | string;
  minWidth?: number;
  cell?: (value: any, row: T) => React.ReactNode;
  headerCell?: () => React.ReactNode;
  align?: "left" | "center" | "right";
}

export interface TableProps<T = any> {
  data: T[];
  columns: TableColumn<T>[];
  pagination?: boolean;
  pageSize?: number;
  searchable?: boolean;
  searchPlaceholder?: string;
  loading?: boolean;
  emptyMessage?: string;
  style?: ViewStyle;
  headerStyle?: ViewStyle;
  rowStyle?: ViewStyle;
  cellStyle?: ViewStyle;
  onRowPress?: (row: T, index: number) => void;
  sortable?: boolean;
  filterable?: boolean;
  onRowLongPress?: (row: T, index: number) => void;
}

type SortDirection = "asc" | "desc" | null;

interface SortState {
  column: string | null;
  direction: SortDirection;
}

export function Table<T = any>({
  data,
  columns,
  pagination = true,
  pageSize = 10,
  searchable = true,
  searchPlaceholder = "Search...",
  loading = false,
  emptyMessage = "No data available",
  style,
  headerStyle,
  rowStyle,
  cellStyle,
  onRowPress,
  sortable = true,
  filterable = true,
  onRowLongPress
}: TableProps<T>) {
  // Theme colors
  const borderColor = useColor("border");
  const textColor = useColor("text");
  const mutedColor = useColor("textMuted");
  const cardColor = useColor("card");
  const primaryColor = useColor("primary");

  // State
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortState, setSortState] = useState<SortState>({
    column: null,
    direction: null,
  });

  /**
   * Returns the horizontal alignment for a column.
   */
  const getAlignment = (
    column: TableColumn<T>,
  ): "flex-start" | "center" | "flex-end" => {
    switch (column.align) {
      case "center":
        return "center";
      case "right":
        return "flex-end";
      default:
        return "flex-start";
    }
  };

  /**
   * Shared column layout.
   *
   * IMPORTANT:
   * This is used by BOTH header and body cells so that the
   * columns always have exactly the same width and alignment.
   */
  const getColumnStyle = (column: TableColumn<T>): ViewStyle => ({
    flex: column.width ? 0 : 1,
    width: column.width as any,
    minWidth: column.minWidth ?? 100,
    paddingHorizontal: 18,
    paddingVertical: 16,
    justifyContent: "center",
    alignItems: getAlignment(column),
  });

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    let processedData = [...data];

    // Apply search filter
    if (searchQuery && filterable) {
      const normalizedQuery = searchQuery.toLowerCase();

      processedData = processedData.filter((row) =>
        columns.some((column) => {
          if (!column.filterable) return false;

          const value = (row as any)[column.accessorKey];

          return String(value ?? "")
            .toLowerCase()
            .includes(normalizedQuery);
        }),
      );
    }

    // Apply sorting
    if (sortState.column && sortState.direction && sortable) {
      processedData.sort((a, b) => {
        const aValue = (a as any)[sortState.column!];
        const bValue = (b as any)[sortState.column!];

        if (aValue === null || aValue === undefined) return 1;
        if (bValue === null || bValue === undefined) return -1;

        if (typeof aValue === "string" && typeof bValue === "string") {
          const comparison = aValue.localeCompare(bValue);

          return sortState.direction === "asc" ? comparison : -comparison;
        }

        if (aValue < bValue) {
          return sortState.direction === "asc" ? -1 : 1;
        }

        if (aValue > bValue) {
          return sortState.direction === "asc" ? 1 : -1;
        }

        return 0;
      });
    }

    return processedData;
  }, [data, searchQuery, sortState, columns, filterable, sortable]);

  // Pagination
  const totalPages = pagination
    ? Math.max(1, Math.ceil(filteredAndSortedData.length / pageSize))
    : 1;

  const startIndex = pagination ? (currentPage - 1) * pageSize : 0;

  const endIndex = pagination
    ? startIndex + pageSize
    : filteredAndSortedData.length;

  const paginatedData = filteredAndSortedData.slice(startIndex, endIndex);

  // Handlers
  const handleSort = (columnId: string) => {
    if (!sortable) return;

    const column = columns.find((col) => col.id === columnId);

    if (!column?.sortable) return;

    setSortState((prev) => {
      if (prev.column === columnId) {
        // Cycle through:
        // asc -> desc -> null
        const newDirection: SortDirection =
          prev.direction === "asc"
            ? "desc"
            : prev.direction === "desc"
              ? null
              : "asc";

        return {
          column: newDirection ? columnId : null,
          direction: newDirection,
        };
      }

      return {
        column: columnId,
        direction: "asc",
      };
    });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const renderSortIcon = (columnId: string) => {
    if (!sortable) return null;

    const column = columns.find((col) => col.id === columnId);

    if (!column?.sortable) return null;

    if (sortState.column !== columnId) {
      return (
        <ChevronUp size={16} color={mutedColor} style={{ opacity: 0.3 }} />
      );
    }

    return sortState.direction === "asc" ? (
      <ChevronUp size={16} color={primaryColor} />
    ) : (
      <ChevronDown size={16} color={primaryColor} />
    );
  };

  /**
   * Render a single body cell.
   */
  const renderCell = (column: TableColumn<T>, row: T, rowIndex: number) => {
    const value = (row as any)[column.accessorKey];

    const cellContent = column.cell
      ? column.cell(value, row)
      : String(value ?? "");

    const alignment = column.align ?? "left";

    return (
      <View
        key={`${column.id}-${rowIndex}`}
        style={[getColumnStyle(column), cellStyle]}
      >
        {typeof cellContent === "string" ? (
          <Text
            style={{
              width: "100%",
              fontSize: FONT_SIZE,
              textAlign: alignment,
            }}
          >
            {cellContent}
          </Text>
        ) : (
          cellContent
        )}
      </View>
    );
  };

  /**
   * Render table header.
   *
   * Uses the exact same column sizing rules as body cells.
   */
  const renderHeader = () => (
    <View
      style={[
        {
          flexDirection: "row",
          backgroundColor: cardColor,
          borderBottomWidth: 1,
          borderBottomColor: borderColor,
        },
        headerStyle,
      ]}
    >
      {columns.map((column) => {
        const alignment = column.align ?? "left";
        const isSortable = column.sortable && sortable;

        return (
          <TouchableOpacity
            key={column.id}
            style={[
              getColumnStyle(column),
              {
                flexDirection: "row",
                alignItems: "center",
                justifyContent: getAlignment(column),
              },
            ]}
            onPress={() => handleSort(column.id)}
            disabled={!isSortable}
            accessibilityRole={isSortable ? "button" : undefined}
            accessibilityLabel={
              isSortable
                ? `${column.header}, ${
                    sortState.column === column.id
                      ? sortState.direction === "asc"
                        ? "sorted ascending"
                        : "sorted descending"
                      : "not sorted"
                  }`
                : column.header
            }
          >
            {column.headerCell ? (
              column.headerCell()
            ) : (
              <>
                <Text
                  variant="subtitle"
                  style={{
                    flexShrink: 1,
                    textAlign: alignment,
                    marginRight: isSortable ? 4 : 0,
                  }}
                >
                  {column.header}
                </Text>

                {renderSortIcon(column.id)}
              </>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );

  /**
   * Render table row.
   */
  const renderRow = (row: T, index: number) => (
    <TouchableOpacity
      key={index}
      style={[
        {
          flexDirection: "row",
          backgroundColor: cardColor,
          borderBottomWidth: 1,
          borderBottomColor: borderColor,
        },
        rowStyle,
      ]}
      onPress={() => onRowPress?.(row, index)}
      onLongPress={() => onRowLongPress?.(row, index)}
      disabled={!onRowPress && !onRowLongPress}
      activeOpacity={onRowPress ? 0.7 : 1}
    >
      {columns.map((column) => renderCell(column, row, index))}
    </TouchableOpacity>
  );

  /**
   * Render pagination controls.
   */
  const renderPagination = () => {
    if (!pagination || totalPages <= 1) return null;

    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 16,
          paddingVertical: 18,
          backgroundColor: cardColor,
          borderTopWidth: 1,
          borderTopColor: borderColor,
        }}
      >
        <Text variant="caption">
          Page {currentPage} of {totalPages} ({filteredAndSortedData.length}{" "}
          total)
        </Text>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
          }}
        >
          <Button
            variant="outline"
            size="sm"
            onPress={() => handlePageChange(1)}
            disabled={currentPage === 1}
          >
            <ChevronsLeft
              size={16}
              color={currentPage === 1 ? mutedColor : textColor}
            />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onPress={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft
              size={16}
              color={currentPage === 1 ? mutedColor : textColor}
            />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onPress={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight
              size={16}
              color={currentPage === totalPages ? mutedColor : textColor}
            />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onPress={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
          >
            <ChevronsRight
              size={16}
              color={currentPage === totalPages ? mutedColor : textColor}
            />
          </Button>
        </View>
      </View>
    );
  };

  /**
   * Render search bar.
   */
  const renderSearchBar = () => {
    if (!searchable || !filterable) return null;

    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: cardColor,
          borderBottomWidth: 1,
          borderColor: borderColor,
          paddingHorizontal: 18,
          height: HEIGHT,
          marginVertical: 2,
        }}
      >
        <Search size={16} color={mutedColor} style={{ marginRight: 8 }} />

        <TextInput
          style={{
            flex: 1,
            fontSize: FONT_SIZE,
            color: textColor,
            paddingVertical: 8,
          }}
          placeholder={searchPlaceholder}
          placeholderTextColor={mutedColor}
          value={searchQuery}
          onChangeText={(value) => {
            setSearchQuery(value);
            setCurrentPage(1);
          }}
        />
      </View>
    );
  };

  /**
   * Render empty state.
   */
  const renderEmptyState = () => (
    <View
      style={{
        padding: 32,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: cardColor,
      }}
    >
      <Text variant="body" style={{ color: mutedColor }}>
        {emptyMessage}
      </Text>
    </View>
  );

  /**
   * Render loading state.
   */
  const renderLoadingState = () => (
    <View
      style={{
        padding: 32,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: cardColor,
      }}
    >
      <Text variant="body" style={{ color: mutedColor }}>
        Loading...
      </Text>
    </View>
  );

  return (
    <View
      style={[
        {
          width: "100%",
          borderRadius: BORDER_RADIUS,
          borderWidth: 1,
          borderColor: borderColor,
          backgroundColor: cardColor,
          overflow: "hidden",
        },
        style,
      ]}
    >
      {renderSearchBar()}

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={{ minWidth: "100%" }}>
          {renderHeader()}

          {loading ? (
            renderLoadingState()
          ) : paginatedData.length === 0 ? (
            renderEmptyState()
          ) : (
            <FlatList
              data={paginatedData}
              keyExtractor={(_, index) => String(index)}
              renderItem={({ item, index }) => renderRow(item, index)}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      </ScrollView>

      {renderPagination()}
    </View>
  );
}
