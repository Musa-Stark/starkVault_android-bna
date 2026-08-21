import React, { useCallback, useState } from "react";
import {
  Pressable,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import { Text } from "@/components/ui/text";
import {
  Check,
  Edit3,
  LucideIcon,
  Trash2,
} from "lucide-react-native";
import { useColor } from "@/hooks/useColor";
import { BORDER_RADIUS } from "@/theme/globals";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export type Item = {
  id: string;
  title: string;
  caption?: string;
  captionStyle?: TextStyle,
  Icon: LucideIcon;

  // Anything you want displayed on the right
  right?: {
    type: "text" | "icon";
    text?: string;
    textStyle?: TextStyle;
  };
};

type SelectableListItemProps = {
  item: Item;
  selected: boolean;
  selectionMode: boolean;
  onLongPress: () => void;
  onPress: () => void;
};

function SelectableListItem({
  item,
  selected,
  selectionMode,
  onLongPress,
  onPress,
}: SelectableListItemProps) {
  const foreground = useColor("foreground");
  const borderColor = useColor("muted");
  const cardColor = useColor("card");
  const background = useColor("background");

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      delayLongPress={400}
      style={({ pressed }) => [
        {
          minHeight: 65,
          flexDirection: "row",
          alignItems: "center",
          opacity: pressed ? 0.5 : 1,
        },
      ]}
    >
      {/* Left logo */}
      <View
        style={{
          backgroundColor: cardColor,
          padding: 15,
          borderRadius: 18,
          marginRight: 10,
        }}
      >
        {<item.Icon size={22} color={foreground} />}
      </View>

      {/* Heading + caption */}
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          minWidth: 0,
        }}
      >
        <Text numberOfLines={1}>{item.title}</Text>

        {item.caption && (
          <Text variant="caption" style={{ fontSize: 14, ...item.captionStyle }} numberOfLines={1}>
            {item.caption}
          </Text>
        )}
      </View>

      {/* Right content */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          marginLeft: 12,
        }}
      >
        {item.right?.type === "text" && (
          <Text variant="body" style={item.right.textStyle}>
            {item.right.text}
          </Text>
        )}

        {selectionMode ? (
          <View
            style={[
              {
                width: 22,
                height: 22,
                borderRadius: 11,
                borderWidth: 1.5,
                borderColor: "#D4D4D8",
                alignItems: "center",
                justifyContent: "center",
              },
              selected && {
                backgroundColor: foreground,
                borderColor: borderColor,
              },
            ]}
          >
            {selected && <Check size={15} color={background} strokeWidth={3} />}
          </View>
        ) : //   <ChevronRight size={18} color={foreground} />
        null}
      </View>
    </Pressable>
  );
}

type ViewAllProps = {
  items: Item[];
  onEdit?: (selectedItems: Item[]) => void;
  onDelete?: (selectedItems: Item[]) => void;
  style?: ViewStyle;
  header?: string;
};

export function ViewAll({
  items,
  onEdit,
  onDelete,
  style,
  header,
}: ViewAllProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const selectionMode = selectedIds.length > 0;

  const toggleSelection = useCallback((id: string) => {
    setSelectedIds((current) => {
      if (current.includes(id)) {
        return current.filter((itemId) => itemId !== id);
      }

      return [...current, id];
    });
  }, []);

  const enterSelectionMode = useCallback((id: string) => {
    setSelectedIds([id]);
  }, []);

  const handleEdit = () => {
    const selectedItems = items.filter((item) => selectedIds.includes(item.id));

    onEdit?.(selectedItems);
  };

  const handleDelete = () => {
    const selectedItems = items.filter((item) => selectedIds.includes(item.id));

    onDelete?.(selectedItems);
  };

  const cardColor = useColor("card");
  const foregroundColor = useColor("foreground");

  return (
    <View
      style={[
        {
          width: "100%",
          backgroundColor: cardColor,
          borderRadius: BORDER_RADIUS,
          padding: 18,
          paddingBottom: 0,
          shadowColor: foregroundColor,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 3,
          elevation: 1,
        },
        style,
      ]}
    >
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View>
          {header && (
            <Text
              style={{
                fontSize: 22,
                fontWeight: "700",
                color: foregroundColor,
              }}
            >
              {header}
            </Text>
          )}

          {selectionMode && (
            <Text
              style={{
                marginTop: 2,
                fontSize: 13,
                color: "#71717A",
              }}
            >
              {selectedIds.length} selected
            </Text>
          )}
        </View>

        {/* Top right actions */}
        {selectionMode && (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
            }}
          >
            {onEdit && (
              <Button
                onPress={handleEdit}
                hitSlop={8}
                icon={Edit3}
                size="icon"
                variant="ghost"
              />
            )}
            {onDelete && (
              <Button
                onPress={handleDelete}
                hitSlop={8}
                icon={Trash2}
                size="icon"
                variant="destructive"
              />
            )}
          </View>
        )}
      </View>

      {/* List */}
      <View
        style={{
          paddingBottom: 15,
          marginTop: 10,
        }}
      >
        {items.map((item, idx) => {
          const separate = idx !== items.length - 1;
          return (
            <React.Fragment key={`${idx}-fragment`}>
              <SelectableListItem
                key={idx}
                item={item}
                selected={selectedIds.includes(item.id)}
                selectionMode={selectionMode}
                onLongPress={() => enterSelectionMode(item.id)}
                onPress={() => {
                  if (selectionMode) {
                    toggleSelection(item.id);
                  }
                }}
              />
              {separate && <Separator key={`${idx}-separator`} />}
            </React.Fragment>
          );
        })}
      </View>
    </View>
  );
}
