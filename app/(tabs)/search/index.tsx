import React, { useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, Pressable, TextInput, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Href, useRouter } from "expo-router";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  CreditCard,
  FileText,
  KeyRound,
  Landmark,
  LucideIcon,
  NotebookPen,
  Search as SearchIcon,
  Sparkles,
  Target,
  WalletCards,
  X,
} from "lucide-react-native";

import { Text } from "@/components/ui/text";
import { useColor } from "@/hooks/useColor";
import globalStyles from "@/starkwind/globalStyle";
import useAPICall, { APIPages } from "@/utils/apiCall";

type Filter = "All" | "Money" | "Vault";
type SearchResult = {
  id: string;
  title: string;
  subtitle: string;
  type: string;
  group: Exclude<Filter, "All">;
  route: Href;
  Icon: LucideIcon;
  amount?: string;
};
type Source = { page: APIPages; toResult: (item: any) => SearchResult };

const sources: Source[] = [
  {
    page: "expenses",
    toResult: (item) => ({
      id: item._id,
      title: item.merchant || "Untitled expense",
      subtitle: item.category || "Expense",
      type: "Expense",
      group: "Money",
      route: "/hub/expenses",
      Icon: WalletCards,
      amount: item.amount ? `PKR ${item.amount}` : undefined,
    }),
  },
  {
    page: "incomes",
    toResult: (item) => ({
      id: item._id,
      title: item.source || "Untitled income",
      subtitle: item.type || "Income",
      type: "Income",
      group: "Money",
      route: "/hub/income",
      Icon: BriefcaseBusiness,
      amount: item.amount ? `PKR ${item.amount}` : undefined,
    }),
  },
  {
    page: "subscriptions",
    toResult: (item) => ({
      id: item._id,
      title: item.subscriptionName || "Untitled subscription",
      subtitle:
        [item.category, item.billingCycle].filter(Boolean).join(" · ") ||
        "Subscription",
      type: "Subscription",
      group: "Money",
      route: "/hub/subscriptions",
      Icon: Landmark,
      amount: item.cost ? `PKR ${item.cost}` : undefined,
    }),
  },
  {
    page: "savings-goals",
    toResult: (item) => ({
      id: item._id,
      title: item.goalName || "Untitled savings goal",
      subtitle: item.category || "Savings goal",
      type: "Savings goal",
      group: "Money",
      route: "/hub/savings-goals",
      Icon: Target,
      amount: item.targetAmount ? `Goal · PKR ${item.targetAmount}` : undefined,
    }),
  },
  {
    page: "passwords",
    toResult: (item) => ({
      id: item._id,
      title: item.name || "Untitled credential",
      subtitle: item.username || "Saved credential",
      type: "Password",
      group: "Vault",
      route: "/hub/passwords",
      Icon: KeyRound,
    }),
  },
  {
    page: "cards",
    toResult: (item) => ({
      id: item._id,
      title: item.label || item.bank || item.brand || "Saved card",
      subtitle:
        [item.brand, item.bank].filter(Boolean).join(" · ") || "Payment card",
      type: "Card",
      group: "Vault",
      route: "/hub/cards",
      Icon: CreditCard,
    }),
  },
  {
    page: "notes",
    toResult: (item) => ({
      id: item._id,
      title: item.noteTitle || "Untitled note",
      subtitle: item.category || item.content || "Note",
      type: "Note",
      group: "Vault",
      route: "/hub/notes",
      Icon: NotebookPen,
    }),
  },
];

const suggestions = [
  { label: "Passwords", Icon: KeyRound, route: "/hub/passwords" as Href },
  { label: "Notes", Icon: NotebookPen, route: "/hub/notes" as Href },
  { label: "Expenses", Icon: WalletCards, route: "/hub/expenses" as Href },
  { label: "Cards", Icon: CreditCard, route: "/hub/cards" as Href },
];

export default function Search() {
  const router = useRouter();
  const apiCall = useAPICall();
  const apiCallRef = useRef(apiCall);
  const searchVersion = useRef(0);
  const inputRef = useRef<TextInput>(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("All");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const background = useColor("background");
  const foreground = useColor("foreground");
  const card = useColor("card");
  const muted = useColor("mutedForeground");
  const green = useColor("green");
  const red = useColor("red");
  const border = useColor("border");

  useEffect(() => {
    apiCallRef.current = apiCall;
  }, [apiCall]);

  useEffect(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const currentSearch = ++searchVersion.current;
    if (!normalizedQuery) {
      setResults([]);
      setIsLoading(false);
      setHasSearched(false);
      return;
    }
    const timeout = setTimeout(async () => {
      setIsLoading(true);
      setHasSearched(true);
      try {
        const responses = await Promise.all(
          sources.map(async (source) => {
            try {
              const response = await apiCallRef.current({
                page: source.page,
                method: "GET",
              });
              return response.success && Array.isArray(response.data)
                ? response.data.map(source.toResult)
                : [];
            } catch {
              return [];
            }
          }),
        );
        if (currentSearch === searchVersion.current) {
          setResults(
            responses
              .flat()
              .filter((item) =>
                `${item.title} ${item.subtitle} ${item.type}`
                  .toLowerCase()
                  .includes(normalizedQuery),
              ),
          );
        }
      } finally {
        if (currentSearch === searchVersion.current) setIsLoading(false);
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [query]);

  const visibleResults = useMemo(
    () => results.filter((item) => filter === "All" || item.group === filter),
    [filter, results],
  );
  const selectResult = (route: Href) => router.push(route);

  return (
    <View
      style={[
        globalStyles.globalPaddingContainer,
        { backgroundColor: background },
      ]}
    >
      <View style={styles.header}>
        <View>
          <Text variant="heading">Search</Text>
          <Text variant="caption" style={{ marginTop: 4 }}>
            Find anything across your vault.
          </Text>
        </View>
      </View>

      <View
        style={[
          styles.input,
          { backgroundColor: card, borderColor: query ? green : border },
        ]}
      >
        <SearchIcon size={23} color={query ? green : muted} />
        <TextInput
          ref={inputRef}
          value={query}
          onChangeText={setQuery}
          placeholder="Search notes, passwords, money..."
          placeholderTextColor={muted}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
          style={[styles.inputText, { color: foreground }]}
        />
        {query.length > 0 && (
          <Pressable
            onPress={() => setQuery("")}
            hitSlop={12}
            style={{ padding: 4 }}
          >
            <X size={19} color={muted} />
          </Pressable>
        )}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 140 }}
      >
        <View style={styles.filters}>
          {(["All", "Money", "Vault"] as Filter[]).map((item) => {
            const active = filter === item;
            return (
              <Pressable
                key={item}
                onPress={() => setFilter(item)}
                style={[
                  styles.filter,
                  {
                    backgroundColor: active ? foreground : card,
                    borderColor: border,
                  },
                  active && { borderWidth: 0 },
                ]}
              >
                <Text
                  style={{
                    color: active ? background : muted,
                    fontWeight: "700",
                    fontSize: 13,
                  }}
                >
                  {item}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {!query ? (
          <Browse
            selectResult={selectResult}
            card={card}
            green={green}
            border={border}
          />
        ) : isLoading ? (
          <View style={styles.loading}>
            <ActivityIndicator color={green} />
            <Text variant="caption">Searching your vault…</Text>
          </View>
        ) : (
          <View style={{ marginTop: 27 }}>
            <Text variant="subtitle">
              {visibleResults.length}{" "}
              {visibleResults.length === 1 ? "result" : "results"}
            </Text>
            {visibleResults.length > 0 ? (
              <View style={{ marginTop: 12, gap: 9 }}>
                {visibleResults.map((item) => (
                  <ResultRow
                    key={`${item.type}-${item.id}`}
                    item={item}
                    card={card}
                    border={border}
                    muted={muted}
                    green={green}
                    red={red}
                    onPress={() => selectResult(item.route)}
                  />
                ))}
              </View>
            ) : (
              hasSearched && <Empty card={card} muted={muted} />
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function Browse({
  selectResult,
  card,
  green,
  border,
}: {
  selectResult: (route: Href) => void;
  card: string;
  green: string;
  border: string;
}) {
  return (
    <>
      <View style={{ marginTop: 30 }}>
        <Text variant="subtitle">Browse your vault</Text>
        <Text variant="caption" style={{ marginTop: 5 }}>
          Jump straight to the things you use most.
        </Text>
      </View>
      <View style={styles.suggestions}>
        {suggestions.map(({ label, Icon, route }) => (
          <Pressable
            key={label}
            onPress={() => selectResult(route)}
            style={[
              styles.suggestion,
              { backgroundColor: card, borderColor: border },
            ]}
          >
            <View
              style={[styles.suggestionIcon, { backgroundColor: `${green}18` }]}
            >
              <Icon size={20} color={green} />
            </View>
            <Text style={{ fontWeight: "700", fontSize: 15 }}>{label}</Text>
          </Pressable>
        ))}
      </View>
      <View
        style={[
          styles.privateNote,
          { backgroundColor: `${green}10`, borderColor: `${green}30` },
        ]}
      >
        <View style={[styles.privateIcon, { backgroundColor: `${green}20` }]}>
          <FileText size={19} color={green} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontWeight: "700" }}>Private by design</Text>
          <Text variant="caption" style={{ fontSize: 13, marginTop: 2 }}>
            Passwords are searchable by service or username, never by their
            secret value.
          </Text>
        </View>
      </View>
    </>
  );
}

function ResultRow({
  item,
  card,
  border,
  muted,
  green,
  red,
  onPress,
}: {
  item: SearchResult;
  card: string;
  border: string;
  muted: string;
  green: string;
  red: string;
  onPress: () => void;
}) {
  const amountColor = item.type === "Expense" ? red : green;
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.result,
        {
          backgroundColor: card,
          borderColor: border,
          opacity: pressed ? 0.72 : 1,
        },
      ]}
    >
      <View style={[styles.resultIcon, { backgroundColor: `${green}16` }]}>
        <item.Icon size={20} color={green} />
      </View>
      <View style={styles.resultContent}>
        <Text numberOfLines={1} style={{ fontWeight: "700", fontSize: 15 }}>
          {item.title}
        </Text>
        <Text
          numberOfLines={1}
          variant="caption"
          style={{ fontSize: 13, marginTop: 2 }}
        >
          {item.subtitle}
        </Text>
      </View>
      <View style={{ alignItems: "flex-end", marginLeft: 10 }}>
        {item.amount && (
          <Text
            numberOfLines={1}
            style={{ color: amountColor, fontWeight: "700", fontSize: 12 }}
          >
            {item.amount}
          </Text>
        )}
        <Text style={{ color: muted, fontSize: 11, marginTop: 3 }}>
          {item.type}
        </Text>
      </View>
      <ArrowUpRight size={17} color={muted} style={{ marginLeft: 8 }} />
    </Pressable>
  );
}

function Empty({ card, muted }: { card: string; muted: string }) {
  return (
    <View style={styles.empty}>
      <View style={[styles.emptyIcon, { backgroundColor: card }]}>
        <SearchIcon size={23} color={muted} />
      </View>
      <Text variant="subtitle" style={{ marginTop: 16 }}>
        Nothing found
      </Text>
      <Text variant="caption" style={{ textAlign: "center", marginTop: 7 }}>
        Try a different keyword, or switch to another category.
      </Text>
    </View>
  );
}

const styles = {
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  } as const,
  sparkle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
  } as const,
  input: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 26,
    height: 66,
    paddingHorizontal: 21,
    borderRadius: 999,
    borderWidth: 1,
  } as const,
  inputText: {
    flex: 1,
    fontSize: 17,
    marginLeft: 14,
    paddingVertical: 0,
  } as const,
  filters: { flexDirection: "row", gap: 9, marginTop: 16 } as const,
  filter: {
    paddingHorizontal: 15,
    paddingVertical: 9,
    borderRadius: 999,
    borderWidth: 1,
  } as const,
  loading: { alignItems: "center", paddingTop: 52, gap: 12 } as const,
  suggestions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 18,
  } as const,
  suggestion: {
    width: "47%",
    minHeight: 112,
    padding: 16,
    justifyContent: "space-between",
    borderRadius: 18,
    borderWidth: 1,
  } as const,
  suggestionIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  } as const,
  privateNote: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    marginTop: 28,
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
  } as const,
  privateIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  } as const,
  result: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 17,
    borderWidth: 1,
  } as const,
  resultIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  } as const,
  resultContent: { flex: 1, minWidth: 0, marginLeft: 12 } as const,
  empty: {
    alignItems: "center",
    paddingTop: 54,
    paddingHorizontal: 28,
  } as const,
  emptyIcon: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: "center",
    justifyContent: "center",
  } as const,
};
