import { View, Pressable } from "react-native";
import { Text } from "@/components/ui/text";
import { useColor } from "@/hooks/useColor";
import globalStyles from "@/starkwind/globalStyle";
import { LucideProps } from "lucide-react-native";
import { Href, useRouter } from "expo-router";

const RecentActivity = ({
  Icon,
  age,
  service,
  state,
  route,
}: {
  Icon: React.ComponentType<LucideProps>;
  age: string;
  service: string;
  state: string;
  route: Href;
}) => {
  const green = useColor("green");
  const borderColor = useColor("muted");
  const cardColor = useColor("card");
  const router = useRouter();

  return (
    <Pressable
      style={({ pressed }) => [
        {
          backgroundColor: borderColor,
          borderRadius: 20,
          paddingVertical: 12,
          width: "100%",
          ...globalStyles.flexBoxHorizantal,
          justifyContent: "flex-start",
          paddingLeft: 10,
          position: "relative",
        },
        pressed && { opacity: 0.5 },
      ]}
      onPress={() => router.push(`/hub${route}` as Href)}
    >
      <View
        style={{
          backgroundColor: cardColor,
          padding: 15,
          borderRadius: 18,
          marginRight: 10,
        }}
      >
        <Icon color={green} />
      </View>
      <View
        style={{
          ...globalStyles.flexBox,
          width: "75%",
          alignItems: "flex-start",
        }}
      >
        <Text numberOfLines={2} style={{ maxWidth: "65%", fontSize: 15 }}>
          {`${service} • ${state}`}
        </Text>
        <Text variant="caption" style={{ fontSize: 12 }}>
          {age}
        </Text>
      </View>
    </Pressable>
  );
};

export default RecentActivity;
