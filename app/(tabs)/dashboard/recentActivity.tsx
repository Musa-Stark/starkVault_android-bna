import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { useColor } from "@/hooks/useColor";
import globalStyles from "@/starkwind/globalStyle";
import { LucideProps } from "lucide-react-native";

const RecentActivity = ({
  Icon,
  age,
  service,
  state,
}: {
  Icon: React.ComponentType<LucideProps>;
  age: string;
  service: string;
  state: string;
}) => {
  const foreground = useColor("foreground");
  const borderColor = useColor("muted");
  const cardColor = useColor("card");

  return (
    <View
      style={{
        backgroundColor: borderColor,
        borderRadius: 20,
        paddingVertical: 15,
        width: "100%",
        ...globalStyles.flexBoxHorizantal,
        justifyContent: "flex-start",
        paddingLeft: 10,
        position: "relative",
      }}
    >
      <View
        style={{
          backgroundColor: cardColor,
          padding: 15,
          borderRadius: 18,
          marginRight: 10,
        }}
      >
        <Icon color={foreground} />
      </View>
      <View
        style={{
          ...globalStyles.flexBox,
          width: "75%",
          alignItems: "flex-start",
        }}
      >
        <Text numberOfLines={2} style={{ maxWidth: "65%", fontSize: 17 }}>
          {`${service} • ${state}`}
        </Text>
        <Text variant="caption" style={{ fontSize: 14 }}>{`${age} ago`}</Text>
      </View>
    </View>
  );
};

export default RecentActivity;
